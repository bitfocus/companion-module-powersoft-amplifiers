import dgram from 'dgram'

// Minimal UDP client for Powersoft Canali-DSP second API (read-only)
// Implements: READGM (0x01), STANDBY (0x0E - read), READALLALARMS2 (0x19)

export interface UdpOptions {
	host: string
	devicePort?: number // default 1234
	answerPortZero?: boolean // send answer_port=0 instead of our bound port
	timeoutMs?: number // default 800
}

export interface UdpStatus {
	power?: boolean
	fault?: boolean
	// Critical per-channel indicators populated from READALLALARMS2 when available
	channels: Array<{
		mute?: boolean
		gain?: number
		clip?: boolean
		overTemp?: boolean
		lowLoad?: boolean
		railFault?: boolean
		otherFault?: boolean
		thermalSOA?: boolean
		auxCurrentFault?: boolean
	}>
}

const CMD = {
	READGM: 0x01,
	INFO: 0x0b,
	STANDBY: 0x0e,
	READALLALARMS2: 0x19,
} as const

function crc16IBM(buf: Buffer, offset: number, len: number): number {
	let crc = 0xffff
	for (let i = 0; i < len; i++) {
		crc ^= buf[offset + i]
		for (let j = 0; j < 8; j++) {
			const mix = crc & 1
			crc >>= 1
			if (mix) crc ^= 0xa001
		}
	}
	return crc & 0xffff
}

function buildFrame(cmd: number, cookie: number, answerPort: number, data: Buffer, forceZeroCrc = false): Buffer {
	const count = data.length
	const headerLen = 1 + 1 + 2 + 2 + 2 // STX + cmd + cookie + count + answer_port
	const trailerLen = 2 + 1 + 1 // crc16 + notCmd + ETX
	const total = headerLen + count + trailerLen
	const out = Buffer.alloc(total)
	let o = 0
	out[o++] = 0x02 // STX
	out[o++] = cmd & 0xff
	out.writeUInt16LE(cookie & 0xffff, o)
	o += 2
	out.writeUInt16LE(count & 0xffff, o)
	o += 2
	out.writeUInt16LE(answerPort & 0xffff, o)
	o += 2
	if (count > 0) data.copy(out, o)
	o += count
	let crc = 0
	if (!forceZeroCrc) {
		// CRC over all bytes from start up to end of data
		crc = crc16IBM(out, 0, 8 + count) // bytes [0..7+N]
	}
	out.writeUInt16LE(crc & 0xffff, o)
	o += 2
	out[o++] = ~cmd & 0xff
	out[o++] = 0x03 // ETX
	return out
}

function parseHeader(msg: Buffer) {
	if (msg.length < 12) throw new Error('UDP frame too short')
	const STX = msg[0]
	const cmd = msg[1]
	const cookie = msg.readUInt16LE(2)
	const count = msg.readUInt16LE(4)
	const answerPort = msg.readUInt16LE(6)
	const dataStart = 8
	const dataEnd = dataStart + count
	if (STX !== 0x02) throw new Error('Bad STX')
	if (msg.length < dataEnd + 4) throw new Error('Truncated frame')
	const crc16 = msg.readUInt16LE(dataEnd)
	const notCmd = msg[dataEnd + 1]
	const ETX = msg[dataEnd + 2]
	const data = msg.subarray(dataStart, dataEnd)
	return { STX, cmd, cookie, count, answerPort, data, crc16, notCmd, ETX }
}

function parseStandbyData(data: Buffer): { ok: boolean; standbyRaw?: number } {
	// Expect 4 bytes: [answer_ok, ON_OFF, 0, 0]
	if (data.length >= 2) {
		const answer_ok = data[0]
		const on_off = data[1]
		return { ok: answer_ok === 1, standbyRaw: on_off }
	}
	return { ok: false }
}

function parseReadgmData(data: Buffer, maxChannels: number) {
	// Byte0=answer_ok, Byte1=num_channels, then per-channel: inGain(int16), outGain(int16), inMute(u8), outMute(u8)
	const res = {
		ok: false,
		channels: [] as Array<{ inGain?: number; outGain?: number; inMute?: boolean; outMute?: boolean }>,
	}
	if (data.length < 2) return res
	const ok = data[0] === 1
	const n = data[1]
	res.ok = ok
	let p = 2
	const ch = Math.min(n, maxChannels)
	for (let i = 0; i < ch; i++) {
		if (p + 6 > data.length) break
		const inGainCent = data.readInt16LE(p)
		p += 2
		const outGainCent = data.readInt16LE(p)
		p += 2
		const inMute = data[p++]
		const outMute = data[p++]
		res.channels[i] = {
			inGain: inGainCent / 100,
			outGain: outGainCent / 100,
			inMute: inMute === 1,
			outMute: outMute === 1,
		}
	}
	return res
}

function parseReadAllAlarms2Data(data: Buffer): {
	ok: boolean
	fault: boolean
	gpio?: number
	global?: number
	channelWords?: number[]
} {
	// Expect: [answer_ok(u8), gpio_alarms(u8), 0(u16), global(u32), ch0..ch7(u32 each)]
	if (data.length < 1) return { ok: false, fault: false }
	const ok = data[0] === 1
	if (!ok) return { ok: false, fault: false }
	if (data.length < 1 + 1 + 2 + 4) return { ok: true, fault: false }
	const gpio = data[1]
	let p = 1 + 1 + 2
	const global = data.readUInt32LE(p)
	p += 4
	const channelWords: number[] = []
	for (let i = 0; i < 8 && p + 4 <= data.length; i++) {
		channelWords[i] = data.readUInt32LE(p)
		p += 4
	}
	const fault = (global ?? 0) !== 0 || channelWords.some((w) => (w ?? 0) !== 0)
	return { ok: true, fault, gpio, global, channelWords }
}

async function udpRequest(opts: UdpOptions, cmd: number, data: Buffer, forceZeroCrc = false): Promise<Buffer> {
	const host = opts.host
	const devicePort = opts.devicePort ?? 1234
	const timeoutMs = opts.timeoutMs ?? 800

	const socket = dgram.createSocket('udp4')
	const cookie = Math.floor(Math.random() * 65535)

	const answerPort = await new Promise<number>((resolve, reject) => {
		socket.once('error', (e) => reject(e))
		socket.bind(0, () => {
			const addr = socket.address()
			resolve(typeof addr === 'object' ? addr.port : 0)
		})
	})

	const ap = opts.answerPortZero ? 0 : answerPort
	const forceZero = forceZeroCrc || cmd === CMD.STANDBY // STANDBY requires CRC=0
	const frame = buildFrame(cmd, cookie, ap, data, forceZero)

	return new Promise<Buffer>((resolve, reject) => {
		const timer = setTimeout(() => {
			socket.close()
			reject(new Error('UDP timeout'))
		}, timeoutMs)

		socket.once('message', (msg) => {
			clearTimeout(timer)
			socket.close()
			try {
				const h = parseHeader(msg)
				if (((h.cmd ^ 0xff) & 0xff) !== cmd) return reject(new Error('Unexpected cmd in response'))
				if (h.cookie !== cookie) return reject(new Error('Cookie mismatch'))
				resolve(h.data)
			} catch (e) {
				reject(e instanceof Error ? e : new Error(String(e)))
			}
		})

		socket.send(frame, devicePort, host, (err) => {
			if (err) {
				clearTimeout(timer)
				socket.close()
				reject(err instanceof Error ? err : new Error(String(err)))
			}
		})
	})
}

export async function readUdpStatus(opts: UdpOptions, maxChannels: number): Promise<UdpStatus> {
	const status: UdpStatus = { channels: Array.from({ length: maxChannels }, () => ({})) }
	try {
		// STANDBY read: data=[0,0,0,0]
		const standbyData = await udpRequest(opts, CMD.STANDBY, Buffer.from([0, 0, 0, 0]), true)
		const s = parseStandbyData(standbyData)
		if (s.ok && s.standbyRaw !== undefined) {
			// PDF: 2 => STANDBY OFF (operative), 1 => STANDBY ON
			status.power = s.standbyRaw === 2
		}
	} catch (_) {
		// ignore
	}
	try {
		const gmData = await udpRequest(opts, CMD.READGM, Buffer.alloc(0))
		const gm = parseReadgmData(gmData, maxChannels)
		if (gm.ok) {
			for (let i = 0; i < Math.min(gm.channels.length, maxChannels); i++) {
				const ch = gm.channels[i]
				if (!ch) continue
				// Prefer output mute/gain when available; fallback to input
				status.channels[i].mute = ch.outMute ?? ch.inMute
				const g = typeof ch.outGain === 'number' ? ch.outGain : ch.inGain
				if (typeof g === 'number') status.channels[i].gain = g
			}
		}
	} catch (_) {
		// ignore
	}
	try {
		const alData = await udpRequest(opts, CMD.READALLALARMS2, Buffer.alloc(0))
		const a = parseReadAllAlarms2Data(alData)
		if (a.ok) {
			status.fault = a.fault
			// Map per‑channel critical bits when available
			const words = a.channelWords || []
			for (let i = 0; i < Math.min(words.length, maxChannels); i++) {
				const w = words[i] >>> 0
				if (w) {
					// Bit mapping from PDF
					status.channels[i].clip = (w & (1 << 0)) !== 0
					status.channels[i].thermalSOA = (w & (1 << 1)) !== 0
					status.channels[i].overTemp = (w & (1 << 3)) !== 0
					status.channels[i].railFault = (w & (1 << 4)) !== 0
					status.channels[i].auxCurrentFault = (w & (1 << 5)) !== 0
					status.channels[i].otherFault = (w & (1 << 6)) !== 0
					status.channels[i].lowLoad = (w & (1 << 7)) !== 0
				}
			}
		}
	} catch (_) {
		// ignore
	}
	return status
}
