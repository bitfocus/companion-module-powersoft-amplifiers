import * as dgram from 'node:dgram'
import { networkInterfaces } from 'node:os'

const FS = String.fromCharCode(0x1c)

// Default RSA Public Key as specified in Powersoft discovery documentation
// It must be sent verbatim, including line breaks (LF) and header/footer lines
export const DEFAULT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+FWqPd1LGfQn6dGbWRh//pUZm
LNAr1phxnToHHW75hXrMWSgA+vrGwR8SELrdgaqL2Gjyboen5BP7dFndF04hnIO3
DMdUSum4adSoZikzJe0w+o9Cm4p153K9WkJTJ7fPdcmb8wWMLUvI4/6Yjdazz1sy
1S9mRjS4SksSTTz0tQIDAQAB
-----END PUBLIC KEY-----`

// Precomputed discovery packet buffer at module load time
const CLIENT_NAME = 'bitfocus_companion'
export const DEFAULT_DISCOVERY_PACKET: Buffer = (() => {
	const normalizedKey = DEFAULT_PUBLIC_KEY.replace(/\r\n/g, '\n')
	const parts = ['@?', '', normalizedKey, CLIENT_NAME]
	const body = parts.join(FS)
	const payload = `${body}!`
	return Buffer.from(payload, 'utf8')
})()

export type FoundDevice = {
	host: string
	model?: string
	fw?: string
	serial?: string
	options?: string
	raw?: string
}

export function parseDiscoveryResponse(msg: Buffer): { ok: boolean; fields?: string[] } {
	try {
		const str = msg.toString('utf8')
		if (!str.startsWith('@?D') || !str.endsWith('!')) return { ok: false }
		const core = str.substring(0, str.length - 1) // drop '!'
		const withoutHeader = core.startsWith('@?D') ? core.substring(3) : core
		const fields = withoutHeader.split(FS)
		return { ok: true, fields }
	} catch (_e) {
		return { ok: false }
	}
}

type DiscoveryContext = {
	SCANNING: boolean
	discoverySocket?: dgram.Socket
	FOUND_DEVICES: Record<string, FoundDevice>
	_discoveryInterval?: NodeJS.Timeout | null
	_discUiDebounce?: NodeJS.Timeout | null
	config?: { host?: string; deviceIds?: string[] }
	saveConfig: (c: any) => void
	log: (level: 'info' | 'debug' | 'warn' | 'error', msg: string) => void
}

function getBroadcastAddrs(): string[] {
	try {
		const nets = networkInterfaces()
		const addrs = new Set<string>()
		for (const name of Object.keys(nets)) {
			for (const info of nets[name] || []) {
				if (info.family !== 'IPv4' || info.internal) continue
				const ip = info.address?.split('.').map((v) => parseInt(v, 10))
				const mask = (info as any).netmask?.split?.('.')?.map?.((v: string) => parseInt(v, 10))
				if (!ip || ip.length !== 4 || !mask || mask.length !== 4) continue
				const bcast = [0, 1, 2, 3]
					.map((i) => (ip[i] & mask[i]) | (255 ^ mask[i]))
					.join('.')
				addrs.add(bcast)
			}
		}
		// Always include global broadcast as fallback
		addrs.add('255.255.255.255')
		return Array.from(addrs)
	} catch {
		return ['255.255.255.255']
	}
}

export function startDiscovery(self: DiscoveryContext): void {
	if (self.SCANNING) return

	const socket = dgram.createSocket('udp4')
	self.discoverySocket = socket
	self.FOUND_DEVICES = self.FOUND_DEVICES || {}

	socket.on('message', (msg: Buffer, rinfo) => {
		const res = parseDiscoveryResponse(msg)
		if (!res.ok || !res.fields) return
		const f = res.fields
		// Expect: [Model, FwVersion, serialNumber, ..., options, ...]
		const model = f[0] || 'Powersoft'
		const fw = f[1] || ''
		const serial = f[2] || rinfo.address
		// Find an 'options' field near the end if present
		let options = ''
		for (let i = f.length - 1; i >= 0; i--) {
			const v = f[i]
			if (v === '-' || v === 'D' || v === '+' || v === 'D+' || v === '+D') {
				options = v
				break
			}
		}
		const id = serial || rinfo.address
		const isNew = !self.FOUND_DEVICES[id]
		self.FOUND_DEVICES[id] = {
			host: rinfo.address,
			model,
			fw,
			serial,
			options,
			raw: msg.toString('utf8'),
		} as FoundDevice
		// Verbose lines matching expected probe format
		try {
			const rawStr = msg.toString('utf8')
			const fieldsLine = `Fields=${f.join(' | ')}`
			const headerLine = `Model=${model} FW=${fw} Serial=${serial} Options=${options || '-'}`
			self.log('info', headerLine)
			self.log('info', fieldsLine)
			self.log('info', `Raw=${rawStr}`)
		} catch {
			// no-op
		}
		// Debounced UI refresh so GetConfigFields() can rebuild choices while scanning
		if (isNew) {
			try {
				if (self._discUiDebounce) clearTimeout(self._discUiDebounce)
				self._discUiDebounce = setTimeout(() => {
					try {
						const cfg = { ...(self as any).config }
						;(cfg as any)._discNonce = Date.now()
						self.saveConfig(cfg)
					} catch {
						// no-op
					}
				}, 400)
			} catch {
				// no-op
			}
		}
		// If this matches configured host, preselect in deviceIds
		if (self.config && self.config.host === rinfo.address) {
			const list: string[] = Array.isArray(self.config.deviceIds) ? self.config.deviceIds : []
			if (!list.includes(id)) {
				list.push(id)
				self.config.deviceIds = list
				self.saveConfig(self.config)
			}
		}
		self.log('info', `Discovered ${model} ${serial} at ${rinfo.address}${options ? ' (' + options + ')' : ''}`)
	})

	socket.on('error', (err) => {
		self.log('debug', `Discovery socket error: ${err?.message || err}`)
	})

	socket.bind(0, () => {
		try {
			socket.setBroadcast(true)
			self.log('debug', 'Discovery: socket bound and broadcast enabled')
		} catch (_e) {
			// no-op
		}
		self.SCANNING = true
		self.log('info', 'Discovery: started (UDP broadcast 8004)')
		// Send initial packet and then repeat a few times to improve hit rate
		const packet = DEFAULT_DISCOVERY_PACKET
		const targets = getBroadcastAddrs()
		self.log('debug', `Discovery: broadcast targets = ${targets.join(', ')}`)
		const sendOnce = () => {
			for (const addr of targets) {
				socket.send(packet, 8004, addr, (err) => {
					if (err) self.log('debug', `Discovery send error to ${addr}: ${err?.message || err}`)
					else self.log('debug', `Discovery: broadcast packet sent to ${addr}:8004`)
				})
			}
		}
		sendOnce()
		self._discoveryInterval = setInterval(sendOnce, 2000)
	})
}

export function stopDiscovery(self: DiscoveryContext): void {
	self.SCANNING = false
	if (self._discoveryInterval) {
		clearInterval(self._discoveryInterval)
		self._discoveryInterval = null
	}
	if (self.discoverySocket) {
		try {
			self.discoverySocket.close()
		} catch (_e) {
			// no-op
		}
		self.discoverySocket = undefined
	}
	self.log('info', 'Discovery: stopped')
}
