import type { ModuleConfig } from './config.js'

export function listDevices(config: ModuleConfig): string[] {
	const raw = (config.devicesCsv || '').trim()
	if (!raw) return config.host ? [config.host] : []
	const parts = raw
		.split(/[,\n\r\t; ]+/)
		.map((s) => s.trim())
		.filter((s) => s.length > 0)
	return parts.length > 0 ? parts : config.host ? [config.host] : []
}

export function sanitizeDeviceId(ipOrName: string): string {
	// Companion variableIds should be alphanumeric/underscore. Replace others with '_'
	return ipOrName.replace(/[^A-Za-z0-9_]/g, '_')
}
