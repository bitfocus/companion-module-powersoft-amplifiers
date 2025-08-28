import fs from 'node:fs'
import path from 'node:path'

const PARAM_FILE = path.join(process.cwd(), 'src', 'parameterPaths.ts')
const TESTED_CSV = path.join(process.cwd(), 'docs', 'CANALI', 'canali_tested_paths.csv')
const OUT_MISSING = path.join(process.cwd(), 'docs', 'CANALI', 'canali_missing_templates.csv')
const OUT_TS = path.join(process.cwd(), 'docs', 'CANALI', 'canali_parameter_paths_additions.ts')

function readFile(p){ return fs.readFileSync(p, 'utf8') }

function parseParameterPaths(ts){
  const start = ts.indexOf('export const ParameterPaths = {')
  if (start < 0) throw new Error('ParameterPaths object not found')
  const braceStart = ts.indexOf('{', start)
  let i = braceStart+1, d=1
  while(i<ts.length && d>0){ const ch=ts[i]; if(ch=='{') d++; else if(ch=='}') d--; i++}
  const body = ts.slice(braceStart+1, i-1)
  const entries = []
  for (const line of body.split(/\r?\n/)){
    const clean = line.trim()
    if(!clean || clean.startsWith('//')) continue
    const l = clean.replace(/,\s*$/, '')
    const m = l.match(/^(\w+)\s*:\s*'([^']+)'$/)
    if(m) entries.push({ key:m[1], path:m[2] })
  }
  return entries
}

function parseCsvIds(csvText){
  const lines = csvText.split(/\r?\n/)
  const header = lines[0]?.split(',').map(s=>s.replace(/^\"|\"$/g,''))||[]
  const idIdx = header.findIndex(h=>h.toLowerCase()==='id')
  if(idIdx<0) throw new Error('CSV missing id column')
  const ids = []
  for(let i=1;i<lines.length;i++){
    const line = lines[i]
    if(!line) continue
    // simple csv field split respecting quotes
    const row=[]; let cur=''; let inQ=false
    for(let j=0;j<line.length;j++){
      const ch=line[j]
      if(inQ){
        if(ch==='"'){
          if(line[j+1]==='"'){ cur+='"'; j++ } else { inQ=false }
        } else cur+=ch
      } else {
        if(ch===','){ row.push(cur); cur='' }
        else if(ch==='"'){ inQ=true }
        else cur+=ch
      }
    }
    row.push(cur)
    const idRaw = (row[idIdx]||'').trim().replace(/^\"|\"$/g,'')
    if(idRaw) ids.push(idRaw)
  }
  return ids
}

function toTemplate(id){
  let t = id
  t = t.replace(/Channel-\d+/g, 'Channel-{0}')
  t = t.replace(/Group-\d+/g, 'Group-{1}')
  t = t.replace(/Filter-\d+/g, 'Filter-{2}')
  t = t.replace(/Src-\d+/g, 'Src-{1}')
  t = t.replace(/Priority-\d+/g, 'Priority-{1}')
  t = t.replace(/BackupStrategy-\d+/g, 'BackupStrategy-{0}')
  t = t.replace(/RoutingChannel-\d+/g, 'RoutingChannel-{0}')
  t = t.replace(/Speaker-\d+/g, 'Speaker-{0}')
  t = t.replace(/SpeakerName-\d+/g, 'SpeakerName-{0}')
  t = t.replace(/SpeakerOemFields-\d+/g, 'SpeakerOemFields-{0}')
  t = t.replace(/InMute-\d+/g, 'InMute-{0}')
  t = t.replace(/InGain-\d+/g, 'InGain-{0}')
  t = t.replace(/Gain-\d+/g, (m)=> m.replace(/\d+/, '{1}'))
  t = t.replace(/Mute-\d+/g, (m)=> m.replace(/\d+/, '{1}'))
  return t
}

function suggestKeyFor(template){
  // Heuristic based on segments
  const segs = template.split('/').filter(Boolean)
  const last = segs.slice(-2).join('_') // e.g., Freq1_Value
  let base = ''
  if (template.includes('/Extra/InputProcess/')) base = 'INPUT_PROCESS_'
  else if (template.includes('/InputProcess/')) base = 'INPUT_CHANNEL_'
  else if (template.includes('/InputMatrix/')) base = 'MATRIX_'
  else if (template.includes('/SourceSelection/')) base = 'INPUT_SOURCE_'
  else if (template.includes('/SpeakerLayout/')) base = 'SPEAKER_'
  else if (template.includes('/OutputProcess/')) base = 'OUTPUT_'
  else if (template.includes('/Config/Networking/')) base = 'NETWORK_'
  else if (template.includes('/Generals/LatencyCompensation/')) base = 'LATENCY_COMPENSATION_'
  else base = 'PARAM_'
  const norm = last
    .replace(/\{0\}/g,'INDEX0').replace(/\{1\}/g,'INDEX1').replace(/\{2\}/g,'INDEX2')
    .replace(/[^A-Za-z0-9]+/g,'_').toUpperCase()
  return base + norm
}

function main(){
  const ts = readFile(PARAM_FILE)
  const entries = parseParameterPaths(ts)
  const existing = new Set(entries.map(e=>e.path))
  const csv = readFile(TESTED_CSV)
  const ids = parseCsvIds(csv)
  const templates = new Set(ids.map(toTemplate))
  const missing = [...templates].filter(t=>!existing.has(t))

  // Write CSV list
  const header = 'template,suggestedKey\n'
  const lines = missing.map(t=>{
    const key = suggestKeyFor(t)
    return '"'+t.replace(/"/g,'""')+'","'+key+'"'
  }).join('\n')
  fs.writeFileSync(OUT_MISSING, header + lines + (lines?'\n':''))

  // Write a TS additions helper (object export)
  const tsAdd = `// Auto-generated suggestions. Review and copy into src/parameterPaths.ts\nexport const SuggestedParameterPathAdditions = {\n` +
    missing.map(t=> `\t${suggestKeyFor(t)}: '${t}',`).join('\n') +
    `\n}\n`
  fs.writeFileSync(OUT_TS, tsAdd)

  console.log(`Missing templates: ${missing.length}`)
  console.log('Wrote:', path.relative(process.cwd(), OUT_MISSING))
  console.log('Wrote:', path.relative(process.cwd(), OUT_TS))
}

main()
