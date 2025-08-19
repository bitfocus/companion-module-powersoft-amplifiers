import fs from 'node:fs'
import path from 'node:path'

// Usage:
//   node scripts/summarize-probe.mjs <probe-results.json> [--csv out.csv]
//   yarn probe:summarize docs/probe-results.json --csv docs/probe-summary.csv

const [, , fileArg, ...args] = process.argv
if (!fileArg) {
	console.error('Usage: node scripts/summarize-probe.mjs <probe-results.json> [--csv out.csv]')
	throw new Error('Missing input file')
}

let csvOut = null
for (let i = 0; i < args.length; i++) {
	if (args[i] === '--csv') {
		csvOut = args[i + 1] || null
		i++
	}
}

const filePath = path.isAbsolute(fileArg) ? fileArg : path.join(process.cwd(), fileArg)
if (!fs.existsSync(filePath)) {
	console.error('File not found:', filePath)
	throw new Error('File not found')
}

const doc = JSON.parse(fs.readFileSync(filePath, 'utf8'))
const results = Array.isArray(doc.results) ? doc.results : []

// Build summaries
const ok = results.filter((r) => r && r.ok)
const byKey = new Map()
for (const r of ok) {
	const arr = byKey.get(r.key) || []
	arr.push(r)
	byKey.set(r.key, arr)
}

console.log(
	`Meta: host=${doc?.meta?.host} port=${doc?.meta?.port} https=${doc?.meta?.https} channels=${doc?.meta?.channels}`,
)
console.log(`OK: ${ok.length}/${results.length}`)
console.log('\nResponding paths by key:')
for (const [key, arr] of [...byKey.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
	// collect distinct types and indices
	const types = new Set(arr.map((x) => `${x.valueType}/${x.field}`))
	const sample = arr.slice(0, 3).map((x) => x.id)
	console.log(`- ${key} -> count=${arr.length}, types={${[...types].join(', ')}}, sampleId=${sample[0]}`)
}

if (csvOut) {
	const lines = ['key,id,i0,i1,valueType,field']
	for (const r of ok) {
		lines.push(
			`${JSON.stringify(r.key)},${JSON.stringify(r.id)},${r.i0 ?? ''},${r.i1 ?? ''},${r.valueType ?? ''},${JSON.stringify(r.field ?? '')}`,
		)
	}
	try {
		fs.writeFileSync(csvOut, lines.join('\n'))
		console.log(`\nSaved CSV summary to ${csvOut}`)
	} catch (e) {
		console.error('Failed to write CSV:', e?.message || e)
	}
}
