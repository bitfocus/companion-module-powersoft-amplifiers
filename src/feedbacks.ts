import { combineRgb } from '@companion-module/base'
import type { ModuleInstance } from './main.js'
import { ParameterPaths } from './parameterPaths.js'
import { listDevices, sanitizeDeviceId } from './devices.js'

export type FeedbackId =
	| 'powerState'
	| 'channelMute'
	| 'channelClip'
	| 'channelSignal'
	| 'channelTempWarning'
	| 'channelTempCritical'
	| 'channelImpedanceWarning'
	| 'deviceFault'

interface FeedbackBase {
	type: 'boolean' | 'advanced'
	name: string
	description: string
	defaultStyle: {
		bgcolor: number
		color: number
	}
}

interface BooleanFeedback extends FeedbackBase {
	type: 'boolean'
	options: any[]
	callback: (feedback: any) => boolean | Promise<boolean>
}

interface AdvancedFeedback extends FeedbackBase {
	type: 'advanced'
	options: any[]
	callback: (feedback: any) => boolean | Promise<boolean>
	subscribe?: (feedback: any) => void
	learn?: (feedback: any) => any
}

type Feedback = BooleanFeedback | AdvancedFeedback

export function UpdateFeedbacks(self: ModuleInstance): void {
	// Detect available capabilities from parameter paths (presence-based)
	const hasClip = 'OUTPUT_CHANNEL_CLIP' in ParameterPaths || 'INPUT_CHANNEL_CLIP' in ParameterPaths
	const hasSignal = 'OUTPUT_CHANNEL_SIGNAL' in ParameterPaths || 'INPUT_CHANNEL_SIGNAL' in ParameterPaths
	const hasTemp = 'OUTPUT_CHANNEL_TEMPERATURE' in ParameterPaths || 'INPUT_CHANNEL_TEMPERATURE' in ParameterPaths
	const hasImpedance =
		'OUTPUT_SPEAKER_IMPEDANCE' in ParameterPaths || 'OUTPUT_SPEAKER_IMPEDANCE_DETECTION_ENABLE' in ParameterPaths

	// Helpers for multi-device feedbacks
	const deviceChoices = (): { id: string; label: string }[] => {
		const hosts = listDevices(self.config)
		const arr = hosts.length > 0 ? hosts : self.config.host ? [self.config.host] : []
		return arr.map((h) => ({ id: h, label: h }))
	}
	const resolveStatus = (selected?: string): any => {
		const host =
			selected && String(selected).length > 0 ? String(selected) : listDevices(self.config)[0] || self.config.host
		const id = sanitizeDeviceId(host)
		return self.deviceStatusById[id] || self.deviceStatus
	}

	const feedbacks: Record<string, Feedback> = {
		// Power State Feedback (always available)
		powerState: {
			type: 'boolean',
			name: 'Power State',
			description: 'Indicates if the amplifier is powered on',
			defaultStyle: {
				bgcolor: combineRgb(0, 200, 0), // Green when on
				color: combineRgb(0, 0, 0),
			},
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
			callback: (feedback) => {
				const status = resolveStatus(feedback.options.device as string)
				return status.power === true
			},
		},

		// Device Fault Feedback
		deviceFault: {
			type: 'boolean',
			name: 'Device Fault',
			description: 'Indicates if the device reports a fault/error condition',
			defaultStyle: {
				bgcolor: combineRgb(200, 0, 0), // Red on fault
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					type: 'dropdown',
					id: 'device',
					label: 'Device',
					default: deviceChoices()[0]?.id,
					choices: deviceChoices(),
				},
			],
			callback: (feedback) => {
				const status = resolveStatus(feedback.options.device as string)
				const err = status.error
				return Boolean(err && err !== 'None')
			},
		},

		// Channel Mute Feedback (always available)
		channelMute: {
			type: 'boolean',
			name: 'Channel Mute State',
			description: 'Indicates if a specific channel is muted',
			defaultStyle: {
				bgcolor: combineRgb(200, 0, 0), // Red when muted
				color: combineRgb(255, 255, 255),
			},
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
			callback: (feedback) => {
				const channel = (feedback.options.channel as number) - 1 // Convert to 0-based index
				const status = resolveStatus(feedback.options.device as string)
				return status.channels[channel]?.mute === true
			},
		},
	}

	// Conditionally register optional feedbacks
	if (hasClip) {
		feedbacks.channelClip = {
			type: 'advanced',
			name: 'Channel Clipping',
			description: 'Indicates if a specific channel is clipping',
			defaultStyle: {
				bgcolor: combineRgb(255, 255, 0), // Yellow when clipping
				color: combineRgb(0, 0, 0),
			},
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
			callback: (feedback) => {
				const channel = (feedback.options.channel as number) - 1
				const status = resolveStatus(feedback.options.device as string)
				return status.channels[channel]?.clip === true
			},
		}
	}

	if (hasSignal) {
		feedbacks.channelSignal = {
			type: 'advanced',
			name: 'Channel Signal Present',
			description: 'Indicates if a signal is present on a specific channel',
			defaultStyle: {
				bgcolor: combineRgb(0, 200, 0), // Green when signal present
				color: combineRgb(0, 0, 0),
			},
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
			callback: (feedback) => {
				const channel = (feedback.options.channel as number) - 1
				const status = resolveStatus(feedback.options.device as string)
				return status.channels[channel]?.signalPresent === true
			},
		}
	}

	if (hasTemp) {
		feedbacks.channelTempWarning = {
			type: 'advanced',
			name: 'Channel Temperature Warning',
			description: 'Indicates if a channel temperature is above warning level',
			defaultStyle: {
				bgcolor: combineRgb(255, 165, 0), // Orange for warning
				color: combineRgb(0, 0, 0),
			},
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
					label: 'Warning Temperature (°C)',
					id: 'warningTemp',
					default: 70,
					min: 30,
					max: 100,
					required: true,
				},
			],
			callback: (feedback) => {
				const channel = (feedback.options.channel as number) - 1
				const warningTemp = parseFloat(feedback.options.warningTemp as string) || 70
				const status = resolveStatus(feedback.options.device as string)
				return (status.channels[channel]?.temp || 0) >= warningTemp
			},
		}

		feedbacks.channelTempCritical = {
			type: 'advanced',
			name: 'Channel Temperature Critical',
			description: 'Indicates if a channel temperature is above critical level',
			defaultStyle: {
				bgcolor: combineRgb(200, 0, 0), // Red for critical
				color: combineRgb(255, 255, 255),
			},
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
					label: 'Critical Temperature (°C)',
					id: 'criticalTemp',
					default: 85,
					min: 40,
					max: 120,
					required: true,
				},
			],
			callback: (feedback) => {
				const channel = (feedback.options.channel as number) - 1
				const criticalTemp = parseFloat(feedback.options.criticalTemp as string) || 85
				const status = resolveStatus(feedback.options.device as string)
				return (status.channels[channel]?.temp || 0) >= criticalTemp
			},
		}
	}

	if (hasImpedance) {
		feedbacks.channelImpedanceWarning = {
			type: 'advanced',
			name: 'Channel Impedance Warning',
			description: 'Indicates if a channel impedance is below warning level',
			defaultStyle: {
				bgcolor: combineRgb(255, 255, 0), // Yellow for warning
				color: combineRgb(0, 0, 0),
			},
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
					label: 'Warning Impedance (Ω)',
					id: 'warningImpedance',
					default: 4,
					min: 1,
					max: 32,
					step: 0.1,
					required: true,
				},
			],
			callback: (feedback) => {
				const channel = (feedback.options.channel as number) - 1
				const warningImpedance = parseFloat(feedback.options.warningImpedance as string) || 4
				const status = resolveStatus(feedback.options.device as string)
				return (status.channels[channel]?.loadImpedance || 0) < warningImpedance
			},
		}
	}

	// Set the feedback definitions
	// Expose which feedbacks are registered (for debug logs)
	;(self as any).supportedFeedbacks = Object.keys(feedbacks)
	self.setFeedbackDefinitions(feedbacks as any)

	// Note: The module should call checkFeedbacks() whenever the device status changes
	// This is typically done in the main module code when processing updates from the device
}
