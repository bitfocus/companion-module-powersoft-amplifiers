import fs from 'fs'
import path from 'path'
import process from 'process'
import got from 'got'

/*
Usage:
  node scripts/read-matrix-gain-save.mjs [baseUrl] [channel] [inputIndex]

Examples:
  node scripts/read-matrix-gain-save.mjs            # defaults to http://192.168.100.8:80, channel 0, input 10
  node scripts/read-matrix-gain-save.mjs http://192.168.100.8:80 0 10

This reads:
  /Device/Audio/Presets/Live/InputMatrix/Channels/Channel-{channel}/Gain-{inputIndex}/Value
and saves the amplifier reply to scripts/out/ as JSON.
*/

const baseUrl = (process.argv[2] || 'http://192.168.100.8:80').replace(/\/$/, '')
const channel = Number(process.argv[3] ?? 0)
const inputIndex = Number(process.argv[4] ?? 10)

const targetPath = `/Device/Audio/Presets/Live/InputMatrix/Channels/Channel-${channel}/Gain-${inputIndex}/Value`

const body = {
	version: '1.0.0',
	clientId: 'x8-panel',
	payload: {
		type: 100,
		action: {
			type: 10, // READ
			values: [
				{
					id: targetPath,
					data: { type: 20 }, // FLOAT
				},
			],
		},
	},
	tag: 1,
	updateId: 1,
}

const url = `${baseUrl}/am`

async function run() {
	console.log(`Reading matrix gain from ${url}`)
	console.log(`Path: ${targetPath}`)

	const res = await got(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		json: body,
		responseType: 'text',
		throwHttpErrors: false,
		https: { rejectUnauthorized: true },
		timeout: { request: 4000 },
	})

	const status = res.statusCode
	const rawText = res.body
	const headers = res.headers

	// Prepare output directory and filenames
	const outDir = path.resolve('scripts', 'out')
	fs.mkdirSync(outDir, { recursive: true })
	const ts = new Date().toISOString().replace(/[:.]/g, '-')
	const base = `matrix-gain-read_ch${channel}_in${inputIndex}_${ts}`
	const rawFile = path.join(outDir, `${base}.raw.json`)
	const prettyFile = path.join(outDir, `${base}.json`)
	const headersFile = path.join(outDir, `${base}.headers.json`)
	const logFile = path.join(outDir, `${base}.log.txt`)

	// Try parse JSON for pretty output
	let parsed
	try {
		parsed = rawText && rawText.length ? JSON.parse(rawText) : {}
	} catch {
		// keep parsed undefined
	}

	fs.writeFileSync(rawFile, rawText ?? '', 'utf8')
	if (parsed !== undefined) {
		fs.writeFileSync(prettyFile, JSON.stringify(parsed, null, 2), 'utf8')
	}
	try {
		fs.writeFileSync(headersFile, JSON.stringify(headers, null, 2), 'utf8')
	} catch {
		// ignore
	}

	const logLines = [`URL: ${url}`, `Path: ${targetPath}`, `Status: ${status}`, `Timestamp: ${new Date().toISOString()}`]
	try {
		fs.writeFileSync(logFile, logLines.join('\n') + '\n', 'utf8')
	} catch {
		// ignore
	}

	console.log(`HTTP status: ${status}`)
	console.log(`Saved raw response to: ${rawFile}`)
	if (parsed !== undefined) console.log(`Saved pretty JSON to: ${prettyFile}`)
	console.log(`Saved headers to: ${headersFile}`)
	console.log(`Saved log to: ${logFile}`)

	if (status < 200 || status >= 400) {
		console.error('Non-success status returned by amplifier')
		process.exitCode = 1
	}
}

run().catch((e) => {
	console.error('Request failed:', e && e.message ? e.message : e)
	process.exitCode = 1
})
