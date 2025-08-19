import fs from 'node:fs'
import path from 'node:path'

// Usage:
//   node scripts/generate-mapping.mjs <probe-results.json> [out.ts]
// Example:
//   yarn probe:map docs/probe-results.json

const [, , jsonArg, outArg] = process.argv
if (!jsonArg) {
	console.error('Usage: node scripts/generate-mapping.mjs <probe-results.json> [out.ts]')
	throw new Error('Missing input jsonArg')
}
const inPath = path.isAbsolute(jsonArg) ? jsonArg : path.join(process.cwd(), jsonArg)
if (!fs.existsSync(inPath)) {
	console.error('Probe results file not found:', inPath)
	throw new Error('Probe results file not found')
}
const outPath = outArg
	? path.isAbsolute(outArg)
		? outArg
		: path.join(process.cwd(), outArg)
	: path.join(process.cwd(), 'src', 'generated', 'pathTypeMap.ts')

const doc = JSON.parse(fs.readFileSync(inPath, 'utf8'))
const results = Array.isArray(doc.results) ? doc.results : []

// Map numeric ValueType to enum name in src/enums.ts
const VALUE_TYPE_NAME = new Map([
	[10, 'STRING'],
	[20, 'FLOAT'],
	[30, 'INT'],
	[40, 'BOOL'],
	[50, 'FLOATARRAY'],
	[60, 'UINT'],
])

// Aggregate best type for each key by majority
const perKey = new Map()
for (const r of results) {
	if (!r || !r.ok) continue
	const vt = r.valueType
	if (!VALUE_TYPE_NAME.has(vt)) continue
	const key = r.key
	const count = perKey.get(key) || new Map()
	count.set(vt, (count.get(vt) || 0) + 1)
	perKey.set(key, count)
}

// Choose most frequent valueType for each key
const chosen = new Map()
for (const [key, counts] of perKey.entries()) {
	let bestVt = null
	let bestCount = -1
	for (const [vt, c] of counts.entries()) {
		if (c > bestCount) {
			bestCount = c
			bestVt = vt
		}
	}
	if (bestVt != null) chosen.set(key, bestVt)
}

// Build TS content
const lines = []
lines.push('// Auto-generated from probe results. Do not edit manually.')
lines.push("import { ValueType } from '../enums.js'")
lines.push("import { ParameterPaths } from '../parameterPaths.js'")
lines.push('')
lines.push('export const PathTypeMap: Record<string, ValueType> = {')
for (const [key, vt] of [...chosen.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
	const enumName = VALUE_TYPE_NAME.get(vt)
	lines.push(`  [ParameterPaths.${key}]: ValueType.${enumName},`)
}
lines.push('}')
lines.push('')

// Ensure output directory exists
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, lines.join('\n'))
console.log(`Generated mapping with ${chosen.size} entries at ${path.relative(process.cwd(), outPath)}`)
