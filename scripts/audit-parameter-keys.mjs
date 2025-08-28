import fs from 'node:fs'
import path from 'node:path'

// Reads src/parameterPaths.ts and emits a CSV audit of key naming vs path semantics.
// Output: docs/parameter_keys_audit.csv with columns: key,path,suggestion,reason

const SRC = path.join(process.cwd(), 'src', 'parameterPaths.ts')
const OUT = path.join(process.cwd(), 'docs', 'parameter_keys_audit.csv')

function loadFile(p) {
  return fs.readFileSync(p, 'utf8')
}

function parseParameterObject(ts) {
  // crude parse: find export const ParameterPaths = { ... }
  const start = ts.indexOf('export const ParameterPaths = {')
  if (start < 0) throw new Error('ParameterPaths object not found')
  const braceStart = ts.indexOf('{', start)
  let i = braceStart + 1, depth = 1
  while (i < ts.length && depth > 0) {
    const ch = ts[i]
    if (ch === '{') depth++
    else if (ch === '}') depth--
    i++
  }
  const body = ts.slice(braceStart + 1, i - 1)
  // split by lines and extract entries like KEY: '...'
  const entries = []
  for (const line of body.split(/\r?\n/)) {
    const clean = line.trim()
    if (!clean || clean.startsWith('//')) continue
    // Remove trailing commas
    const l = clean.replace(/,\s*$/, '')
    // Match KEY: 'path'
    const m = l.match(/^(\w+)\s*:\s*'([^']+)'$/)
    if (m) entries.push({ key: m[1], path: m[2] })
  }
  return entries
}

function suggestFor(key, devicePath) {
  // Rules
  const reasons = []
  let suggestion = key
  const lower = key.toLowerCase()

  const ends = (s) => devicePath.endsWith(s)
  const has = (frag) => devicePath.includes(frag)

  const ensureSuffix = (suf) => {
    if (!lower.endsWith(suf.toLowerCase())) {
      suggestion = key + '_' + suf
      reasons.push(`missing suffix ${suf}`)
    }
  }

  if (ends('/Enable/Value')) ensureSuffix('ENABLE_VALUE')
  else if (ends('/Enable')) ensureSuffix('ENABLE')
  else if (ends('/Value')) ensureSuffix('VALUE')

  if (has('/Type')) {
    if (!lower.endsWith('type') && !lower.endsWith('type_value') && !lower.endsWith('enable_type')) {
      suggestion = suggestion.endsWith('_VALUE') ? suggestion.replace(/_VALUE$/, '_TYPE') : suggestion + '_TYPE'
      reasons.push('contains /Type')
    }
  }
  if (has('/Name')) {
    if (!lower.endsWith('name')) { suggestion += '_NAME'; reasons.push('contains /Name') }
  }
  if (has('/Guid')) {
    if (!lower.endsWith('guid')) { suggestion += '_GUID'; reasons.push('contains /Guid') }
  }

  // Normalize speaker groups duplications: Connections path
  if (devicePath === '/Device/Audio/Presets/Live/SpeakerLayout/Connections' && !key.includes('SPEAKER_CONNECTIONS')) {
    suggestion = 'SPEAKER_CONNECTIONS'
    reasons.push('multiple keys share same Connections path')
  }

  // If no reasons, return blank suggestion to imply OK
  return { suggestion: reasons.length ? suggestion : '', reason: reasons.join('; ') }
}

function main() {
  const ts = loadFile(SRC)
  const entries = parseParameterObject(ts)
  const byPath = new Map()
  for (const e of entries) {
    if (!byPath.has(e.path)) byPath.set(e.path, [])
    byPath.get(e.path).push(e.key)
  }

  const rows = []
  for (const { key, path: p } of entries) {
    const dup = byPath.get(p)
    const dupInfo = dup && dup.length > 1 ? `duplicate path used by: ${dup.filter((k)=>k!==key).join('|')}` : ''
    const { suggestion, reason } = suggestFor(key, p)
    const reasonFull = [reason, dupInfo].filter(Boolean).join('; ')
    rows.push({ key, path: p, suggestion, reason: reasonFull })
  }

  const header = 'key,path,suggestion,reason\n'
  const csv = rows.map(r => [r.key, r.path, r.suggestion, r.reason]
    .map(v => '"' + String(v ?? '').replace(/"/g,'""') + '"').join(','))
    .join('\n')
  fs.writeFileSync(OUT, header + csv + (csv ? '\n' : ''))
  console.log(`Wrote ${path.relative(process.cwd(), OUT)} with ${rows.length} rows`)
}

main()
