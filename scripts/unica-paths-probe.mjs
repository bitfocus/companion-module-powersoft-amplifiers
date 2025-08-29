import fs from 'node:fs'
import path from 'node:path'
import got from 'got'

// Usage:
//   node scripts/unica-paths-probe.mjs <host> <port> [--https] [--auto-channels|--channels N] [--csv file] [--out file]
// Defaults:
//   --csv defaults to docs/UNICA/amplifier_settings.csv

const [, , host, portRaw, ...rest] = process.argv
if (!host || !portRaw) {
	throw new Error(
		'Usage: node scripts/unica-paths-probe.mjs <host> <port> [--https] [--auto-channels|--channels N] [--csv file] [--out file]',
	)
}

function parseFlags(args) {
	const flags = { https: false, autoChannels: false, channels: null, out: null, csv: null }
	for (let i = 0; i < args.length; i++) {
		const a = args[i]
		if (!a) continue
		if (a === 'https' || a === '--https') flags.https = true
		else if (a === '--auto-channels') flags.autoChannels = true
		else if (a === '--channels') {
			const v = Number(args[i + 1])
			if (!Number.isFinite(v) || v < 0) throw new Error('Invalid --channels value')
			flags.channels = v
			i++
		} else if (a === '--out') {
			const v = args[i + 1]
			if (!v) throw new Error('Missing filename after --out')
			flags.out = v
			i++
		} else if (a === '--csv') {
			const v = args[i + 1]
			if (!v) throw new Error('Missing filename after --csv')
			flags.csv = v
			i++
		}
	}
	return flags
}

const flagz = parseFlags(rest)
const useHttps = flagz.https
const port = Number(portRaw)
const scheme = useHttps ? 'https' : 'http'
const url = `${scheme}://${host}:${port}/am`

const DEFAULT_CSV = path.join(process.cwd(), 'docs', 'UNICA', 'amplifier_settings.csv')
const csvPath = flagz.csv ? (path.isAbsolute(flagz.csv) ? flagz.csv : path.join(process.cwd(), flagz.csv)) : DEFAULT_CSV
if (!fs.existsSync(csvPath)) {
	throw new Error(`Cannot find CSV file at ${csvPath}`)
}

const VALUE_TYPES = [
	{ code: 10, field: 'stringValue' },
	{ code: 40, field: 'boolValue' },
	{ code: 30, field: 'intValue' },
	{ code: 20, field: 'floatValue' },
	{ code: 50, field: 'floatArrayValue' },
	{ code: 60, field: 'uintValue' },
]

function buildReadPayload(pathId, valueType) {
	return {
		version: '1.0.0',
		clientId: 'x8-panel',
		payload: {
			type: 100, // ACTION
			action: {
				type: 10, // READ
				values: [
					{
						id: pathId,
						data: { type: valueType },
					},
				],
			},
		},
		tag: 1,
		updateId: 1,
	}
}

function analyzePlaceholders(p) {
	// Supports {0}, {0:N}, {1}, {1:N}
	const m0 = p.match(/\{0(?::(\d+))?\}/)
	const m1 = p.match(/\{1(?::(\d+))?\}/)
	const need0 = !!m0
	const need1 = !!m1
	const max0 = m0 && m0[1] ? Number(m0[1]) : null
	const max1 = m1 && m1[1] ? Number(m1[1]) : null
	return { need0, need1, max0, max1 }
}

function substitute(p, i0, i1) {
	return p.replace(/\{0(?::\d+)?\}/g, String(i0)).replace(/\{1(?::\d+)?\}/g, String(i1))
}

function loadUnicaCsv(p) {
	const raw = fs.readFileSync(p, 'utf8')
	const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0)
	const out = []
	// The first column is the path; header likely present if first line isn't a path starting with '/'
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		const firstComma = line.indexOf(',')
		if (firstComma <= 0) continue
		const first = line.slice(0, firstComma).trim()
		if (!first || first.toLowerCase().startsWith('path')) continue // skip header
		out.push(first)
	}
	return out
}

async function tryRead(pathId) {
	for (const vt of VALUE_TYPES) {
		const payload = buildReadPayload(pathId, vt.code)
		try {
			const res = await got.post(url, {
				json: payload,
				responseType: 'json',
				timeout: { request: 1500 },
				https: { rejectUnauthorized: false },
			})
			const data = res.body?.payload?.action?.values?.[0]?.data || {}
			for (const v of VALUE_TYPES) {
				if (data[v.field] !== undefined) {
					return { ok: true, valueType: v.code, field: v.field, raw: data[v.field] }
				}
			}
			if (data?.type === vt.code) {
				return { ok: true, valueType: vt.code, field: 'typeOnly' }
			}
		} catch {
			// try next type
		}
	}
	return { ok: false }
}

async function readDeviceChannels() {
	// Try typical channel count path
	try {
		const payload = buildReadPayload('/Device/Config/Hardware/Channels', 30)
		const res = await got.post(url, {
			json: payload,
			responseType: 'json',
			timeout: { request: 1500 },
			https: { rejectUnauthorized: false },
		})
		const d = res.body?.payload?.action?.values?.[0]?.data || {}
		const v = d.intValue ?? d.uintValue ?? d.stringValue
		const n = Number(v)
		if (Number.isFinite(n) && n > 0) return n
	} catch {
		// ignore, try next type
	}
	return 1
}

async function main() {
	const entries = loadUnicaCsv(csvPath)
	let channels = flagz.channels
	if (flagz.autoChannels && channels == null) channels = await readDeviceChannels()
	if (channels == null) channels = 1

	console.log(`Probing ${entries.length} UNICA paths on ${url} with channels=${channels} ...`)

	const results = []
	for (const p of entries) {
		const { need0, need1, max0, max1 } = analyzePlaceholders(p)
		const range0 = need0 ? (max0 != null ? max0 + 1 : channels) : 1
		const range1 = need1 ? (max1 != null ? max1 + 1 : channels) : 1
		for (let i0 = 0; i0 < range0; i0++) {
			for (let i1 = 0; i1 < range1; i1++) {
				const id = substitute(p, i0, i1)
				const r = await tryRead(id)
				results.push({ id, i0, i1, ...r })
				const status = r.ok ? `OK (type=${r.valueType}, field=${r.field})` : 'FAIL'
				console.log(`${id} -> ${status}`)
			}
		}
	}

	const okCount = results.filter((r) => r.ok).length
	console.log(`\nSummary: ${okCount}/${results.length} paths responded.`)

	if (flagz.out) {
		const report = {
			meta: {
				host,
				port,
				https: useHttps,
				channels,
				csv: path.relative(process.cwd(), csvPath),
				timestamp: new Date().toISOString(),
			},
			results,
		}
		try {
			fs.writeFileSync(flagz.out, JSON.stringify(report, null, 2))
			console.log(`Saved JSON report to ${flagz.out}`)
		} catch (e) {
			console.error(`Failed to write JSON report: ${e?.message || e}`)
		}
	}
}

main().catch((e) => {
	console.error(e)
	process.exitCode = 1
})
