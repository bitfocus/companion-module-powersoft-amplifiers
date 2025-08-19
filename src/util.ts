import type { ModuleInstance } from './main.js'
import { InstanceStatus } from '@companion-module/base'

// Interface for Powersoft device status
export interface DeviceStatus {
	device: {
		model: string
		firmware: string
		serialNumber: string
	}
	channels: Array<{
		id: number
		name: string
		mute: boolean
		gain: number
		peak: number
		clip: boolean
		signalPresent: boolean
		temp: number
		loadImpedance: number
	}>
	system: {
		power: boolean
		temp: number
		fanSpeed: number
		error: string | null
	}
}

// Default device state
export const defaultDeviceState: DeviceStatus = {
	device: {
		model: 'Unknown',
		firmware: '0.0.0',
		serialNumber: '',
	},
	channels: [],
	system: {
		power: false,
		temp: 0,
		fanSpeed: 0,
		error: null,
	},
}

// Handle HTTP response from the device
export function handleDeviceMessage(message: unknown, state: DeviceStatus): DeviceStatus {
	try {
		// Update device information
		const msg = message as any
		if (msg.device) {
			state.device = {
				...state.device,
				...msg.device,
			}
		}

		// Update channel status
		if (msg.channels) {
			msg.channels.forEach((channelUpdate: any) => {
				const channel = state.channels.find((c) => c.id === channelUpdate.id)
				if (channel) {
					Object.assign(channel, channelUpdate)
				} else {
					state.channels.push({
						id: channelUpdate.id,
						name: `Channel ${channelUpdate.id}`,
						mute: false,
						gain: 0,
						peak: 0,
						clip: false,
						signalPresent: false,
						temp: 0,
						loadImpedance: 0,
						...channelUpdate,
					})
				}
			})
		}

		// Update system status
		if (msg.system) {
			state.system = {
				...state.system,
				...msg.system,
			}
		}

		return { ...state }
	} catch (error) {
		console.error('Error handling device message:', error)
		return state
	}
}

// Round a number to specified decimal places
export function round(num: number, fractionDigits: number): number {
	return Number(num.toFixed(fractionDigits))
}

// Update module variables based on device state
export async function updateVariables(self: ModuleInstance, state: DeviceStatus): Promise<void> {
	try {
		const varsToUpdate: Record<string, any> = {}

		// Update device info variables
		varsToUpdate['model'] = state.device.model
		varsToUpdate['firmware'] = state.device.firmware
		varsToUpdate['serial_number'] = state.device.serialNumber

		// Update system variables
		varsToUpdate['power'] = state.system.power ? 'On' : 'Off'
		varsToUpdate['temperature'] = state.system.temp
		varsToUpdate['fan_speed'] = state.system.fanSpeed
		varsToUpdate['error'] = state.system.error || 'None'

		// Update channel variables
		state.channels.forEach((channel) => {
			const prefix = `ch${channel.id}_`
			varsToUpdate[`${prefix}name`] = channel.name
			varsToUpdate[`${prefix}mute`] = channel.mute ? 'Muted' : 'Unmuted'
			varsToUpdate[`${prefix}gain`] = channel.gain
			varsToUpdate[`${prefix}peak`] = channel.peak
			varsToUpdate[`${prefix}clip`] = channel.clip ? 'Clipping' : 'OK'
			varsToUpdate[`${prefix}signal`] = channel.signalPresent ? 'Signal' : 'No Signal'
			varsToUpdate[`${prefix}temp`] = channel.temp
			varsToUpdate[`${prefix}impedance`] = channel.loadImpedance
		})

		// Only update changed variables
		const changedVars: Record<string, any> = {}
		for (const [key, value] of Object.entries(varsToUpdate)) {
			if (self.getVariableValue(key) !== value) {
				changedVars[key] = value
			}
		}

		if (Object.keys(changedVars).length > 0) {
			self.setVariableValues(changedVars)
			self.checkFeedbacks()
		}

		self.updateStatus(InstanceStatus.Ok)
	} catch (error) {
		console.error('Error updating variables:', error)
		self.updateStatus(InstanceStatus.UnknownError, 'Error updating variables')
	}
}
