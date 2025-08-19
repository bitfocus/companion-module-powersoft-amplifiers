import { combineRgb, type CompanionPresetDefinitions } from '@companion-module/base'
import type { ModuleInstance } from './main.js'
import { listDevices } from './devices.js'

export function UpdatePresets(self: ModuleInstance): CompanionPresetDefinitions {
	const maxChannels = self.config?.maxChannels || 8
	const defaultDevice = listDevices(self.config)[0] || self.config.host || ''

	// Helper function to create channel-specific presets
	const createChannelPresets = (channel: number) => {
		const channelName = `CH${channel}`

		return {
			// Mute Toggle
			[`mute_toggle_ch${channel}`]: {
				type: 'button',
				category: `${channelName} Mute`,
				name: `${channelName} Mute Toggle`,
				style: {
					text: `${channelName}\\nUNMUTED`,
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 120, 0), // Green when unmuted
				},
				steps: [
					{
						down: [
							{
								actionId: 'toggleMuteChannel',
								options: {
									device: defaultDevice,
									channel: channel,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'channelMute',
						options: {
							device: defaultDevice,
							channel: channel,
						},
						style: {
							text: `${channelName}\\nMUTED`,
							bgcolor: combineRgb(200, 0, 0), // Red when muted
							color: combineRgb(255, 255, 255),
						},
					},
				],
			},

			// Gain Control (relative)
			[`gain_up_ch${channel}`]: {
				type: 'button',
				category: `${channelName} Gain`,
				name: `${channelName} Gain +1 dB`,
				style: {
					text: `${channelName}\\nGAIN ▲ +1dB`,
					size: 'auto',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(200, 200, 200),
				},
				steps: [
					{
						down: [
							{
								actionId: 'adjustChannelGain',
								options: {
									device: defaultDevice,
									channel: channel,
									adjustment: 1,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			},

			[`gain_down_ch${channel}`]: {
				type: 'button',
				category: `${channelName} Gain`,
				name: `${channelName} Gain -1 dB`,
				style: {
					text: `${channelName}\\nGAIN ▼ -1dB`,
					size: 'auto',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(200, 200, 200),
				},
				steps: [
					{
						down: [
							{
								actionId: 'adjustChannelGain',
								options: {
									device: defaultDevice,
									channel: channel,
									adjustment: -1,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			},

			// Clip Indicator
			[`clip_indicator_ch${channel}`]: {
				type: 'button',
				category: `${channelName} Status`,
				name: `${channelName} Clip Indicator`,
				style: {
					text: `${channelName}\\nCLIP`,
					size: 'auto',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(200, 200, 200),
				},
				steps: [],
				feedbacks: [
					{
						feedbackId: 'channelClip',
						options: {
							device: defaultDevice,
							channel: channel,
						},
						style: {
							bgcolor: combineRgb(255, 255, 0), // Yellow when clipping
							color: combineRgb(0, 0, 0),
						},
					},
				],
			},
		}
	}

	// Create presets for each channel
	const channelPresets = {}
	for (let i = 1; i <= maxChannels; i++) {
		Object.assign(channelPresets, createChannelPresets(i))
	}

	// Global presets
	const globalPresets: CompanionPresetDefinitions = {
		// Power Control (device-level)
		power_on: {
			type: 'button',
			category: 'Power',
			name: 'Power On',
			style: {
				text: 'POWER\\nON',
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 100, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'powerOn',
							options: {
								device: defaultDevice,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'powerState',
					options: { device: defaultDevice },
					style: {
						bgcolor: combineRgb(0, 200, 0), // Green when on
						color: combineRgb(255, 255, 255),
					},
				},
			],
		},
		power_off: {
			type: 'button',
			category: 'Power',
			name: 'Power OFF',
			style: {
				text: 'POWER\\nOFF',
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(120, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'powerOff',
							options: {
								device: defaultDevice,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		power_toggle: {
			type: 'button',
			category: 'Power',
			name: 'Power TOGGLE',
			style: {
				text: 'POWER\nTOGGLE',
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(60, 60, 60),
			},
			steps: [
				{
					down: [
						{
							actionId: 'togglePower',
							options: {
								device: defaultDevice,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},

		// Reset Protection
		reset_protection: {
			type: 'button',
			category: 'Maintenance',
			name: 'Reset Protection',
			style: {
				text: 'RESET\\nPROTECTION',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(128, 0, 0), // Dark red
			},
			steps: [
				{
					down: [
						{
							actionId: 'resetProtection',
							options: {
								device: defaultDevice,
								channel: 0, // 0 means all channels
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},

		// Reset Peak Hold
		reset_peak_hold: {
			type: 'button',
			category: 'Maintenance',
			name: 'Reset Peak Hold',
			style: {
				text: 'RESET\\nPEAK HOLD',
				size: '14',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(200, 200, 200), // Light gray
			},
			steps: [
				{
					down: [
						{
							actionId: 'resetPeakHold',
							options: {
								device: defaultDevice,
								channel: 0, // 0 means all channels
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},

		// Mute/Unmute all channels (per device)
		mute_all_channels: {
			type: 'button',
			category: 'Mute',
			name: 'Mute All Channels',
			style: {
				text: 'MUTE\nALL',
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(120, 0, 0),
			},
			steps: [
				{
					down: [
						// One mute action per channel targeting default device
						...Array.from({ length: maxChannels }, (_, i) => ({
							actionId: 'muteChannel' as const,
							options: {
								device: defaultDevice,
								channel: i + 1,
							},
						})),
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		unmute_all_channels: {
			type: 'button',
			category: 'Mute',
			name: 'Unmute All Channels',
			style: {
				text: 'UNMUTE\nALL',
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 120, 0),
			},
			steps: [
				{
					down: [
						...Array.from({ length: maxChannels }, (_, i) => ({
							actionId: 'unmuteChannel' as const,
							options: {
								device: defaultDevice,
								channel: i + 1,
							},
						})),
					],
					up: [],
				},
			],
			feedbacks: [],
		},
	}

	// Combine all presets
	const presets: CompanionPresetDefinitions = {
		...globalPresets,
		...channelPresets,
	}

	return presets
}
