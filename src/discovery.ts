import dgram from 'dgram'

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
	config?: { host?: string; deviceIds?: string[] }
	saveConfig: (c: any) => void
	log: (level: 'info' | 'debug' | 'warn' | 'error', msg: string) => void
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
		for (let i = Math.min(f.length - 1, 8); i >= 0; i--) {
			const v = f[i]
			if (v === '-' || v === 'D' || v === '+' || v === 'D+' || v === '+D') {
				options = v
				break
			}
		}
		const id = serial || rinfo.address
		self.FOUND_DEVICES[id] = {
			host: rinfo.address,
			model,
			fw,
			serial,
			options,
			raw: msg.toString('utf8'),
		} as FoundDevice
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
		} catch (_e) {
			// no-op
		}
		self.SCANNING = true
		self.log('info', 'Discovery: started (UDP broadcast 8004)')
		// Send initial packet and then repeat a few times to improve hit rate
		const packet = DEFAULT_DISCOVERY_PACKET
		const sendOnce = () => {
			socket.send(packet, 8004, '255.255.255.255', (err) => {
				if (err) self.log('debug', `Discovery send error: ${err?.message || err}`)
			})
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
