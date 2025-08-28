import fs from 'node:fs'
import path from 'node:path'

const CSV_IN = path.join(process.cwd(), 'docs', 'CANALI', 'canali_missing_templates.csv')
const REPORT_OUT = path.join(process.cwd(), 'docs', 'CANALI', 'canali_key_naming_audit.csv')

function parseCsvRows(csvText){
  const lines = csvText.split(/\r?\n/).filter(Boolean)
  const rows = []
  for (const line of lines){
    // very simple CSV: two quoted columns
    const m = line.match(/^"([^"]*)","([^"]*)"$/)
    if(!m) continue
    rows.push({ path: m[1], key: m[2] })
  }
  return rows
}

function normalizeSegments(segments){
  const out = []
  for (let i=0;i<segments.length;i++){
    const s = segments[i]
    if (s === 'Channels' && segments[i+1]?.startsWith('Channel-')) { out.push('CHANNEL'); i++; continue }
    if (s === 'Groups' && segments[i+1]?.startsWith('Group-')) { out.push('GROUP'); i++; continue }
    if (s === 'Filter' && segments[i+1]?.startsWith('Filter-')) { out.push('FILTER'); i++; continue }
    if (/^(Channel|Group|Filter|Speaker|RoutingChannel|SpeakerName|SpeakerOemFields|InMute|InGain|Priority|Src)-/.test(s)) {
      // skip explicit indexed segment, we've already encoded category
      continue
    }
    out.push(s)
  }
  return out
}

function leafTokenOf(leaf, maybeValue){
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
  if (leaf === 'Value') return 'VALUE'
  return leaf.toUpperCase()
}

function pathToExpectedKey(p){
  const audioPrefix = '/Device/Audio/Presets/Live/'
  const configPrefix = '/Device/Config/'
  let keyParts = []
  let rest
  if (p.startsWith(audioPrefix)){
    rest = p.slice(audioPrefix.length)
    const segs = rest.split('/').filter(Boolean)
    const top = segs[0]
    switch (top){
      case 'Generals': keyParts.push('GENERALS'); segs.shift(); break
      case 'SourceSelection': keyParts.push('INPUT_SOURCE'); segs.shift(); break
      case 'InputMatrix': keyParts.push('MATRIX'); segs.shift(); break
      case 'SpeakerLayout': keyParts.push('SPEAKER'); segs.shift(); break
      case 'Extra': {
        // Extra subtree: e.g., Extra/OutputProcess ... or Extra/InputProcess ...
        if (segs[1] === 'OutputProcess') keyParts.push('OUTPUT','EXTRA')
        else if (segs[1] === 'InputProcess') keyParts.push('INPUT','PROCESS','EXTRA')
        else keyParts.push('EXTRA')
        segs.shift() // Extra
        break
      }
      case 'InputProcess': keyParts.push('INPUT','PROCESS'); segs.shift(); break
      case 'OutputProcess': keyParts.push('OUTPUT'); segs.shift(); break
      default: keyParts.push(top.toUpperCase()); segs.shift(); break
    }
    // continue through mid tree
    const mids = normalizeSegments(segs)
    // Remove generic containers we already encoded
    const drop = new Set(['InputProcess','OutputProcess','Channels','Groups','InputEQ','Filter','Generals'])
    const mids2 = mids.filter(s=>!drop.has(s))
    // Determine leaf
    let leaf = mids2[mids2.length-1]
    let prev = mids2[mids2.length-2]
    // Special blocks renaming
    const blockMap = {
      ClipLimiter: ['CLIP','LIMITER'],
      CurrentClamp: ['CURRENT','CLAMP'],
      CurrentLimiterRMS: ['CURRENT','LIMITER','RMS'],
      AuxDelay: ['AUX','DELAY'],
      AuxAttenuation: ['AUX','ATTENUATION'],
      SignalGenerator: ['SIGNAL','GENERATOR'],
      LatencyCompensation: ['LATENCY','COMPENSATION'],
      PeakLimiter: ['PEAK','LIMITER'],
      Speaker: ['SPEAKER'],
      SpeakerLayout: ['SPEAKER'],
    }
    const midsNoLeaf = mids2.slice(0, -1).flatMap(s => blockMap[s] || [s.toUpperCase()])
    // If we are in a channel context, ensure CHANNEL appears
    if (!midsNoLeaf.includes('CHANNEL') && p.includes('/Channels/Channel-')){ midsNoLeaf.unshift('CHANNEL') }
    keyParts = keyParts.concat(midsNoLeaf)
    keyParts.push(leafTokenOf(leaf, prev))
  } else if (p.startsWith(configPrefix)){
    rest = p.slice(configPrefix.length)
    const segs = rest.split('/').filter(Boolean)
    if (segs[0] === 'Networking'){
      keyParts.push('NETWORK')
      const mids = normalizeSegments(segs.slice(1))
      const midsNoLeaf = mids.slice(0, -1).map(s=>s.toUpperCase())
      keyParts = keyParts.concat(midsNoLeaf)
      keyParts.push(leafTokenOf(mids[mids.length-1]))
    } else {
      keyParts.push(segs[0].toUpperCase(), ...segs.slice(1,-1).map(s=>s.toUpperCase()), leafTokenOf(segs.at(-1)))
    }
  } else {
    // Fallback
    const segs = p.split('/').filter(Boolean)
    keyParts = segs.slice(0,-1).map(s=>s.toUpperCase())
    keyParts.push(leafTokenOf(segs.at(-1)))
  }
  // Cleanup consecutive duplicates/spacers
  const key = keyParts.filter(Boolean).join('_').replace(/__+/g,'_')
  return key
}

function main(){
  const csv = fs.readFileSync(CSV_IN, 'utf8')
  const rows = parseCsvRows(csv)
  const out = ['path,currentKey,expectedKey,ok']
  for (const r of rows){
    const expected = pathToExpectedKey(r.path)
    const ok = r.key === expected
    if (!ok){
      out.push(`"${r.path}","${r.key}","${expected}",${ok}`)
    }
  }
  fs.writeFileSync(REPORT_OUT, out.join('\n') + (out.length>1?'\n':''))
  console.log(`Wrote audit to ${path.relative(process.cwd(), REPORT_OUT)} with ${out.length-1} mismatch(es).`)
}

main()
