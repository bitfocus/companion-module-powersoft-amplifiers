import fs from 'fs'
import path from 'path'
import process from 'process'
import got from 'got'

function usage() {
	console.error('Usage: node scripts/api-probe.mjs <workflow.json>')
	throw new Error('Invalid arguments')
}

if (process.argv.length < 3) usage()

const workflowPath = path.resolve(process.argv[2])
if (!fs.existsSync(workflowPath)) {
	console.error(`Workflow file not found: ${workflowPath}`)
	throw new Error('Workflow file not found')
}

/**
 * Workflow schema (example):
 * {
 *   "baseUrl": "http://192.168.1.100",
 *   "ignoreTls": true,
 *   "defaultTimeoutMs": 3000,
 *   "steps": [
 *     {
 *       "name": "login",
 *       "method": "POST",
 *       "path": "/am",               // or other endpoint
 *       "headers": {"Content-Type": "application/json"},
 *       "json": { /* request body with {{var}} templating */ /* },
 *       "save": {
 *         "token": "body.token",     // dot-path in parsed JSON body
 *         "cookie": "header.set-cookie" // saves raw set-cookie header
 *       }
 *     },
 *     {
 *       "name": "readPower",
 *       "method": "POST",
 *       "path": "/am",
 *       "headers": {"Authorization": "Bearer {{token}}"},
 *       "json": {/* request body */ /*}
 *     }
 *   ]
 * }
 */

const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'))
const baseUrl = workflow.baseUrl?.replace(/\/$/, '') || ''
if (!baseUrl) {
	console.error('Missing baseUrl in workflow file')
	throw new Error('Missing baseUrl in workflow file')
}
const ignoreTls = Boolean(workflow.ignoreTls)
const defaultTimeoutMs = Number(workflow.defaultTimeoutMs || 3000)

const context = {}
let cookieJar = [] // simple cookie store

function tmpl(str, ctx) {
	if (!str || typeof str !== 'string') return str
	return str.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, k) => {
		const v = getByPath(ctx, k)
		return v === undefined || v === null ? '' : String(v)
	})
}

function getByPath(obj, p) {
	if (!p) return undefined
	return p.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

function setByPath(obj, p, val) {
	const parts = p.split('.')
	let cur = obj
	for (let i = 0; i < parts.length - 1; i++) {
		const k = parts[i]
		if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {}
		cur = cur[k]
	}
	cur[parts[parts.length - 1]] = val
}

function buildCookieHeader() {
	if (!cookieJar.length) return undefined
	// flatten simple cookie strings "k=v; Path=/;" -> we keep only k=v pairs
	const pairs = []
	for (const raw of cookieJar) {
		const first = String(raw).split(';')[0]
		if (first && !pairs.includes(first)) pairs.push(first)
	}
	return pairs.join('; ')
}

async function runStep(step) {
	const url = baseUrl + (step.path || '')
	const method = (step.method || 'GET').toUpperCase()
	const headers = {}
	const incomingHeaders = step.headers || {}
	for (const [k, v] of Object.entries(incomingHeaders)) headers[k] = tmpl(String(v), context)
	const cookieHeader = buildCookieHeader()
	if (cookieHeader) headers['Cookie'] = headers['Cookie'] ? headers['Cookie'] + '; ' + cookieHeader : cookieHeader

	const request = {
		method,
		headers,
		// Always fetch text to avoid parser errors on HTML pages
		responseType: 'text',
		throwHttpErrors: false,
		https: { rejectUnauthorized: !ignoreTls },
		timeout: { request: Number(step.timeoutMs || defaultTimeoutMs) },
	}

	if (step.json !== undefined) {
		request.json = JSON.parse(tmpl(JSON.stringify(step.json), context))
	}

	console.log(`\n==> ${step.name || 'step'} ${method} ${url}`)
	if (request.headers && Object.keys(request.headers).length) console.log('Headers:', request.headers)
	if (request.json !== undefined) console.log('Body:', request.json)

	let res
	try {
		res = await got(url, request)
	} catch (e) {
		console.error(`Request error: ${e.message || e}`)
		return { ok: false }
	}

	const status = res.statusCode
	const bodyText = res.body
	const rawHeaders = res.headers

	console.log(`<== status ${status}`)
	console.log('Response headers:', rawHeaders)

	// Parse body based on expectJson flag (defaults to true when sending JSON)
	const expectJson = step.expectJson !== undefined ? !!step.expectJson : step.json !== undefined
	let body = bodyText
	if (expectJson) {
		try {
			body = bodyText && bodyText.length ? JSON.parse(bodyText) : {}
		} catch {
			console.warn('Warning: response is not valid JSON, keeping as text')
		}
	}
	try {
		console.log('Response body:', body)
	} catch (e) {
		void e
	}

	// Save cookie(s)
	const setCookie = rawHeaders['set-cookie']
	if (setCookie) {
		cookieJar.push(...(Array.isArray(setCookie) ? setCookie : [setCookie]))
	}

	// Save variables
	if (step.save) {
		for (const [key, p] of Object.entries(step.save)) {
			let val
			if (typeof p === 'string') {
				if (p.toLowerCase().startsWith('header.')) {
					const hk = p.slice('header.'.length).toLowerCase()
					val = rawHeaders[hk]
				} else if (p.toLowerCase().startsWith('body.')) {
					const b = typeof body === 'object' && body !== null ? body : {}
					val = getByPath(b, p.slice('body.'.length))
				} else if (p === 'cookie') {
					val = buildCookieHeader()
				}
			}
			if (val !== undefined) {
				setByPath(context, key, val)
				console.log(`Saved ${key} =`, val)
			}
		}
	}

	return { ok: status >= 200 && status < 400, status, body }
}

async function run() {
	const steps = Array.isArray(workflow.steps) ? workflow.steps : []
	if (!steps.length) {
		console.error('No steps specified in workflow file')
		throw new Error('No steps specified in workflow file')
	}
	console.log('Starting probe with baseUrl', baseUrl)
	for (const step of steps) {
		const r = await runStep(step)
		if (!r.ok) {
			console.error('Step failed, stopping:', step.name || step.path)
			throw new Error('Step failed')
		}
	}
	console.log('\nProbe completed successfully.')
}

run().catch((e) => {
	console.error('Fatal error:', e)
	process.exitCode = 1
})
