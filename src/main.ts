// Minimal Bitfocus Companion module entrypoint for Powersoft
import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions, UpdateVariables } from './variables.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { UpdatePresets } from './presets.js'
import { UpgradeScripts } from './upgrades.js'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig
	pollingInterval: NodeJS.Timeout | null = null
	variableUpdateInterval: NodeJS.Timeout | null = null
	deviceStatus: any = { channels: [] }
	deviceStatusById: Record<string, any> = {}
	debugTick = 0
	powerPath?: string
	powerPathMap: Record<string, string> = {}
	udpInterval: NodeJS.Timeout | null = null
	// Per-device error handling/backoff
	errorCountById: Record<string, number> = {}
	backoffUntilById: Record<string, number> = {}

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config
		this.clearIntervals()
		this.updateStatus(InstanceStatus.Ok)
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()
		// Seed state immediately so feedbacks/variables reflect current device state ASAP
		await this.pollDeviceStatus()
		UpdateVariables(this)
		this.checkFeedbacks()
		this.startPolling()
	}

	async destroy(): Promise<void> {
		this.clearIntervals()
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.clearIntervals()
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		this.updatePresets()
		await this.pollDeviceStatus()
		UpdateVariables(this)
		this.checkFeedbacks()
		this.startPolling()
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	// --- Device communication is now handled via API helpers; this is deprecated ---
	// sendCommand is deprecated and should not be used for new logic.
	sendCommand(_command: string, _params?: unknown): void {
		this.log('warn', 'sendCommand is deprecated. Use API helpers and HTTP requests instead.')
	}

	updatePresets(): void {
		const presets = UpdatePresets(this)
		this.setPresetDefinitions(presets as any)
	}

	clearIntervals(): void {
		if (this.pollingInterval) clearInterval(this.pollingInterval)
		if (this.variableUpdateInterval) clearInterval(this.variableUpdateInterval)
		if (this.udpInterval) clearInterval(this.udpInterval)
		this.pollingInterval = null
		this.variableUpdateInterval = null
		this.udpInterval = null
	}

	startPolling(): void {
		this.clearIntervals()
		this.debugTick = 0
		// Kick off an immediate poll rather than waiting for the first interval tick
		void this.pollDeviceStatus()
		if (this.config.enableUdpFeedback) {
			void this.pollUdpStatus()
			this.udpInterval = setInterval(() => {
				void this.pollUdpStatus()
			}, this.config.udpPollInterval ?? 1000)
		}
		this.pollingInterval = setInterval(() => {
			void this.pollDeviceStatus()
		}, this.config.pollingInterval ?? 1000)
		this.variableUpdateInterval = setInterval(() => {
			UpdateVariables(this)
			this.checkFeedbacks()
			// Lightweight periodic debug trace to confirm regular updates
			this.debugTick++
			if (this.debugTick % 5 === 0) {
				const ch1 = this.deviceStatus.channels?.[0] || {}
				const supported = (this as any).supportedFeedbacks || []
				this.log(
					'debug',
					`feedbacks-check tick=${this.debugTick} power=${this.deviceStatus.power ? 'on' : 'off'} ` +
						`ch1[mute=${ch1.mute ? '1' : '0'}, gain=${typeof ch1.gain === 'number' ? ch1.gain.toFixed(1) : 'n/a'}] ` +
						`registeredFeedbacks=${Array.isArray(supported) ? supported.join(',') : 'n/a'}`,
				)
			}
		}, this.config.pollingInterval ?? 1000)
	}

	/**
	 * Poll device status using the new API helpers and enums
	 */
	async pollDeviceStatus(): Promise<void> {
		// Import here to avoid circular dependency issues
		const { buildAgileRequest, parseReadResponse, getPreferredValueTypeForPath } = await import('./api.js')
		const { ParameterPaths } = await import('./parameterPaths.js')
		const { ActionType, ValueType } = await import('./enums.js')
		const { listDevices, sanitizeDeviceId } = await import('./devices.js')
		const { default: got } = await import('got')

		const deviceIps = listDevices(this.config)
		const defaultHost = this.config.host

		// Helper to perform a single read
		const readValue = async (url: string, path: string, valueType: number) => {
			const payload = buildAgileRequest({ actionType: ActionType.READ, valueType, path })
			const res = await got.post(url, {
				json: payload,
				responseType: 'json',
				timeout: { request: Math.max(2000, this.config.pollingInterval) },
				https: { rejectUnauthorized: false },
			})
			return parseReadResponse(res.body, valueType as any)
		}

		// Diagnostic helper for standby to capture raw response using preferred and fallback types
		const readValueWithDebug = async (url: string, path: string) => {
			const preferred = getPreferredValueTypeForPath(path, ValueType.STRING)
			const tryTypes: number[] = [
				preferred,
				ValueType.BOOL,
				ValueType.INT,
				ValueType.UINT,
				ValueType.STRING,
				ValueType.FLOAT,
			]
			const tried = new Set<number>()
			for (const t of tryTypes) {
				if (tried.has(t)) continue
				tried.add(t)
				try {
					const val = await readValue(url, path, t)
					this.log('debug', `standby-read path=${path} as ${ValueType[t] ?? t} -> ${String(val)}`)
					if (val !== undefined) return { raw: val, valueType: (ValueType[t] ?? String(t)) as any }
				} catch (e: any) {
					this.log('debug', `standby-read ${ValueType[t] ?? t} error: ${e?.message || e}`)
				}
			}
			return { raw: undefined, valueType: 'ERROR' as const }
		}

		// Discover a valid power/standby path once and cache
		const discoverPowerPath = async (url: string): Promise<string | undefined> => {
			const candidates = [
				ParameterPaths.DEVICE_STANDBY,
				'/Device/Audio/Presets/Live/Generals/Standby/Enable',
				'/Device/Audio/Presets/Live/Generals/Standby',
				'/Device/ReadOnly/Power/Standby',
				'/Device/ReadOnly/Power/State',
				'/Device/Config/Power/Standby/Value',
				'/Device/Config/Hardware/Power/Standby/Value',
				'/Device/Power/Standby/Value',
			]
			for (const p of candidates) {
				try {
					const res = await readValueWithDebug(url, p)
					if (res.raw !== undefined) {
						this.log('debug', `power-path-discovery: using path ${p}`)
						return p
					}
				} catch {
					// ignore and continue
				}
			}
			this.log('debug', 'power-path-discovery: no candidate returned a value')
			return undefined
		}

		try {
			const delay = async (ms: number) => new Promise<void>((res) => setTimeout(res, ms))
			const chCount = this.config.maxChannels ?? 8
			const hosts = deviceIps.length > 0 ? deviceIps : defaultHost ? [defaultHost] : []
			const staggerMs = 150
			let firstId: string | undefined

			const tasks = hosts.map(async (host, idx) => {
				await delay(idx * staggerMs)
				const scheme = this.config.useHttps ? 'https' : 'http'
				const portPart = this.config.port ? `:${this.config.port}` : ''
				const url = `${scheme}://${host}${portPart}/am`
				const id = sanitizeDeviceId(host)
				if (!firstId) firstId = id

				// backoff check
				const until = this.backoffUntilById[id] || 0
				if (Date.now() < until) {
					this.log('debug', `poll-skip[${id}] in backoff for ${Math.max(0, until - Date.now())}ms`)
					return
				}

				try {
					// Ensure structure
					if (!this.deviceStatusById[id]) this.deviceStatusById[id] = { channels: [] }
					if (!Array.isArray(this.deviceStatusById[id].channels)) this.deviceStatusById[id].channels = []
					for (let i = 0; i < chCount; i++) {
						if (!this.deviceStatusById[id].channels[i]) {
							this.deviceStatusById[id].channels[i] = {}
						}
					}

					// Determine power path per device (override -> cached -> discovery)
					let powerPath: string | undefined = this.powerPathMap[id]
					if (!powerPath) {
						const override = (this.config as any).powerPath
						if (override && typeof override === 'string' && override.trim().length > 0) {
							const probe = await readValueWithDebug(url, override.trim())
							if (probe.raw !== undefined) {
								this.log('debug', `power-path-override[${id}]: using configured path ${override.trim()}`)
								powerPath = override.trim()
							} else {
								this.log(
									'debug',
									`power-path-override[${id}]: configured path returned undefined, falling back to discovery`,
								)
							}
						}
						if (!powerPath) powerPath = await discoverPowerPath(url)
						if (powerPath) this.powerPathMap[id] = powerPath
					}

					const standbyDiag = powerPath
						? await readValueWithDebug(url, powerPath)
						: { raw: undefined as any, valueType: 'ERROR' as const }

					const [firmware, model, ipAddr] = await Promise.all([
						readValue(url, ParameterPaths.DEVICE_FIRMWARE_VERSION, ValueType.STRING),
						readValue(url, ParameterPaths.DEVICE_NAME, ValueType.STRING),
						readValue(url, ParameterPaths.NETWORK_ADDRESS, ValueType.STRING),
					])
					// Normalize standby to boolean and compute power
					const normalizeBool = (v: any): boolean | undefined => {
						if (typeof v === 'boolean') return v
						if (typeof v === 'number') return v !== 0
						if (typeof v === 'string') {
							const s = v.trim().toLowerCase()
							if (s === 'true' || s === '1') return true
							if (s === 'false' || s === '0') return false
						}
						return undefined
					}
					const standby = normalizeBool(standbyDiag.raw)
					const computedPowerOn = standby === undefined ? this.deviceStatusById[id].power === true : standby === false
					this.log(
						'debug',
						`power-eval[${id}] standbyRaw=${String(standbyDiag.raw)} standbyNorm=${String(standby)} -> power=${computedPowerOn ? 'on' : 'off'}`,
					)
					this.deviceStatusById[id].power = computedPowerOn
					this.deviceStatusById[id].firmware = firmware || 'Unknown'
					this.deviceStatusById[id].model = model || 'Unknown'
					this.deviceStatusById[id].ip = ipAddr || host

					// Channel-level reads (mute/gain)
					if (!this.config.enableUdpFeedback) {
						for (let ch = 0; ch < chCount; ch++) {
							const mutePath = ParameterPaths.INPUT_CHANNEL_MUTE.replace('{0}', String(ch))
							const gainPath = ParameterPaths.INPUT_CHANNEL_GAIN.replace('{0}', String(ch))
							try {
								const [mute, gain] = await Promise.all([
									readValue(url, mutePath, ValueType.BOOL),
									readValue(url, gainPath, ValueType.FLOAT),
								])
								this.deviceStatusById[id].channels[ch].mute = Boolean(mute)
								this.deviceStatusById[id].channels[ch].gain = typeof gain === 'number' ? gain : undefined
							} catch (chErr: any) {
								this.log('debug', `Channel ${ch + 1} poll failed[${id}]: ${chErr?.message || chErr}`)
							}
						}
					}

					if (standby === undefined) {
						const anyChannelKnown = this.deviceStatusById[id].channels.some(
							(c: any) => typeof c.mute === 'boolean' || typeof c.gain === 'number',
						)
						if (anyChannelKnown) {
							this.log('debug', `power-eval heuristic[${id}]: inferring power=on from successful channel reads`)
							this.deviceStatusById[id].power = true
						}
					}

					// success -> reset error/backoff
					this.errorCountById[id] = 0
					this.backoffUntilById[id] = 0
				} catch (perHostErr: any) {
					// failure -> increment error/backoff for this device only
					const prev = this.errorCountById[id] || 0
					const next = prev + 1
					this.errorCountById[id] = next
					const backoff = Math.min(30000, 1000 * Math.pow(2, Math.min(5, next - 1)))
					this.backoffUntilById[id] = Date.now() + backoff
					this.log(
						'debug',
						`poll-error[${id}] count=${next} backoffMs=${backoff} err=${perHostErr?.message || perHostErr}`,
					)
				}
			})

			await Promise.all(tasks)

			// Maintain legacy single-device mirror for first configured device
			if (firstId) this.deviceStatus = this.deviceStatusById[firstId]

			this.updateStatus(InstanceStatus.Ok)
		} catch (err: any) {
			this.log('error', `Polling error: ${err.message || String(err)}`)
			this.updateStatus(InstanceStatus.UnknownError, err.message || String(err))
		}
	}

	/**
	 * Poll device status via UDP second API (read-only feedbacks)
	 */
	async pollUdpStatus(): Promise<void> {
		try {
			const { readUdpStatus } = await import('./udp.js')
			const maxCh = this.config.maxChannels ?? 8
			// Ensure array shape
			if (!Array.isArray(this.deviceStatus.channels)) this.deviceStatus.channels = []
			for (let i = 0; i < maxCh; i++) if (!this.deviceStatus.channels[i]) this.deviceStatus.channels[i] = {}

			const status = await readUdpStatus(
				{
					host: this.config.host,
					devicePort: this.config.udpPort ?? 1234,
					answerPortZero: this.config.udpAnswerPortZero ?? false,
					timeoutMs: Math.max(500, Math.min(2000, this.config.udpPollInterval ?? 1000)),
				},
				maxCh,
			)

			if (typeof status.power === 'boolean') this.deviceStatus.power = status.power
			if (typeof status.fault === 'boolean') this.deviceStatus.error = status.fault ? 'Fault' : 'None'
			for (let i = 0; i < Math.min(status.channels.length, maxCh); i++) {
				const ch = status.channels[i]
				if (ch) {
					if (typeof ch.mute === 'boolean') this.deviceStatus.channels[i].mute = ch.mute
					if (typeof ch.gain === 'number') this.deviceStatus.channels[i].gain = ch.gain
				}
			}

			// Keep Instance status Ok if UDP succeeded
			this.updateStatus(InstanceStatus.Ok)

			// Immediately reflect updates in variables and feedbacks
			UpdateVariables(this)
			this.checkFeedbacks()
		} catch (e: any) {
			// Do not downgrade module status on UDP errors; just log
			this.log('debug', `UDP poll error: ${e?.message || e}`)
		}
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
