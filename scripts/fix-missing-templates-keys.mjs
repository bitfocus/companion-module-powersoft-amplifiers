import fs from 'node:fs'
import path from 'node:path'

const CSV_IN = path.join(process.cwd(), 'docs', 'CANALI', 'canali_missing_templates.csv')
const CSV_OUT = path.join(process.cwd(), 'docs', 'CANALI', 'canali_missing_templates.corrected.csv')

function parseCsvRows(csvText) {
	const lines = csvText.split(/\r?\n/)
	const rows = []
	for (const line of lines) {
		if (!line.trim()) continue
		const m = line.match(/^"([^"]*)","([^"]*)"$/)
		if (!m) {
			rows.push({ raw: line })
			continue
		}
		rows.push({ path: m[1], key: m[2] })
	}
	return rows
}

function normalizeSegments(segments) {
	const out = []
	for (let i = 0; i < segments.length; i++) {
		const s = segments[i]
		if (s === 'Channels' && segments[i + 1]?.startsWith('Channel-')) {
			out.push('CHANNEL')
			i++
			continue
		}
		if (s === 'Groups' && segments[i + 1]?.startsWith('Group-')) {
			out.push('GROUP')
			i++
			continue
		}
		if (s === 'Filter' && segments[i + 1]?.startsWith('Filter-')) {
			out.push('FILTER')
			i++
			continue
		}
		if (
			/^(Channel|Group|Filter|Speaker|RoutingChannel|SpeakerName|SpeakerOemFields|InMute|InGain|Priority|Src)-/.test(s)
		) {
			continue
		}
		out.push(s)
	}
	return out
}

function leafTokenOf(leaf) {
	const map = {
		Enable: 'ENABLE',
		Gain: 'GAIN_VALUE',
		Threshold: 'THRESHOLD_VALUE',
		AttackTime: 'ATTACK_TIME_VALUE',
		HoldTime: 'HOLD_TIME_VALUE',
		ReleaseTime: 'RELEASE_TIME_VALUE',
		Frequency: 'FREQUENCY_VALUE',
		Level: 'LEVEL_VALUE',
		Type: 'TYPE',
		PresetType: 'PRESET_TYPE',
		Name: 'NAME',
		Value: 'VALUE',
		Ip: 'IP',
		Ssid: 'SSID',
		Country: 'COUNTRY',
		Mode: 'MODE',
		Passphrase: 'SECURITY_PASSPHRASE',
	}
	if (leaf in map) return map[leaf]
	return leaf.toUpperCase()
}

function pathToExpectedKey(p) {
	const audioPrefix = '/Device/Audio/Presets/Live/'
	const configPrefix = '/Device/Config/'
	let keyParts = []
	let rest
	if (p.startsWith(audioPrefix)) {
		rest = p.slice(audioPrefix.length)
		const segs = rest.split('/').filter(Boolean)
		const top = segs[0]
		switch (top) {
			case 'Generals':
				keyParts.push('GENERALS')
				segs.shift()
				break
			case 'SourceSelection':
				keyParts.push('INPUT_SOURCE')
				segs.shift()
				break
			case 'InputMatrix':
				keyParts.push('MATRIX')
				segs.shift()
				break
			case 'SpeakerLayout':
				keyParts.push('SPEAKER')
				segs.shift()
				break
			case 'Extra': {
				if (segs[1] === 'OutputProcess') keyParts.push('OUTPUT', 'EXTRA')
				else if (segs[1] === 'InputProcess') keyParts.push('INPUT', 'PROCESS', 'EXTRA')
				else keyParts.push('EXTRA')
				segs.shift()
				break
			}
			case 'InputProcess':
				keyParts.push('INPUT', 'PROCESS')
				segs.shift()
				break
			case 'OutputProcess':
				keyParts.push('OUTPUT')
				segs.shift()
				break
			default:
				keyParts.push(top.toUpperCase())
				segs.shift()
				break
		}
		const mids = normalizeSegments(segs)
		const drop = new Set(['InputProcess', 'OutputProcess', 'Channels', 'Groups', 'InputEQ', 'Filter', 'Generals'])
		const mids2 = mids.filter((s) => !drop.has(s))
		const leaf = mids2[mids2.length - 1]
		const blockMap = {
			ClipLimiter: ['CLIP', 'LIMITER'],
			CurrentClamp: ['CURRENT', 'CLAMP'],
			CurrentLimiterRMS: ['CURRENT', 'LIMITER', 'RMS'],
			AuxDelay: ['AUX', 'DELAY'],
			AuxAttenuation: ['AUX', 'ATTENUATION'],
			SignalGenerator: ['SIGNAL', 'GENERATOR'],
			LatencyCompensation: ['LATENCY', 'COMPENSATION'],
			PeakLimiter: ['PEAK', 'LIMITER'],
			Speaker: ['SPEAKER'],
			SpeakerLayout: ['SPEAKER'],
		}
		const midsNoLeaf = mids2.slice(0, -1).flatMap((s) => blockMap[s] || [s.toUpperCase()])
		if (!midsNoLeaf.includes('CHANNEL') && p.includes('/Channels/Channel-')) {
			midsNoLeaf.unshift('CHANNEL')
		}
		keyParts = keyParts.concat(midsNoLeaf)
		keyParts.push(leafTokenOf(leaf))
	} else if (p.startsWith(configPrefix)) {
		rest = p.slice(configPrefix.length)
		const segs = rest.split('/').filter(Boolean)
		if (segs[0] === 'Networking') {
			keyParts.push('NETWORK')
			const mids = normalizeSegments(segs.slice(1))
			const midsNoLeaf = mids.slice(0, -1).map((s) => s.toUpperCase())
			keyParts = keyParts.concat(midsNoLeaf)
			keyParts.push(leafTokenOf(mids[mids.length - 1]))
		} else {
			keyParts.push(segs[0].toUpperCase(), ...segs.slice(1, -1).map((s) => s.toUpperCase()), leafTokenOf(segs.at(-1)))
		}
	} else {
		const segs = p.split('/').filter(Boolean)
		keyParts = segs.slice(0, -1).map((s) => s.toUpperCase())
		keyParts.push(leafTokenOf(segs.at(-1)))
	}
	return keyParts.filter(Boolean).join('_').replace(/__+/g, '_')
}

function main() {
	const csv = fs.readFileSync(CSV_IN, 'utf8')
	const rows = parseCsvRows(csv)
	const outLines = []
	for (const r of rows) {
		if (r.raw) {
			outLines.push(r.raw)
			continue
		}
		const expected = pathToExpectedKey(r.path)
		outLines.push(`"${r.path}","${expected}"`)
	}
	fs.writeFileSync(CSV_OUT, outLines.join('\n') + (outLines.length ? '\n' : ''))
	console.log(`Wrote corrected CSV to ${path.relative(process.cwd(), CSV_OUT)} (${outLines.length} rows).`)
}

main()
