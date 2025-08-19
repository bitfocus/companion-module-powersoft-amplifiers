import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	// Top-level mode for clarity in UI
	mode?: 'single' | 'multi'
	host: string
	port: number
	username?: string
	password?: string
	useHttps: boolean
	pollingInterval: number
	maxChannels: number
	powerPath?: string
	// Multi-device support: comma/newline separated list of device IPs
	devicesCsv?: string
	// UDP (second API) options
	enableUdpFeedback?: boolean
	udpPort?: number
	udpPollInterval?: number
	udpAnswerPortZero?: boolean
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			label: 'Connection Information',
			width: 12,
			value:
				'Enter the connection details for your Powersoft amplifier. The polling interval determines how often the module will check for updates from the device.',
		},
		{
			type: 'dropdown',
			id: 'mode',
			label: 'Mode',
			width: 4,
			default: 'single',
			choices: [
				{ id: 'single', label: 'Single device' },
				{ id: 'multi', label: 'Multiple devices' },
			],
			tooltip: 'Choose whether this instance controls a single device or multiple devices.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Amplifier Hostname/IP',
			width: 8,
			regex: Regex.HOSTNAME,
			default: '192.168.100.170',
			required: true,
			isVisible: (config) => (config as any).mode !== 'multi',
		},
		{
			type: 'number',
			id: 'port',
			label: 'Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 80,
			required: true,
			isVisible: (config) => (config as any).mode !== 'multi',
		},
		{
			type: 'checkbox',
			id: 'useHttps',
			label: 'Use HTTPS',
			width: 4,
			default: false,
			// Hidden: not needed
			isVisible: () => false,
		},
		{
			type: 'textinput',
			id: 'username',
			label: 'Username (if required)',
			width: 6,
			default: '',
			required: false,
			// Hidden: not needed
			isVisible: () => false,
		},
		{
			type: 'textinput',
			id: 'password',
			label: 'Password',
			width: 6,
			default: '',
			required: false,
			// Hidden: not needed
			isVisible: () => false,
		},
		{
			type: 'number',
			id: 'pollingInterval',
			label: 'Polling Interval (ms)',
			width: 4,
			min: 100,
			max: 10000,
			default: 1000,
			required: true,
		},
		{
			type: 'textinput',
			id: 'devicesCsv',
			label: 'Devices IPs (comma or newline separated)',
			width: 12,
			default: '',
			required: false,
			tooltip:
				'Optional: List of device IPs for multi-device control in a single instance. Leave empty to use the single Host/Port above.',
			isVisible: (config) => (config as any).mode === 'multi',
		},
		{
			type: 'number',
			id: 'maxChannels',
			label: 'Maximum Number of Channels',
			width: 4,
			min: 1,
			max: 32,
			default: 8,
			required: true,
		},
		{
			type: 'number',
			id: 'decimalPlaces',
			label: 'Decimal Places',
			width: 4,
			min: 0,
			max: 3,
			default: 3,
			required: true,
		},
		{
			type: 'textinput',
			id: 'powerPath',
			label: 'Power/Standby Parameter Path (override)',
			width: 12,
			default: '',
			required: false,
			tooltip:
				'Optional: Specify the exact parameter path for power/standby if discovery fails. Example: /Device/ReadOnly/Power/State',
		},
		{
			type: 'checkbox',
			id: 'enableUdpFeedback',
			label: 'Enable UDP feedback polling (second API)',
			width: 6,
			default: false,
			tooltip:
				'When enabled, the module will read power/mutes/alarms via UDP port 1234. Writes continue to use HTTP API.',
		},
		{
			type: 'number',
			id: 'udpPort',
			label: 'UDP Device Port',
			width: 3,
			min: 1,
			max: 65535,
			default: 1234,
			isVisible: (config) => !!(config as any).enableUdpFeedback,
		},
		{
			type: 'number',
			id: 'udpPollInterval',
			label: 'UDP Poll Interval (ms)',
			width: 3,
			min: 200,
			max: 10000,
			default: 1000,
			isVisible: (config) => !!(config as any).enableUdpFeedback,
		},
		{
			type: 'checkbox',
			id: 'udpAnswerPortZero',
			label: 'Force answer_port=0',
			width: 6,
			default: false,
			tooltip: 'Some firmware answers only when answer_port=0 is used (observed in tests).',
			isVisible: (config) => !!(config as any).enableUdpFeedback,
		},
	]
}
