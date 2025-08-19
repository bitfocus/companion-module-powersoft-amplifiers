import dgram from 'dgram'
import crypto from 'crypto'

const HOST = process.argv[2] || '192.168.100.8'
const PORT = Number(process.argv[3] || 1234)
const TIMEOUT_MS = Number(process.argv[4] || 2000)
const CMD_ARG = (process.argv[5] || 'ping').toLowerCase()
const STANDBY_MODE_ARG = process.argv[6] !== undefined ? Number(process.argv[6]) : 0 // 0 read, 1 off, 2 on
const BROADCAST_ARG = (
	(process.argv[6] || '') +
	' ' +
	(process.argv[7] || '') +
	' ' +
	(process.argv[8] || '') +
	' ' +
	(process.argv[9] || '')
)
	.toLowerCase()
	.includes('broadcast')
const AP0_ARG = ((process.argv[6] || '') + ' ' + (process.argv[7] || '') + ' ' + (process.argv[8] || ''))
	.toLowerCase()
	.includes('ap0')
// Optional toggle to use generic computed CRC for STANDBY instead of forced zero
const GENCRC_ARG = (
	(process.argv[6] || '') +
	' ' +
	(process.argv[7] || '') +
	' ' +
	(process.argv[8] || '') +
	' ' +
	(process.argv[9] || '')
)
	.toLowerCase()
	.includes('gencrc')
// Force CRC16=0 for any command (debugging some firmwares)
const ZEROCRC_ARG = (
	(process.argv[6] || '') +
	' ' +
	(process.argv[7] || '') +
	' ' +
	(process.argv[8] || '') +
	' ' +
	(process.argv[9] || '') +
	' ' +
	(process.argv[10] || '')
)
	.toLowerCase()
	.includes('zerocrc')

// CRC-16/IBM (ANSI), poly 0xA001, init 0xFFFF; example of "123456789" is 0xBB3D
function crc16IBM(buf) {
	let crc = 0xffff
	for (let i = 0; i < buf.length; i++) {
		crc ^= buf[i]
		for (let j = 0; j < 8; j++) {
			const lsb = crc & 1
			crc >>= 1
			if (lsb) crc ^= 0xa001
		}
	}
	return crc & 0xffff
}

function buildFrame({ cmd, cookie, answerPort, data, forceComputedCrcForCmd14 = false, forceZeroCrc = false }) {
	const STX = 0x02
	const ETX = 0x03
	const count = data.length
	// Per spec, some commands expect CRC16=0 even when count>0 (e.g., STANDBY cmd=14)
	const crc = forceZeroCrc ? 0 : cmd === 14 && !forceComputedCrcForCmd14 ? 0 : count ? crc16IBM(data) : 0
	const notCmd = ~cmd & 0xff

	const total = 1 + 1 + 2 + 2 + 2 + count + 2 + 1 + 1
	const buf = Buffer.alloc(total)
	let o = 0
	buf.writeUInt8(STX, o)
	o += 1
	buf.writeUInt8(cmd, o)
	o += 1
	buf.writeUInt16LE(cookie, o)
	o += 2
	buf.writeUInt16LE(count, o)
	o += 2
	buf.writeUInt16LE(answerPort, o)
	o += 2
	if (count) {
		data.copy(buf, o)
		o += count
	}
	buf.writeUInt16LE(crc, o)
	o += 2
	buf.writeUInt8(notCmd, o)
	o += 1
	buf.writeUInt8(ETX, o)
	o += 1
	return buf
}

function parseFrame(buf) {
	try {
		let o = 0
		const STX = buf.readUInt8(o)
		o += 1
		const cmd = buf.readUInt8(o)
		o += 1
		const cookie = buf.readUInt16LE(o)
		o += 2
		const count = buf.readUInt16LE(o)
		o += 2
		const answerPort = buf.readUInt16LE(o)
		o += 2
		const data = buf.slice(o, o + count)
		o += count
		const crc16 = buf.readUInt16LE(o)
		o += 2
		const notCmd = buf.readUInt8(o)
		o += 1
		const ETX = buf.readUInt8(o)
		o += 1
		const ok = STX === 0x02 && ETX === 0x03 && (~cmd & 0xff) === notCmd
		return { ok, STX, cmd, cookie, count, answerPort, data, crc16, notCmd, ETX, raw: buf }
	} catch (e) {
		return { ok: false, error: e?.message || String(e), raw: buf }
	}
}

function hex(buf) {
	return Buffer.isBuffer(buf)
		? buf
				.toString('hex')
				.match(/.{1,2}/g)
				?.join(' ')
		: String(buf)
}

async function main() {
	console.log(`Probing Canali-DSP UDP API: ${HOST}:${PORT}`)
	const sock = dgram.createSocket('udp4')
	sock.on('error', (err) => {
		console.error('Socket error:', err)
		try {
			sock.close()
		} catch (e) {
			void e
		}
	})

	const bindPort = 0 // OS-chosen
	await new Promise((resolve) => sock.bind(bindPort, resolve))
	const local = sock.address()
	console.log(`Bound UDP ${local.address}:${local.port}`)

	const cookie = crypto.randomInt(0, 0xffff)
	let cmd = 0
	let data = Buffer.alloc(0)
	if (CMD_ARG === 'ping') {
		cmd = 0 // PING
	} else if (CMD_ARG === 'readgm' || CMD_ARG === 'readgains' || CMD_ARG === 'readmutes') {
		cmd = 1 // READGM
	} else if (CMD_ARG === 'standby' || CMD_ARG === 'power') {
		cmd = 14 // STANDBY
		// Always 4-byte payload per spec [mode, 0, 0, 0]
		const mode = Math.max(0, Math.min(2, isFinite(STANDBY_MODE_ARG) ? STANDBY_MODE_ARG : 0))
		data = Buffer.from([mode & 0xff, 0x00, 0x00, 0x00])
	} else if (CMD_ARG === 'writeoutmute' || CMD_ARG === 'outmute') {
		cmd = 3 // WRITEOUTMUTE
		const ch = Math.max(0, Math.min(255, Number(process.argv[6] ?? 0) | 0))
		const val = Number(process.argv[7] ?? 1)
		const outmute = val ? 1 : 0 // 0=unmute,1=mute per PDF
		data = Buffer.from([ch & 0xff, outmute & 0xff, 0x00, 0x00])
	} else if (CMD_ARG === 'info') {
		cmd = 11 // INFO
		data = Buffer.alloc(0)
	} else if (CMD_ARG === 'readallalarms' || CMD_ARG === 'alarms' || CMD_ARG === 'status') {
		cmd = 15 // READALLALARMS (deprecated in PDF but present)
		data = Buffer.alloc(0)
	} else if (CMD_ARG === 'readallalarms2' || CMD_ARG === 'alarms2' || CMD_ARG === 'status2') {
		cmd = 25 // READALLALARMS2 (newer)
		data = Buffer.alloc(0)
	} else {
		console.warn(`Unknown cmd '${CMD_ARG}', defaulting to ping`)
		cmd = 0
	}
	let frame
	const payload = data || Buffer.alloc(0)
	const answerPortField = cmd === 14 && AP0_ARG ? 0 : local.port
	frame = buildFrame({
		cmd,
		cookie,
		answerPort: answerPortField,
		data: payload,
		forceComputedCrcForCmd14: cmd === 14 && GENCRC_ARG,
		forceZeroCrc: ZEROCRC_ARG,
	})
	console.log(`Sending ${CMD_ARG.toUpperCase()} frame:`, hex(frame))
	if (cmd === 14)
		console.log(
			`  standby mode: ${payload[0]} (0=read,1=off,2=on) | broadcast=${BROADCAST_ARG} | answer_port=${answerPortField} | crc_mode=${ZEROCRC_ARG ? 'forced_zero' : GENCRC_ARG ? 'general(computed)' : 'special(0x0000)'}`,
		)
	if (cmd === 3)
		console.log(
			`  channel=${payload[0]} | outmute=${payload[1]} (0=unmute,1=mute) | broadcast=${BROADCAST_ARG} | answer_port=${answerPortField} | crc_mode=${ZEROCRC_ARG ? 'forced_zero' : 'computed'}`,
		)

	const responses = []
	sock.on('message', (msg, rinfo) => {
		const parsed = parseFrame(msg)
		console.log(`\n<- ${rinfo.address}:${rinfo.port} (${msg.length} bytes)`)
		console.log('Raw:', hex(msg))
		if (!parsed.ok) {
			console.log('Parse error:', parsed.error)
			return
		}
		console.log('Header:', {
			STX: parsed.STX,
			cmd: parsed.cmd,
			cookie: parsed.cookie,
			count: parsed.count,
			answerPort: parsed.answerPort,
			crc16: '0x' + parsed.crc16.toString(16),
			notCmd: parsed.notCmd,
			ETX: parsed.ETX,
		})
		console.log('Data(hex):', hex(parsed.data))
		// Attempt full decode for READGM
		if (cmd === 1 && parsed.data && parsed.data.length >= 2) {
			const dv = parsed.data
			let off = 0
			const answer_ok = dv.readUInt8(off)
			off += 1
			const num_channels = dv.readUInt8(off)
			off += 1
			// two reserved/zero bytes per spec
			if (dv.length >= off + 2) off += 2
			const ingain = []
			const outgain = []
			const inmute = []
			const outmute = []
			// INGAINx (int16 LE) in centi-dB
			for (let i = 0; i < num_channels && off + 2 <= dv.length; i++) {
				ingain.push(dv.readInt16LE(off))
				off += 2
			}
			// OUTGAINx (int16 LE) in centi-dB
			for (let i = 0; i < num_channels && off + 2 <= dv.length; i++) {
				outgain.push(dv.readInt16LE(off))
				off += 2
			}
			// INMUTEx (u8)
			for (let i = 0; i < num_channels && off + 1 <= dv.length; i++) {
				inmute.push(dv.readUInt8(off))
				off += 1
			}
			// OUTMUTEx (u8)
			for (let i = 0; i < num_channels && off + 1 <= dv.length; i++) {
				outmute.push(dv.readUInt8(off))
				off += 1
			}
			console.log('READGM decoded:', { answer_ok, num_channels, dataLen: dv.length })
			// Pretty print per channel
			for (let ch = 0; ch < num_channels; ch++) {
				const ig = ingain[ch]
				const og = outgain[ch]
				const im = inmute[ch]
				const om = outmute[ch]
				const igDb = ig !== undefined ? (ig / 100).toFixed(2) : 'na'
				const ogDb = og !== undefined ? (og / 100).toFixed(2) : 'na'
				console.log(`  CH${ch + 1}: IN ${igDb} dB ${im ? 'MUTE' : 'UNMUTE'} | OUT ${ogDb} dB ${om ? 'MUTE' : 'UNMUTE'}`)
			}
		}
		// Decode INFO (128 bytes, 4 strings x 32 bytes null-terminated)
		if (cmd === 11 && parsed.data) {
			const dv = parsed.data
			const toZStr = (buf) => {
				const n = buf.indexOf(0)
				const end = n === -1 ? buf.length : n
				return buf.subarray(0, end).toString('ascii').trim()
			}
			if (dv.length >= 128) {
				const manufacturer = toZStr(dv.subarray(0, 32))
				const family = toZStr(dv.subarray(32, 64))
				const model = toZStr(dv.subarray(64, 96))
				const serial = toZStr(dv.subarray(96, 128))
				console.log('INFO decoded:', { manufacturer, family, model, serial })
			} else {
				console.log('INFO data length unexpected:', dv.length)
			}
		}
		// Decode STANDBY read
		if (cmd === 14 && parsed.data && parsed.data.length >= 2) {
			const dv = parsed.data
			const answer_ok = dv.readUInt8(0)
			const onoff = dv.readUInt8(1)
			// Per spec: response ON-OFF: 2 means STANDBY OFF (operative=power on), 1 means ON (standby, not operative)
			let powerState = 'unknown'
			if (onoff === 2) powerState = 'ON (operative)'
			else if (onoff === 1) powerState = 'STANDBY (not operative)'
			console.log('STANDBY decoded:', { answer_ok, onoff, powerState, dataLen: dv.length })
		}
		// Decode WRITEOUTMUTE response: [answer_ok, CHANNEL, OUTMUTE, 0]
		if (cmd === 3 && parsed.data && parsed.data.length >= 3) {
			const dv = parsed.data
			const answer_ok = dv.readUInt8(0)
			const channel = dv.readUInt8(1)
			const outmute = dv.readUInt8(2)
			console.log('WRITEOUTMUTE decoded:', { answer_ok, channel, outmute, dataLen: dv.length })
		}
		// Decode READALLALARMS: 4 bytes [answer_ok, alarms, 0, 0]
		if (cmd === 15 && parsed.data) {
			const dv = parsed.data
			if (dv.length >= 2) {
				const answer_ok = dv.readUInt8(0)
				const alarms = dv.readUInt8(1)
				const bin = alarms.toString(2).padStart(8, '0')
				console.log('READALLALARMS decoded:', {
					answer_ok,
					alarms_hex: '0x' + alarms.toString(16).padStart(2, '0'),
					alarms_bin: bin,
					dataLen: dv.length,
				})
			} else {
				console.log('READALLALARMS data length unexpected:', dv.length)
			}
		}
		// Decode READALLALARMS2
		if (cmd === 25 && parsed.data) {
			const dv = parsed.data
			let off = 0
			if (dv.length < 4) {
				console.log('READALLALARMS2 data length unexpected:', dv.length)
			} else {
				const answer_ok = dv.readUInt8(off)
				off += 1
				const gpio_alarms = dv.readUInt8(off)
				off += 1
				// two reserved bytes
				off += 2
				const words = []
				while (off + 4 <= dv.length) {
					words.push(dv.readUInt32LE(off))
					off += 4
				}
				const global_alarms = words[0] ?? 0
				const channel_alarms = words.slice(1)
				const toHex32 = (v) => '0x' + (v >>> 0).toString(16).padStart(8, '0')
				const listBits = (v) => {
					const bits = []
					for (let i = 0; i < 32; i++) if ((v >>> i) & 1) bits.push(i)
					return bits
				}
				console.log('READALLALARMS2 decoded:', {
					answer_ok,
					gpio_alarms_hex: '0x' + gpio_alarms.toString(16).padStart(2, '0'),
					gpio_alarms_bin: gpio_alarms.toString(2).padStart(8, '0'),
					global_alarms_hex: toHex32(global_alarms),
					global_alarms_bits: listBits(global_alarms),
					channels: channel_alarms.map((v, i) => ({ ch: i, hex: toHex32(v), bits: listBits(v) })),
					dataLen: dv.length,
				})
				// Pretty notes for mapping (from PDF). We only print when bits are set to reduce noise.
				const explainGlobal = (v) => {
					const notes = []
					if (v & (1 << 0)) notes.push('bit0 mains phases detect error (only X)')
					if (v & (1 << 1)) notes.push('bit1 AD config fault')
					if (v & (1 << 2)) notes.push('bit2 DA config fault')
					if (v & (1 << 3)) notes.push('bit3 AUX voltage fault (only X)')
					if (v & (1 << 4)) notes.push('bit4 Digi board over-temp [shutdown]')
					if (v & (1 << 5)) notes.push('bit5 PSU over-temp (only X) [shutdown]')
					if (v & (1 << 6)) notes.push('bit6 Fan fault [shutdown]')
					if (v & (1 << 7)) notes.push('bit7 moderate over-temp (only X) [shutdown]')
					if (v & (1 << 8)) notes.push('bit8 high over-temp (only X) [shutdown]')
					return notes
				}
				const explainCh = (v) => {
					const notes = []
					if (v & (1 << 0)) notes.push('bit0 input clip')
					if (v & (1 << 1)) notes.push('bit1 active thermal SOA (only X)')
					// bit2 unspecified in excerpt
					if (v & (1 << 3)) notes.push('bit3 over-temperature')
					if (v & (1 << 4)) notes.push('bit4 rail voltage fault')
					if (v & (1 << 5)) notes.push('bit5 AUX current fault (only X)')
					if (v & (1 << 6)) notes.push('bit6 other fault')
					if (v & (1 << 7)) notes.push('bit7 low load protection')
					return notes
				}
				const gNotes = explainGlobal(global_alarms)
				if (gNotes.length) console.log('READALLALARMS2 global alarms notes:', gNotes)
				channel_alarms.forEach((v, i) => {
					const notes = explainCh(v)
					if (notes.length) console.log(`READALLALARMS2 CH${i} alarms notes:`, notes)
				})
			}
		}
		const cookieOk = parsed.cookie === cookie
		console.log('Cookie match:', cookieOk)
		responses.push({ from: rinfo, parsed })
	})

	if (BROADCAST_ARG) {
		sock.setBroadcast(true)
		await new Promise((resolve) => sock.send(frame, PORT, '255.255.255.255', resolve))
	} else {
		await new Promise((resolve) => sock.send(frame, PORT, HOST, resolve))
	}
	console.log('Frame sent, waiting for response...')

	await new Promise((resolve) => setTimeout(resolve, TIMEOUT_MS))
	try {
		sock.close()
	} catch (e) {
		// acknowledge error and continue
		void e
	}

	if (!responses.length) {
		console.error('No UDP responses received.')
		throw new Error('No UDP responses received')
	}
	console.log(`\nReceived ${responses.length} response(s).`)
}

main().catch((e) => {
	console.error('Fatal:', e)
	process.exitCode = 1
})
