import fs from 'fs'
import path from 'path'
import process from 'process'
import got from 'got'

/*
Usage:
  node scripts/read-matrix-gain-batch-save.mjs [baseUrl] [inputIndex] [channels]

Defaults:
  baseUrl    = http://192.168.100.8:80
  inputIndex = 10
  channels   = 0-7  (reads 8 channels)

This will:
  1) Enable ExtraControl (some matrix fields require it)
  2) Read a batch of crosspoint gains for Channel-{ch}/Gain-{inputIndex}/Value for ch in range
  3) Also try an alternate READ shape (no data field) for the same paths
  4) Write then Read back one crosspoint to confirm write success
  5) Save raw and pretty JSON plus response headers and a log to scripts/out/
*/

const baseUrl = (process.argv[2] || 'http://192.168.100.8:80').replace(/\/$/, '')
const inputIndex = Number(process.argv[3] ?? 10)
const range = String(process.argv[4] ?? '0-7')
const match = range.match(/^(\d+)-(\d+)$/)
if (!match) {
  console.error('Invalid channels range. Use e.g. 0-7')
  process.exit(1)
}

// Alternate READ shape: omit data field entirely (some devices require this)
const valuesNoData = []
for (let ch = chStart; ch <= chEnd; ch++) {
  valuesNoData.push({
    id: `/Device/Audio/Presets/Live/InputMatrix/Channels/Channel-${ch}/Gain-${inputIndex}/Value`,
  })
}

const readBatchNoDataBody = {
  version: '1.0.0',
  clientId: 'x8-panel',
  payload: {
    type: 100,
    action: { type: 10, values: valuesNoData },
  },
  tag: 1,
  updateId: 1,
}

// Firmware version READ (known-good simple path)
const firmwareReadBody = {
  version: '1.0.0',
  clientId: 'x8-panel',
  payload: {
    type: 100,
    action: {
      type: 10,
      values: [
        {
          id: '/Device/Config/Software/Firmware/Version',
          data: { type: 10 }, // STRING
        },
      ],
    },
  },
  tag: 1,
  updateId: 1,
}

// Write then Read back a single crosspoint (use first channel)
const singlePath = `/Device/Audio/Presets/Live/InputMatrix/Channels/Channel-${chStart}/Gain-${inputIndex}/Value`
const writeSingleBody = {
  version: '1.0.0',
  clientId: 'x8-panel',
  payload: {
    type: 100,
    action: {
      type: 20, // WRITE
      values: [
        {
          id: singlePath,
          data: { type: 20, floatValue: -3.0 },
        },
      ],
    },
  },
  tag: 1,
  updateId: 1,
}

const readSingleBody = {
  version: '1.0.0',
  clientId: 'x8-panel',
  payload: {
    type: 100,
    action: {
      type: 10, // READ
      values: [
        {
          id: singlePath,
          data: { type: 20 },
        },
      ],
    },
  },
  tag: 1,
  updateId: 1,
}
const chStart = Number(match[1])
const chEnd = Number(match[2])

const enableExtraControlBody = {
  version: '1.0.0',
  clientId: 'x8-panel',
  payload: {
    type: 100,
    action: {
      type: 20, // WRITE
      values: [
        {
          id: '/Device/Audio/Presets/Live/InputMatrix/Generals/ExtraControl/Enable/Value',
          data: { type: 40, boolValue: true },
        },
      ],
    },
  },
  tag: 1,
  updateId: 1,
}

const values = []
for (let ch = chStart; ch <= chEnd; ch++) {
  values.push({
    id: `/Device/Audio/Presets/Live/InputMatrix/Channels/Channel-${ch}/Gain-${inputIndex}/Value`,
    data: { type: 20 }, // FLOAT
  })
}

const readBatchBody = {
  version: '1.0.0',
  clientId: 'x8-panel',
  payload: {
    type: 100,
    action: {
      type: 10, // READ
      values,
    },
  },
  tag: 1,
  updateId: 1,
}

const url = `${baseUrl}/am`

async function postJson(name, jsonBody) {
  const res = await got(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    json: jsonBody,
    responseType: 'text',
    throwHttpErrors: false,
    https: { rejectUnauthorized: true },
    timeout: { request: 5000 },
  })
  return { status: res.statusCode, bodyText: res.body, headers: res.headers }
}

function saveOut(prefix, payload) {
  const outDir = path.resolve('scripts', 'out')
  fs.mkdirSync(outDir, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const base = `${prefix}_${ts}`
  const rawFile = path.join(outDir, `${base}.raw.json`)
  const jsonFile = path.join(outDir, `${base}.json`)
  const hdrFile = path.join(outDir, `${base}.headers.json`)
  const logFile = path.join(outDir, `${base}.log.txt`)

  fs.writeFileSync(rawFile, payload.bodyText ?? '', 'utf8')

  try {
    const parsed = payload.bodyText && payload.bodyText.length ? JSON.parse(payload.bodyText) : {}
    fs.writeFileSync(jsonFile, JSON.stringify(parsed, null, 2), 'utf8')
  } catch {
    // ignore
  }
  try {
    fs.writeFileSync(hdrFile, JSON.stringify(payload.headers, null, 2), 'utf8')
  } catch {
    // ignore
  }

  try {
    const lines = [
      `URL: ${url}`,
      `Status: ${payload.status}`,
      `Timestamp: ${new Date().toISOString()}`,
    ]
    fs.writeFileSync(logFile, lines.join('\n') + '\n', 'utf8')
  } catch {
    // ignore
  }

  console.log(`Saved: \n  ${rawFile}\n  ${jsonFile}\n  ${hdrFile}`)
}

async function run() {
  console.log('Enabling ExtraControl...')
  const r1 = await postJson('enableExtra', enableExtraControlBody)
  console.log('ExtraControl status:', r1.status)
  saveOut(`matrix-extra-enable`, r1)

  console.log('Reading firmware version (sanity check)...')
  const rFw = await postJson('firmwareRead', firmwareReadBody)
  console.log('Firmware read status:', rFw.status)
  saveOut(`firmware-read`, rFw)

  console.log(`Reading batch matrix gains ch${chStart}-${chEnd} for input ${inputIndex}...`)
  const r2 = await postJson('readBatch', readBatchBody)
  console.log('Read status:', r2.status)
  saveOut(`matrix-gain-read_batch_ch${chStart}-${chEnd}_in${inputIndex}`, r2)

  console.log(`Reading batch matrix gains (no data) ch${chStart}-${chEnd} for input ${inputIndex}...`)
  const r3 = await postJson('readBatchNoData', readBatchNoDataBody)
  console.log('Read(no-data) status:', r3.status)
  saveOut(`matrix-gain-readNoData_batch_ch${chStart}-${chEnd}_in${inputIndex}`, r3)

  console.log(`Write then read back single crosspoint ch${chStart} in${inputIndex}...`)
  const rW = await postJson('writeSingle', writeSingleBody)
  console.log('Write status:', rW.status)
  saveOut(`matrix-gain-write_ch${chStart}_in${inputIndex}`, rW)
  const rR = await postJson('readSingle', readSingleBody)
  console.log('ReadBack status:', rR.status)
  saveOut(`matrix-gain-readback_ch${chStart}_in${inputIndex}`, rR)

  if (r2.status < 200 || r2.status >= 400) {
    console.error('Non-success status for read batch')
    process.exitCode = 1
  }
}

run().catch((e) => {
  console.error('Request failed:', e && e.message ? e.message : e)
  process.exitCode = 1
})
