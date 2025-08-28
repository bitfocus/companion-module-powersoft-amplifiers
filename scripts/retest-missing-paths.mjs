import fs from 'node:fs'
import path from 'node:path'
import got from 'got'

// Usage:
//   node scripts/retest-missing-paths.mjs --summary docs/probe-summary.csv --existing "docs/probe-ok-UNICApaths_applied _to_Canali_Series.csv" --out docs/canali_additionnal_paths_tested.csv [--host 1.2.3.4 --port 80 --https]
// If host/port not provided, they are read from docs/probe-results.json meta.

function parseArgs(argv) {
  const args = { summary: null, existing: null, out: null, host: null, port: null, https: null }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--summary') args.summary = argv[++i]
    else if (a === '--existing') args.existing = argv[++i]
    else if (a === '--out') args.out = argv[++i]
    else if (a === '--host') args.host = argv[++i]
    else if (a === '--port') args.port = Number(argv[++i])
    else if (a === '--https') args.https = true
  }
  return args
}

function abs(p) {
  return path.isAbsolute(p) ? p : path.join(process.cwd(), p)
}

function parseCsv(text) {
  // Simple CSV parser handling quotes and commas
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0)
  if (lines.length === 0) return { header: [], rows: [] }
  const parseLine = (line) => {
    const out = []
    let cur = ''
    let inQ = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (inQ) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            cur += '"'; i++
          } else {
            inQ = false
          }
        } else {
          cur += ch
        }
      } else {
        if (ch === ',') { out.push(cur); cur = '' }
        else if (ch === '"') { inQ = true }
        else { cur += ch }
      }
    }
    out.push(cur)
    return out
  }
  const header = parseLine(lines[0]).map((h) => h.trim())
  const rows = lines.slice(1).map(parseLine)
  return { header, rows }
}

function readCsvIds(file) {
  const txt = fs.readFileSync(file, 'utf8')
  const { header, rows } = parseCsv(txt)
  const idIdx = header.findIndex((h) => h.replace(/\"/g, '').toLowerCase() === 'id')
  if (idIdx < 0) throw new Error(`CSV ${path.basename(file)} does not have an 'id' column`)
  const ids = new Set()
  for (const r of rows) {
    const v = (r[idIdx] || '').trim()
    if (v) ids.add(v.replace(/^\"|\"$/g, ''))
  }
  return ids
}

async function tryRead(url, pathId) {
  const VALUE_TYPES = [
    { code: 10, field: 'stringValue' },
    { code: 40, field: 'boolValue' },
    { code: 30, field: 'intValue' },
    { code: 20, field: 'floatValue' },
    { code: 50, field: 'floatArrayValue' },
    { code: 60, field: 'uintValue' },
  ]
  for (const vt of VALUE_TYPES) {
    const payload = {
      version: '1.0.0',
      clientId: 'x8-panel',
      payload: { type: 100, action: { type: 10, values: [{ id: pathId, data: { type: vt.code } }] } },
      tag: 1,
      updateId: 1,
    }
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
    } catch (e) {
      // continue
    }
  }
  return { ok: false }
}

async function main() {
  const args = parseArgs(process.argv)
  if (!args.summary || !args.existing || !args.out) {
    console.error('Usage: node scripts/retest-missing-paths.mjs --summary <file> --existing <file> --out <file> [--host H --port P --https]')
    process.exit(1)
  }
  const summaryPath = abs(args.summary)
  const existingPath = abs(args.existing)
  const outPath = abs(args.out)

  const summaryIds = readCsvIds(summaryPath)
  const existingIds = readCsvIds(existingPath)
  const missing = [...summaryIds].filter((id) => !existingIds.has(id))
  console.log(`Missing IDs to test: ${missing.length}`)

  let host = args.host
  let port = args.port
  let useHttps = !!args.https
  if (!host || !port) {
    const prPath = abs(path.join('docs', 'probe-results.json'))
    if (fs.existsSync(prPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(prPath, 'utf8')).meta || {}
        host = host || meta.host
        port = port || meta.port
        useHttps = args.https != null ? !!args.https : !!meta.https
      } catch {}
    }
  }
  if (!host || !port) {
    console.error('Cannot determine host/port. Provide --host and --port, or ensure docs/probe-results.json exists with meta.')
    process.exit(1)
  }
  const scheme = useHttps ? 'https' : 'http'
  const url = `${scheme}://${host}:${port}/am`
  console.log('Target device:', url)

  const outRows = []
  for (const id of missing) {
    const r = await tryRead(url, id)
    if (r.ok) {
      // Ensure raw to string for CSV
      let raw = r.raw
      if (raw !== undefined && raw !== null && typeof raw !== 'string') raw = JSON.stringify(raw)
      outRows.push({ id, valueType: r.valueType, field: r.field, raw })
      console.log(`OK: ${id} -> type=${r.valueType} field=${r.field}`)
    } else {
      console.log(`FAIL: ${id}`)
    }
  }

  // Write CSV
  const header = '"id","valueType","field","raw"\n'
  const lines = outRows.map((r) => {
    const csvSafe = (v) => {
      const s = v == null ? '' : String(v)
      return '"' + s.replace(/"/g, '""') + '"'
    }
    return [csvSafe(r.id), csvSafe(r.valueType), csvSafe(r.field), csvSafe(r.raw)].join(',')
  })
  fs.writeFileSync(outPath, header + lines.join('\n'))
  console.log(`Wrote ${outRows.length} successful rows to ${path.relative(process.cwd(), outPath)}`)
}

main().catch((e) => {
  console.error('Fatal:', e)
  process.exit(1)
})
