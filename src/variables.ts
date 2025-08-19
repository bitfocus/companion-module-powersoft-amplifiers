import type { ModuleInstance } from './main.js'
import { listDevices, sanitizeDeviceId } from './devices.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	const chCount = self.config.maxChannels
	const hosts = listDevices(self.config)
	const firstId =
		hosts.length > 0 ? sanitizeDeviceId(hosts[0]) : self.config.host ? sanitizeDeviceId(self.config.host) : undefined

	const defs: { variableId: string; name: string }[] = []

	const addDeviceDefs = (id: string, label: string) => {
		defs.push(
			{ variableId: `model_${id}`, name: `Device Model [${label}]` },
			{ variableId: `firmware_${id}`, name: `Firmware Version [${label}]` },
			{ variableId: `ip_${id}`, name: `IP Address [${label}]` },
			{ variableId: `power_${id}`, name: `Power State [${label}]` },
			{ variableId: `temperature_${id}`, name: `Device Temperature (°C) [${label}]` },
			{ variableId: `fanSpeed_${id}`, name: `Fan Speed (%) [${label}]` },
			{ variableId: `error_${id}`, name: `Error Message [${label}]` },
		)
		for (let i = 0; i < chCount; i++) {
			const ch = i + 1
			defs.push(
				{ variableId: `ch${ch}_mute_${id}`, name: `Ch ${ch} Mute [${label}]` },
				{ variableId: `ch${ch}_gain_${id}`, name: `Ch ${ch} Gain (dB) [${label}]` },
				{ variableId: `ch${ch}_peak_${id}`, name: `Ch ${ch} Peak Level (dB) [${label}]` },
				{ variableId: `ch${ch}_clip_${id}`, name: `Ch ${ch} Clip [${label}]` },
				{ variableId: `ch${ch}_signal_${id}`, name: `Ch ${ch} Signal Present [${label}]` },
				{ variableId: `ch${ch}_temp_${id}`, name: `Ch ${ch} Temperature (°C) [${label}]` },
				{ variableId: `ch${ch}_impedance_${id}`, name: `Ch ${ch} Load Impedance (Ω) [${label}]` },
			)
		}
	}

	if (hosts.length > 0) {
		for (const host of hosts) addDeviceDefs(sanitizeDeviceId(host), host)
	} else if (self.config.host) {
		addDeviceDefs(sanitizeDeviceId(self.config.host), self.config.host)
	}

	// Legacy single-device variables (mirror first device)
	if (firstId) {
		defs.push(
			{ variableId: 'model', name: 'Device Model' },
			{ variableId: 'firmware', name: 'Firmware Version' },
			{ variableId: 'ip', name: 'IP Address' },
			{ variableId: 'power', name: 'Power State' },
			{ variableId: 'temperature', name: 'Device Temperature (°C)' },
			{ variableId: 'fanSpeed', name: 'Fan Speed (%)' },
			{ variableId: 'error', name: 'Error Message' },
		)
		for (let i = 0; i < chCount; i++) {
			const ch = i + 1
			defs.push(
				{ variableId: `ch${ch}_mute`, name: `Channel ${ch} Mute` },
				{ variableId: `ch${ch}_gain`, name: `Channel ${ch} Gain (dB)` },
				{ variableId: `ch${ch}_peak`, name: `Channel ${ch} Peak Level (dB)` },
				{ variableId: `ch${ch}_clip`, name: `Channel ${ch} Clip` },
				{ variableId: `ch${ch}_signal`, name: `Channel ${ch} Signal Present` },
				{ variableId: `ch${ch}_temp`, name: `Channel ${ch} Temperature (°C)` },
				{ variableId: `ch${ch}_impedance`, name: `Channel ${ch} Load Impedance (Ω)` },
			)
		}
	}

	self.setVariableDefinitions(defs)
}

export function UpdateVariables(self: ModuleInstance): void {
	const variables: Record<string, string> = {}
	const hosts = listDevices(self.config)
	const firstId =
		hosts.length > 0 ? sanitizeDeviceId(hosts[0]) : self.config.host ? sanitizeDeviceId(self.config.host) : undefined
	const chCount = self.config.maxChannels

	const writeDeviceVars = (id: string, label: string, status: any) => {
		variables[`model_${id}`] = status.model || 'Unknown'
		variables[`firmware_${id}`] = status.firmware || '0.0.0'
		variables[`ip_${id}`] = status.ip || label
		variables[`power_${id}`] = status.power ? 'On' : 'Off'
		variables[`temperature_${id}`] = status.temp?.toFixed(1) || '0'
		variables[`fanSpeed_${id}`] = status.fanSpeed?.toFixed(0) || '0'
		variables[`error_${id}`] = status.error || 'None'
		for (let i = 0; i < chCount; i++) {
			const ch = i + 1
			const channel = status.channels?.[i] || {}
			variables[`ch${ch}_mute_${id}`] = channel.mute ? 'Muted' : 'Unmuted'
			variables[`ch${ch}_gain_${id}`] = channel.gain?.toFixed(1) || '0'
			variables[`ch${ch}_peak_${id}`] = channel.peak?.toFixed(1) || '-∞'
			variables[`ch${ch}_clip_${id}`] = channel.clip ? 'Clipping' : 'OK'
			variables[`ch${ch}_signal_${id}`] = channel.signalPresent ? 'Yes' : 'No'
			variables[`ch${ch}_temp_${id}`] = channel.temp?.toFixed(1) || '0'
			variables[`ch${ch}_impedance_${id}`] = channel.loadImpedance?.toFixed(2) || '0.00'
		}
	}

	if (hosts.length > 0) {
		for (const host of hosts) {
			const id = sanitizeDeviceId(host)
			writeDeviceVars(id, host, self.deviceStatusById[id] || { channels: [] })
		}
	} else if (self.config.host) {
		const id = sanitizeDeviceId(self.config.host)
		writeDeviceVars(id, self.config.host, self.deviceStatusById[id] || self.deviceStatus || { channels: [] })
	}

	// Legacy mirror from first device
	if (firstId && self.deviceStatusById[firstId]) {
		const s = self.deviceStatusById[firstId]
		variables.model = s.model || 'Unknown'
		variables.firmware = s.firmware || '0.0.0'
		variables.ip = s.ip || hosts[0] || self.config.host || '0.0.0.0'
		variables.power = s.power ? 'On' : 'Off'
		variables.temperature = s.temp?.toFixed(1) || '0'
		variables.fanSpeed = s.fanSpeed?.toFixed(0) || '0'
		variables.error = s.error || 'None'
		for (let i = 0; i < chCount; i++) {
			const ch = i + 1
			const channel = s.channels?.[i] || {}
			variables[`ch${ch}_mute`] = channel.mute ? 'Muted' : 'Unmuted'
			variables[`ch${ch}_gain`] = channel.gain?.toFixed(1) || '0'
			variables[`ch${ch}_peak`] = channel.peak?.toFixed(1) || '-∞'
			variables[`ch${ch}_clip`] = channel.clip ? 'Clipping' : 'OK'
			variables[`ch${ch}_signal`] = channel.signalPresent ? 'Yes' : 'No'
			variables[`ch${ch}_temp`] = channel.temp?.toFixed(1) || '0'
			variables[`ch${ch}_impedance`] = channel.loadImpedance?.toFixed(2) || '0.00'
		}
	}

	self.setVariableValues(variables)
}
