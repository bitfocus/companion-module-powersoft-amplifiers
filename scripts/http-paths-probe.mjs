import fs from 'node:fs'
import path from 'node:path'
import got from 'got'

// Usage:
//   node scripts/http-paths-probe.mjs <host> <port> [https]
//   node scripts/http-paths-probe.mjs <host> <port> --https --auto-channels --out results.json
//   node scripts/http-paths-probe.mjs <host> <port> --channels 4 --out results.json
// Flags:
//   --https            Use HTTPS (instead of positional 'https')
//   --auto-channels    Read DEVICE_CHANNELS then sweep {0}/{1} 0..N-1
//   --channels N       Manually set channel count, sweep 0..N-1
//   --out file         Write JSON report to file

const [, , host, portRaw, ...rest] = process.argv
if (!host || !portRaw) {
	console.error(
		'Usage: node scripts/http-paths-probe.mjs <host> <port> [--https] [--auto-channels|--channels N] [--out file]',
	)
	throw new Error('Invalid arguments')
}

function parseFlags(args) {
	const flags = { https: false, autoChannels: false, channels: null, out: null }
	for (let i = 0; i < args.length; i++) {
		const a = args[i]
		if (!a) continue
		if (a === 'https' || a === '--https') flags.https = true
		else if (a === '--auto-channels') flags.autoChannels = true
		else if (a === '--channels') {
			const v = Number(args[i + 1])
			if (!Number.isFinite(v) || v < 0) {
				console.error('Invalid --channels value')
				throw new Error('Invalid --channels value')
			}
			flags.channels = v
			i++
		} else if (a === '--out') {
			const v = args[i + 1]
			if (!v) {
				console.error('Missing filename after --out')
				throw new Error('Missing filename after --out')
			}
			flags.out = v
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

function substitute(pathId, i0 = 0, i1 = 0) {
	// substitute for {0}, {1} placeholders
	return pathId.replaceAll('{0}', String(i0)).replaceAll('{1}', String(i1))
}

function loadCsv(csvPath) {
	const raw = fs.readFileSync(csvPath, 'utf8')
	const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0)
	const out = []
	for (let i = 1; i < lines.length; i++) {
		// skip header
		const idx = lines[i].indexOf(',')
		if (idx <= 0) continue
		const key = lines[i].slice(0, idx).trim()
		const pid = lines[i].slice(idx + 1).trim()
		if (pid) out.push({ key, id: pid })
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
			// if any known field is present, consider success
			for (const v of VALUE_TYPES) {
				if (data[v.field] !== undefined) {
					return { ok: true, valueType: v.code, field: v.field, raw: data[v.field] }
				}
			}
			// Sometimes a successful response returns same type back
			if (data?.type === vt.code) {
				return { ok: true, valueType: vt.code, field: 'typeOnly' }
			}
		} catch {
			// continue to next type
		}
	}
	return { ok: false }
}

async function readDeviceChannels() {
	// Try to read channel count from DEVICE_CHANNELS; fall back to 1
	try {
		const r = await tryRead('/Device/Config/Hardware/Channels')
		if (r.ok) {
			// normalize raw value if present, otherwise parse from stringValue/intValue
			if (r.raw !== undefined) {
				const n = Number(r.raw)
				if (Number.isFinite(n) && n >= 0) return n
			}
			// If we didn't capture raw, try another quick read prioritizing string/int
			const prefer = [10, 30]
			for (const t of prefer) {
				const payload = buildReadPayload('/Device/Config/Hardware/Channels', t)
				const res = await got.post(url, {
					json: payload,
					responseType: 'json',
					timeout: { request: 1500 },
					https: { rejectUnauthorized: false },
				})
				const d = res.body?.payload?.action?.values?.[0]?.data || {}
				const v = d.stringValue ?? d.intValue ?? d.uintValue
				const n = Number(v)
				if (Number.isFinite(n) && n >= 0) return n
			}
		}
	} catch (e) {
		void e
	}
	return 1
}

async function main() {
	const csvPath = path.join(process.cwd(), 'docs', 'parameter_paths.csv')
	if (!fs.existsSync(csvPath)) {
		console.error('Cannot find docs/parameter_paths.csv')
		throw new Error('Cannot find docs/parameter_paths.csv')
	}
	const entries = loadCsv(csvPath)
	let channels = flagz.channels
	if (flagz.autoChannels && channels == null) {
		channels = await readDeviceChannels()
	}
	if (channels == null) channels = 1

	console.log(`Probing ${entries.length} parameter keys on ${url} with channels=${channels} ...`)

	const results = []
	for (const ent of entries) {
		const has0 = ent.id.includes('{0}')
		const has1 = ent.id.includes('{1}')
		const sweep0 = has0 ? channels : 1
		const sweep1 = has1 ? channels : 1
		for (let i0 = 0; i0 < sweep0; i0++) {
			for (let i1 = 0; i1 < sweep1; i1++) {
				const id = substitute(ent.id, i0, i1)
				const r = await tryRead(id)
				results.push({ key: ent.key, id, i0, i1, ...r })
				const status = r.ok ? `OK (type=${r.valueType}, field=${r.field})` : 'FAIL'
				const label = has0 || has1 ? `${ent.key}[${i0}${has1 ? ',' + i1 : ''}]` : ent.key
				console.log(`${label.padEnd(32)} ${id} -> ${status}`)
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
