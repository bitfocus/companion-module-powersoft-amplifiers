// Powersoft API request/response helpers
// This file defines the structure of HTTP requests and responses for the Powersoft amplifier module.
// All request/response types and helpers should be based on the official documentation in the docs/ folder.
import { ParameterPaths } from './parameterPaths.js'
import { ActionType, ValueType } from './enums.js'
import { PathTypeMap } from './generated/pathTypeMap.js'

export interface PowersoftApiRequest {
	path: string // e.g. '/Config/Name'
	method: 'GET' | 'POST'
	body?: any
	params?: Record<string, string | number>
}

export interface PowersoftApiResponse {
	status: number
	data: any
	error?: string
}

// Build a Powersoft API action request payload (clientId is always 'x8-panel')
export function buildPowersoftActionRequest({
	payloadType = 100, // 100 = ACTION
	actionType = 20, // 20 = WRITE
	values = [], // Array of value objects
	tag = 1,
	updateId = 1,
}: {
	payloadType?: number
	actionType?: number
	values: Array<any>
	tag?: number
	updateId?: number
}): any {
	// version is always '1.0.0', clientId is always 'x8-panel'
	return {
		version: '1.0.0',
		clientId: 'x8-panel',
		payload: {
			type: payloadType,
			action: {
				type: actionType,
				values: values,
			},
		},
		tag,
		updateId,
	}
}

// Example: Parse a Powersoft API response and extract useful data
export function parsePowersoftResponse(response: unknown): PowersoftApiResponse {
	// This should be adapted to the actual API response structure
	if (typeof response === 'object' && response !== null) {
		const typedResponse = response as any
		return {
			status: typedResponse.status ?? 200,
			data: typedResponse.data ?? response,
			error: typedResponse.error || undefined,
		}
	} else {
		return {
			status: 500,
			data: null,
			error: 'Invalid response format',
		}
	}
}

/**
 * Agile helper to build a Powersoft WRITE request for any supported parameter path and value type.
 * Type codes: 10=STRING, 20=FLOAT, 30=INT, 40=BOOL
 * Usage:
 *   buildWriteRequest({ path: ParameterPaths.DEVICE_STANDBY, value: true, type: 40 })
 */
// Generic agile helper factory for any action/value type
export function buildAgileRequest({
	actionType,
	valueType,
	path,
	value,
	tag = 1,
	updateId = 1,
}: {
	actionType: ActionType
	valueType: ValueType
	path: string
	value?: unknown // Omit for reads
	tag?: number
	updateId?: number
}): any {
	const data: Record<string, unknown> = { type: valueType }
	if (actionType === ActionType.WRITE || actionType === ActionType.WRITE_TMP) {
		if (valueType === ValueType.STRING) data.stringValue = value
		else if (valueType === ValueType.FLOAT) data.floatValue = value
		else if (valueType === ValueType.INT) data.intValue = value
		else if (valueType === ValueType.BOOL) data.boolValue = value
		else if (valueType === ValueType.FLOATARRAY) data.floatArrayValue = value
		else if (valueType === ValueType.UINT) data.uintValue = value
	}
	return buildPowersoftActionRequest({
		actionType,
		values: [{ id: path, data }],
		tag,
		updateId,
	})
}

// Example: Firmware version read
export const buildFirmwareVersionRead = (): any =>
	buildAgileRequest({
		actionType: ActionType.READ,
		valueType: ValueType.STRING,
		path: ParameterPaths.DEVICE_FIRMWARE_VERSION,
	})

// Example: Standby ON write
export const buildStandbyOn = (): any =>
	buildAgileRequest({
		actionType: ActionType.WRITE,
		valueType: ValueType.BOOL,
		path: ParameterPaths.DEVICE_STANDBY,
		value: true,
	})

/**
 * Agile helper to build a Powersoft READ request for any supported parameter path and value type.
 * Action.Type: 10 (READ)
 * Type codes: 10=STRING, 20=FLOAT, 30=INT, 40=BOOL, etc.
 * Usage:
 *   buildReadRequest({ path: ParameterPaths.DEVICE_FIRMWARE_VERSION, type: 10 })
 */

/**
 * Extracts the returned value from a Powersoft API read/query response.
 * Returns the value from the correct data field (e.g., stringValue, intValue, etc.).
 * Example:
 *   const value = parseReadResponse(response, 10); // type 10 = string
 */
export function parseReadResponse(response: unknown, valueType: ValueType): unknown {
	const data = (response as any)?.payload?.action?.values?.[0]?.data
	if (!data) return undefined
	switch (valueType) {
		case ValueType.STRING:
			return data.stringValue
		case ValueType.FLOAT:
			return data.floatValue
		case ValueType.INT:
			return data.intValue
		case ValueType.BOOL:
			return data.boolValue
		case ValueType.FLOATARRAY:
			return data.floatArrayValue
		case ValueType.UINT:
			return data.uintValue
		default:
			return undefined
	}
}

// TODO: Add more request/response helpers based on actual API endpoints and docs.
// For each documented endpoint, add a function to build the request and parse the response.

/**
 * Returns the preferred ValueType for a given path using the generated map.
 * If the path is unknown, returns the provided fallback or STRING.
 */
export function getPreferredValueTypeForPath(path: string, fallback: ValueType = ValueType.STRING): ValueType {
	// Exact match first
	const vtExact = PathTypeMap[path]
	if (vtExact !== undefined) return vtExact
	// Try template pattern match for indexed paths (replace {0}/{1} with digits)
	for (const [tpl, vt] of Object.entries(PathTypeMap)) {
		// Escape regex special chars except placeholders
		const escaped = tpl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		const pattern = '^' + escaped.replace(/\{0\}/g, '(\\d+)').replace(/\{1\}/g, '(\\d+)') + '$'
		const re = new RegExp(pattern)
		if (re.test(path)) return vt
	}
	return fallback
}

/**
 * Build a READ request using the preferred type from PathTypeMap.
 * Optionally override fallback type.
 */
export function buildReadRequestUsingMap(path: string, fallback: ValueType = ValueType.STRING): any {
	const valueType = getPreferredValueTypeForPath(path, fallback)
	return buildAgileRequest({ actionType: ActionType.READ, valueType, path })
}
