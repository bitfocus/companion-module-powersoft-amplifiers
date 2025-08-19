import type { ModuleInstance } from './main.js'
import { ParameterPaths } from './parameterPaths.js'
import { ActionType, ValueType } from './enums.js'
import { buildAgileRequest } from './api.js'
import { listDevices, sanitizeDeviceId } from './devices.js'

// Utility to build the /am endpoint URL
function getAmplifierApiUrl(host: string, useHttps: boolean = false, port?: number): string {
	const scheme = useHttps ? 'https' : 'http'
	const portPart = port ? `:${port}` : ''
	return `${scheme}://${host}${portPart}/am`
}

// Example placeholder for the actual HTTP(S) POST logic
async function postToAmplifier(url: string, payload: any, self: ModuleInstance) {
	const { default: got } = await import('got')
	self.log('debug', `POST ${url} with payload: ${JSON.stringify(payload)}`)
	try {
		const res = await got.post(url, {
			json: payload,
			responseType: 'json',
			timeout: { request: 5000 },
			https: { rejectUnauthorized: false }, // Some devices may use self-signed certs
		})
		self.log('debug', `Response ${res.statusCode}: ${JSON.stringify(res.body)}`)
		return res.body
	} catch (err: any) {
		const msg = err?.response?.body ? JSON.stringify(err.response.body) : err?.message || String(err)
		self.log('error', `HTTP error posting to amplifier: ${msg}`)
		throw err
	}
}

export function UpdateActions(self: ModuleInstance): void {
	const deviceChoices = (): { id: string; label: string }[] => {
		const hosts = listDevices(self.config)
		const arr = hosts.length > 0 ? hosts : self.config.host ? [self.config.host] : []
		return arr.map((h) => ({ id: h, label: h }))
	}
	const resolveUrl = (selected?: string): string => {
		const host =
			selected && String(selected).length > 0 ? String(selected) : listDevices(self.config)[0] || self.config.host
		return getAmplifierApiUrl(host, self.config.useHttps, self.config.port)
	}
	self.setActionDefinitions({
		// Power Control
		powerOn: {
			name: 'Power On',
			options: [
				{
					type: 'dropdown',
					id: 'device',
					label: 'Device',
					default: deviceChoices()[0]?.id,
					choices: deviceChoices(),
					tooltip: 'Select target device. Defaults to first device if not set.',
				},
			],
			callback: async (action) => {
				const url = resolveUrl(action.options.device as string)
				const payload = buildAgileRequest({
					actionType: ActionType.WRITE,
					valueType: ValueType.BOOL,
					path: ParameterPaths.DEVICE_STANDBY,
					value: false, // Standby OFF = Power ON
				})
				await postToAmplifier(url, payload, self)
			},
		},
		powerOff: {
			name: 'Power Off',
			options: [
				{
					type: 'dropdown',
					id: 'device',
					label: 'Device',
					default: deviceChoices()[0]?.id,
					choices: deviceChoices(),
				},
			],
			callback: async (action) => {
				const url = resolveUrl(action.options.device as string)
				const payload = buildAgileRequest({
					actionType: ActionType.WRITE,
					valueType: ValueType.BOOL,
					path: ParameterPaths.DEVICE_STANDBY,
					value: true, // Standby ON = Power OFF
				})
				await postToAmplifier(url, payload, self)
			},
		},
		togglePower: {
			name: 'Toggle Power',
			options: [
				{
					type: 'dropdown',
					id: 'device',
					label: 'Device',
					default: deviceChoices()[0]?.id,
					choices: deviceChoices(),
				},
			],
			callback: async (action) => {
				const host = (action.options.device as string) || listDevices(self.config)[0] || self.config.host
				const id = sanitizeDeviceId(host || '')
				const current = self.deviceStatusById[id]?.power === true
				const url = resolveUrl(host)
				const payload = buildAgileRequest({
					actionType: ActionType.WRITE,
					valueType: ValueType.BOOL,
					path: ParameterPaths.DEVICE_STANDBY,
					value: current ? true : false, // if currently ON -> standby true (turn off), else standby false (turn on)
				})
				await postToAmplifier(url, payload, self)
			},
		},

		// Channel Mute Control
		muteChannel: {
			name: 'Mute Channel',
			options: [
				{
					type: 'dropdown',
					id: 'device',
					label: 'Device',
					default: deviceChoices()[0]?.id,
					choices: deviceChoices(),
				},
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: Array.from({ length: self.config.maxChannels || 8 }, (_, i) => ({
						id: i + 1,
						label: `Channel ${i + 1}`,
					})),
				},
			],
			callback: async (action) => {
				const channel = (action.options.channel as number) - 1
				const url = resolveUrl(action.options.device as string)
				const path = ParameterPaths.INPUT_CHANNEL_MUTE.replace('{0}', String(channel))
				const payload = buildAgileRequest({
					actionType: ActionType.WRITE,
					valueType: ValueType.BOOL,
					path,
					value: true,
				})
				await postToAmplifier(url, payload, self)
			},
		},
		unmuteChannel: {
			name: 'Unmute Channel',
			options: [
				{
					type: 'dropdown',
					id: 'device',
					label: 'Device',
					default: deviceChoices()[0]?.id,
					choices: deviceChoices(),
				},
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: Array.from({ length: self.config.maxChannels || 8 }, (_, i) => ({
						id: i + 1,
						label: `Channel ${i + 1}`,
					})),
				},
			],
			callback: async (action) => {
				const channel = (action.options.channel as number) - 1
				const url = resolveUrl(action.options.device as string)
				const path = ParameterPaths.INPUT_CHANNEL_MUTE.replace('{0}', String(channel))
				const payload = buildAgileRequest({
					actionType: ActionType.WRITE,
					valueType: ValueType.BOOL,
					path,
					value: false,
				})
				await postToAmplifier(url, payload, self)
			},
		},
		toggleMuteChannel: {
			name: 'Toggle Mute Channel',
			options: [
				{
					type: 'dropdown',
					id: 'device',
					label: 'Device',
					default: deviceChoices()[0]?.id,
					choices: deviceChoices(),
				},
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: Array.from({ length: self.config.maxChannels || 8 }, (_, i) => ({
						id: i + 1,
						label: `Channel ${i + 1}`,
					})),
				},
			],
			callback: async (action) => {
				const host = (action.options.device as string) || listDevices(self.config)[0] || self.config.host
				const id = sanitizeDeviceId(host || '')
				const ch = (action.options.channel as number) - 1
				const current = self.deviceStatusById[id]?.channels?.[ch]?.mute === true
				const url = resolveUrl(host)
				const path = ParameterPaths.INPUT_CHANNEL_MUTE.replace('{0}', String(ch))
				const payload = buildAgileRequest({
					actionType: ActionType.WRITE,
					valueType: ValueType.BOOL,
					path,
					value: !current,
				})
				await postToAmplifier(url, payload, self)
			},
		},

		// Channel Gain Control
		setChannelGain: {
			name: 'Set Channel Gain',
			options: [
				{
					type: 'dropdown',
					id: 'device',
					label: 'Device',
					default: deviceChoices()[0]?.id,
					choices: deviceChoices(),
				},
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: Array.from({ length: self.config.maxChannels || 8 }, (_, i) => ({
						id: i + 1,
						label: `Channel ${i + 1}`,
					})),
				},
				{
					type: 'number',
					label: 'Gain (dB)',
					id: 'gain',
					default: 0,
					min: -60,
					max: 20,
					step: 0.5,
					range: false,
					required: true,
				},
			],
			callback: async (action) => {
				const gain = parseFloat(action.options.gain as string)
				const url = resolveUrl(action.options.device as string)
				// Use channel value directly in the path replacement
				const path = ParameterPaths.INPUT_CHANNEL_GAIN.replace('{0}', String((action.options.channel as number) - 1))
				const payload = buildAgileRequest({
					actionType: ActionType.WRITE,
					valueType: ValueType.FLOAT,
					path,
					value: gain,
				})
				await postToAmplifier(url, payload, self)
			},
		},

		// Relative Gain Adjustment
		adjustChannelGain: {
			name: 'Adjust Channel Gain (±dB)',
			options: [
				{
					type: 'dropdown',
					id: 'device',
					label: 'Device',
					default: deviceChoices()[0]?.id,
					choices: deviceChoices(),
				},
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 1,
					choices: Array.from({ length: self.config.maxChannels || 8 }, (_, i) => ({
						id: i + 1,
						label: `Channel ${i + 1}`,
					})),
				},
				{
					type: 'number',
					label: 'Adjustment (dB)',
					id: 'adjustment',
					default: 1,
					min: -20,
					max: 20,
					step: 0.5,
					required: true,
				},
			],
			callback: async (action) => {
				const host = (action.options.device as string) || listDevices(self.config)[0] || self.config.host
				const id = sanitizeDeviceId(host || '')
				const ch = (action.options.channel as number) - 1
				const delta = parseFloat(action.options.adjustment as string)
				const current = self.deviceStatusById[id]?.channels?.[ch]?.gain
				if (typeof current !== 'number') {
					self.log('warn', 'Adjust Gain: current gain unknown; cannot apply relative change')
					return
				}
				const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
				const newGain = clamp(current + delta, -60, 20)
				const url = resolveUrl(host)
				const path = ParameterPaths.INPUT_CHANNEL_GAIN.replace('{0}', String(ch))
				const payload = buildAgileRequest({
					actionType: ActionType.WRITE,
					valueType: ValueType.FLOAT,
					path,
					value: newGain,
				})
				await postToAmplifier(url, payload, self)
			},
		},

		// Preset Recall
		recallPreset: {
			name: 'Recall Preset',
			options: [
				{
					type: 'dropdown',
					id: 'device',
					label: 'Device',
					default: deviceChoices()[0]?.id,
					choices: deviceChoices(),
				},
				{
					type: 'number',
					label: 'Preset Number',
					id: 'preset',
					default: 1,
					min: 1,
					max: 100,
					required: true,
				},
			],
			callback: async (action) => {
				const preset = action.options.preset as number
				// Not implemented: would require correct parameter path and type
				self.log('warn', `Recall Preset: implement with correct ParameterPaths and types. Preset: ${preset}`)
			},
		},

		// System Commands
		resetProtection: {
			name: 'Reset Protection',
			options: [
				{
					type: 'dropdown',
					id: 'device',
					label: 'Device',
					default: deviceChoices()[0]?.id,
					choices: deviceChoices(),
				},
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					default: 0, // 0 = all channels
					choices: [
						{ id: 0, label: 'All Channels' },
						...Array.from({ length: self.config.maxChannels || 8 }, (_, i) => ({
							id: i + 1,
							label: `Channel ${i + 1}`,
						})),
					],
				},
			],
			callback: async (action) => {
				const channel = (action.options.channel as number) - 1
				// Not implemented: would require correct parameter path and type
				self.log('warn', `Reset Protection: implement with correct ParameterPaths and types. Channel: ${channel}`)
			},
		},
		resetPeakHold: {
			name: 'Reset Peak Hold',
			options: [
				{
					type: 'dropdown',
					id: 'device',
					label: 'Device',
					default: deviceChoices()[0]?.id,
					choices: deviceChoices(),
				},
			],
			callback: async () => {
				// Not implemented: would require correct parameter path and type
				self.log('warn', 'Reset Peak Hold: implement with correct ParameterPaths and types.')
			},
		},
	})
}
