import type { ModuleInstance } from './main.js'
import { listDevices, sanitizeDeviceId } from './devices.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	const chCount = self.config.maxChannels
	const hosts = listDevices(self.config)
	const udpEnabled = Boolean(self.config.enableUdpFeedback)

	const defs: { variableId: string; name: string }[] = []

	const addDeviceDefs = (id: string, label: string) => {
		defs.push(
			{ variableId: `name_${id}`, name: `Device Name [${label}]` },
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
				{ variableId: `ch${ch}_limiter_threshold_${id}`, name: `Ch ${ch} Limiter Threshold (dB) [${label}]` },
				{ variableId: `ch${ch}_clip_${id}`, name: `Ch ${ch} Clip [${label}]` },
				{ variableId: `ch${ch}_signal_${id}`, name: `Ch ${ch} Signal Present [${label}]` },
				{ variableId: `ch${ch}_temp_${id}`, name: `Ch ${ch} Temperature (°C) [${label}]` },
				{ variableId: `ch${ch}_impedance_${id}`, name: `Ch ${ch} Load Impedance (Ω) [${label}]` },
				{ variableId: `sp${ch}_model_${id}`, name: `Speaker ${ch} Model [${label}]` },
			)
			// UDP-specific per-channel alarm variables are only exposed when UDP feedback is enabled
			if (udpEnabled) {
				defs.push(
					{ variableId: `ch${ch}_overtemp_${id}`, name: `Ch ${ch} Over-Temperature [${label}]` },
					{ variableId: `ch${ch}_lowload_${id}`, name: `Ch ${ch} Low Load Protection [${label}]` },
					{ variableId: `ch${ch}_rail_fault_${id}`, name: `Ch ${ch} Rail Voltage Fault [${label}]` },
					{ variableId: `ch${ch}_other_fault_${id}`, name: `Ch ${ch} Other Fault [${label}]` },
					{ variableId: `ch${ch}_thermal_soa_${id}`, name: `Ch ${ch} Thermal SOA [${label}]` },
					{ variableId: `ch${ch}_aux_current_fault_${id}`, name: `Ch ${ch} AUX Current Fault [${label}]` },
				)
			}
		}
	}

	if (hosts.length > 0) {
		for (const host of hosts) addDeviceDefs(sanitizeDeviceId(host), host)
	} else if (self.config.host) {
		addDeviceDefs(sanitizeDeviceId(self.config.host), self.config.host)
	}

	self.setVariableDefinitions(defs)
}

export function UpdateVariables(self: ModuleInstance): void {
	const variables: Record<string, string> = {}
	const hosts = listDevices(self.config)
	const chCount = self.config.maxChannels
	const udpEnabled = Boolean(self.config.enableUdpFeedback)

	const writeDeviceVars = (id: string, label: string, status: any) => {
		variables[`name_${id}`] = status.name || label
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
			variables[`ch${ch}_limiter_threshold_${id}`] =
				channel.limiterThreshold !== undefined && channel.limiterThreshold !== null
					? Number(channel.limiterThreshold).toFixed(1)
					: 'n/a'
			variables[`ch${ch}_clip_${id}`] = channel.clip ? 'Clipping' : 'OK'
			variables[`ch${ch}_signal_${id}`] = channel.signalPresent ? 'Yes' : 'No'
			variables[`ch${ch}_temp_${id}`] = channel.temp?.toFixed(1) || '0'
			variables[`ch${ch}_impedance_${id}`] = channel.loadImpedance?.toFixed(2) || '0.00'
			const speaker = status.speakers?.[i] || {}
			variables[`sp${ch}_model_${id}`] = speaker.modelName || 'Unknown'
			// Only set UDP alarm variables when UDP feedback is enabled
			if (udpEnabled) {
				variables[`ch${ch}_overtemp_${id}`] = channel.overTemp ? 'Yes' : 'No'
				variables[`ch${ch}_lowload_${id}`] = channel.lowLoad ? 'Yes' : 'No'
				variables[`ch${ch}_rail_fault_${id}`] = channel.railFault ? 'Yes' : 'No'
				variables[`ch${ch}_other_fault_${id}`] = channel.otherFault ? 'Yes' : 'No'
				variables[`ch${ch}_thermal_soa_${id}`] = channel.thermalSOA ? 'Yes' : 'No'
				variables[`ch${ch}_aux_current_fault_${id}`] = channel.auxCurrentFault ? 'Yes' : 'No'
			}
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
	self.setVariableValues(variables)
}
