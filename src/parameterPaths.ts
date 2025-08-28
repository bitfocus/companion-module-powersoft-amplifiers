// Auto-generated from parameter_paths.csv
// Maps symbolic keys to Powersoft parameter paths
export const ParameterPaths = {
	DEVICE_CHANNELS: '/Device/Config/Hardware/Channels',
	DEVICE_FIRMWARE_VERSION: '/Device/Config/Software/Firmware/Version',
	DEVICE_NAME: '/Device/Config/Name',
	DEVICE_SERIAL: '/Device/Config/Hardware/Model/Serial',
	DEVICE_STANDBY: '/Device/Audio/Presets/Live/Generals/Standby/Value',
	// Generators (Aux signal)
	GENERATOR_DURATION: '/Device/Audio/Presets/Live/Extra/AuxSignalGenerator/Duration/Value',
	GENERATOR_ENABLE: '/Device/Audio/Presets/Live/Extra/AuxSignalGenerator/Enable/Value',
	GENERATOR_FREQ: '/Device/Audio/Presets/Live/Extra/AuxSignalGenerator/Frequency/Value',
	GENERATOR_FREQ_START: '/Device/Audio/Presets/Live/Extra/AuxSignalGenerator/StartFreq/Value',
	GENERATOR_FREQ_STOP: '/Device/Audio/Presets/Live/Extra/AuxSignalGenerator/StopFreq/Value',
	GENERATOR_SIGNAL_TYPE: '/Device/Audio/Presets/Live/Extra/AuxSignalGenerator/Type/Value',
	GENERATOR_SIGNAL_LEVEL: '/Device/Audio/Presets/Live/Extra/AuxSignalGenerator/Level/Value',

	// Generals - Signal Generator (device-wide)
	GENERALS_SIGNAL_GENERATOR_ENABLE_VALUE:
		'/Device/Audio/Presets/Live/Generals/SignalGenerator/Enable/Value',
	GENERALS_SIGNAL_GENERATOR_GAIN_VALUE:
		'/Device/Audio/Presets/Live/Generals/SignalGenerator/Gain/Value',
	// Aliases removed: canonical keys include _VALUE per corrected CSV

	// Alias to align with corrected CSV naming
	GENERALS_LATENCY_COMPENSATION_VALUE:
		'/Device/Audio/Presets/Live/Generals/LatencyCompensation/Value',
	// Additional Generals field from CSV
	GENERALS_LATENCY_COMPENSATION_TYPE:
		'/Device/Audio/Presets/Live/Generals/LatencyCompensation/Type',

	// Input Process - Channels
	INPUT_CHANNEL_AUXDELAY: '/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InDelay/Value',
	// Input EQ enable (canonical)
	INPUT_CHANNEL_EQ_ENABLE_VALUE:
		'/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Enable/Value',
	// InDelay Enable path (channel-level, canonical)
	INPUT_PROCESS_CHANNEL_INDELAY_ENABLE_VALUE:
		'/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InDelay/Enable/Value',
	// Input Process - Generals
	INPUT_PROCESS_MAXCURRENTDRAW_VALUE:
		'/Device/Audio/Presets/Live/InputProcess/Generals/MaxCurrentDraw/Value',

	INPUT_CHANNEL_EQ_POLARITY: '/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InPolarity/Value',
	INPUT_CHANNEL_GAIN: '/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/Gain/Value',
	INPUT_CHANNEL_MANUAL_SOURCE_SELECTION:
		'/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/Manual/Value',
	INPUT_CHANNEL_MUTE: '/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/Mute/Value',
	INPUT_CHANNEL_SHADING: '/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/ShadingGain/Value',
	INPUT_CHANNEL_SOURCE:
		'/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/Priority-{1}/Value',
	INPUT_CHANNEL_SOURCE_BACKUP_STRATEGY:
		'/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/Enable/Value',
	INPUT_CHANNEL_SOURCE_CARRIER_CHECK_PARAMS:
		'/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/CarrierCheckParams/Enable/Value',
	INPUT_CHANNEL_SOURCE_ROUTING: '/Device/Audio/Presets/Live/SourceSelection/RoutingChannel-{0}/Src-{1}/Value',
	INPUT_PILOT_TONE_CARRIER_CHECK:
		'/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/PilotTone/Enable/Value',
	INPUT_PILOT_TONE_FREQUENCY:
		'/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/CarrierCheckParams/Freq/Value',
	INPUT_PILOT_TONE_THRESHOLD_AES3:
		'/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/CarrierCheckParams/MinValAES3/Value',
	INPUT_PILOT_TONE_THRESHOLD_ANALOG:
		'/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/CarrierCheckParams/MinValAnalog/Value',
	INPUT_PILOT_TONE_THRESHOLD_DANTE_A:
		'/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/CarrierCheckParams/MinValNetStreamGroup0/Value',
	INPUT_PILOT_TONE_THRESHOLD_DANTE_B:
		'/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/CarrierCheckParams/MinValNetStreamGroup1/Value',
	INPUT_EQ_FILTERS: '/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter',
	INPUT_EQ_FILTER_ENABLE:
		'/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Enable',
	INPUT_EQ_FILTER_TYPE:
		'/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Type/Value',
	INPUT_EQ_FILTER_FREQ1:
		'/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Freq1/Value',
	INPUT_EQ_FILTER_GAIN1:
		'/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Gain1/Value',
	INPUT_EQ_FILTER_SLOPE1:
		'/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Slope1/Value',
	INPUT_EQ_FILTER_FREQ2:
		'/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Freq2/Value',
	INPUT_EQ_FILTER_GAIN2:
		'/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Gain2/Value',
	INPUT_EQ_FILTER_SLOPE2:
		'/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Slope2/Value',
	INPUT_EQ_FILTER_FLAGS:
		'/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Flags/Value',

	// Input Process - Groups (per channel) - use canonical EXTRA_* keys below
	// Aliases to align with corrected CSV naming for group subtree
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_ENABLE:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/Enable',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_GAIN_VALUE:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/Gain/Value',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_GUID:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/Guid',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_INDELAY_ENABLE:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/InDelay/Enable',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_INDELAY_VALUE:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/InDelay/Value',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_INPOLARITY_VALUE:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/InPolarity/Value',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_FILTER_ENABLE:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/InputEQ/Filter/Filter-{2}/Enable',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_FILTER_FREQ1_VALUE:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/InputEQ/Filter/Filter-{2}/Freq1/Value',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_FILTER_GAIN1_VALUE:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/InputEQ/Filter/Filter-{2}/Gain1/Value',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_FILTER_SLOPE1_VALUE:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/InputEQ/Filter/Filter-{2}/Slope1/Value',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_FILTER_TYPE_VALUE:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/InputEQ/Filter/Filter-{2}/Type/Value',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_MUTE_VALUE:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/Mute/Value',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_NAME:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/Name',
	INPUT_PROCESS_EXTRA_CHANNEL_GROUP_TYPE:
		'/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/Type',
	// Groups EQ legacy keys removed; use INPUT_PROCESS_EXTRA_CHANNEL_GROUP_FILTER_* keys
	// Source Selection
	INPUT_SOURCE_AUX_INPUT_ENABLE:
		'/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-0/AuxInput/Value',
	

	// Matrix
	MATRIX: '/Device/Audio/Presets/Live/InputMatrix/Channels',
	MATRIX_INPUT_MUTE: '/Device/Audio/Presets/Live/InputMatrix/InMute-{0}/Value',
	MATRIX_INPUT_GAIN: '/Device/Audio/Presets/Live/InputMatrix/InGain-{0}/Value',
	MATRIX_GAIN: '/Device/Audio/Presets/Live/InputMatrix/Channels/Channel-{0}/Gain-{1}/Value',
	MATRIX_MUTE: '/Device/Audio/Presets/Live/InputMatrix/Channels/Channel-{0}/Mute-{1}/Value',

	// Network
	NETWORK_ADDRESS: '/Device/Config/Networking/Ethernet/Ip',
	NETWORK_DHCP_ENABLED: '/Device/Config/Networking/Ethernet/Dhcp/Enable',
	NETWORK_DHCP_FROM: '/Device/Config/Networking/Wifi/Dhcp/From',
	NETWORK_DHCP_TO: '/Device/Config/Networking/Wifi/Dhcp/To',
	NETWORK_DNS: '/Device/Config/Networking/Ethernet/Dns',
	NETWORK_GATEWAY: '/Device/Config/Networking/Ethernet/Gateway',
	NETWORK_NETMASK: '/Device/Config/Networking/Ethernet/Netmask',

	// Networking - WiFi
	NETWORK_WIFI_CHANNEL: '/Device/Config/Networking/Wifi/Channel',
	NETWORK_WIFI_COUNTRY: '/Device/Config/Networking/Wifi/Country',
	NETWORK_WIFI_MODE: '/Device/Config/Networking/Wifi/Mode',
	NETWORK_WIFI_SECURITY_PASSPHRASE: '/Device/Config/Networking/Wifi/Security/Passphrase',
	NETWORK_WIFI_SECURITY_TYPE: '/Device/Config/Networking/Wifi/Security/Type',
	NETWORK_WIFI_SSID: '/Device/Config/Networking/Wifi/Ssid',

	INPUT_MATRIX_EXTRA_CONTROL: '/Device/Audio/Presets/Live/InputMatrix/Generals/ExtraControl/Enable/Value',
	// Alias (clearer): same path as INPUT_MATRIX_EXTRA_CONTROL
	INPUT_MATRIX_EXTRA_CONTROL_ENABLE_VALUE:
		'/Device/Audio/Presets/Live/InputMatrix/Generals/ExtraControl/Enable/Value',

	// Speaker Layout
	SPEAKER_CONNECTIONS: '/Device/Audio/Presets/Live/SpeakerLayout/Connections',
	SPEAKER_NAME: '/Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0}/ModelName',

	// Output Process - Extra (Aux controls)
	OUTPUT_EXTRA_CHANNEL_AUX_ATTENUATION_VALUE:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxAttenuation/Value',
	OUTPUT_EXTRA_CHANNEL_AUX_DELAY_ENABLE:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxDelay/Enable',
	OUTPUT_EXTRA_CHANNEL_AUX_DELAY_VALUE:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxDelay/Value',
	// Speaker item properties
	SPEAKER_PRESET_TYPE: '/Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0}/PresetType',
	SPEAKER_TYPE: '/Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0}/Type',
	SPEAKER_USER_NAME: '/Device/Audio/Presets/Live/SpeakerLayout/SpeakerName-{0}/Name',
	SPEAKER_OEM_FIELD_NAME: '/Device/Audio/Presets/Live/SpeakerLayout/SpeakerOemFields-{0}/Name',
	// Diagnostics - Output Speaker Aux Line
	// Output Channel limiters and protectors (aliases to align with corrected CSV)
	OUTPUT_CHANNEL_CLIP_LIMITER_ENABLE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/ClipLimiter/Enable',
	OUTPUT_CHANNEL_CLIP_LIMITER_ATTACKTIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/ClipLimiter/AttackTime/Value',
	OUTPUT_CHANNEL_CLIP_LIMITER_HOLDTIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/ClipLimiter/HoldTime/Value',
	OUTPUT_CHANNEL_CLIP_LIMITER_RELEASETIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/ClipLimiter/ReleaseTime/Value',
	OUTPUT_CHANNEL_CLIP_LIMITER_GAIN_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/ClipLimiter/Gain/Value',
	OUTPUT_CHANNEL_CLIP_LIMITER_THRESHOLD_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/ClipLimiter/Threshold/Value',

	OUTPUT_CHANNEL_CURRENT_CLAMP_ENABLE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/CurrentClamp/Enable',
	OUTPUT_CHANNEL_CURRENT_CLAMP_ATTACKTIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/CurrentClamp/AttackTime/Value',
	OUTPUT_CHANNEL_CURRENT_CLAMP_HOLDTIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/CurrentClamp/HoldTime/Value',
	OUTPUT_CHANNEL_CURRENT_CLAMP_RELEASETIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/CurrentClamp/ReleaseTime/Value',
	OUTPUT_CHANNEL_CURRENT_CLAMP_GAIN_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/CurrentClamp/Gain/Value',
	OUTPUT_CHANNEL_CURRENT_CLAMP_THRESHOLD_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/CurrentClamp/Threshold/Value',

	OUTPUT_CHANNEL_CURRENT_LIMITER_RMS_ENABLE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/CurrentLimiterRMS/Enable',
	OUTPUT_CHANNEL_CURRENT_LIMITER_RMS_ATTACKTIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/CurrentLimiterRMS/AttackTime/Value',
	OUTPUT_CHANNEL_CURRENT_LIMITER_RMS_HOLDTIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/CurrentLimiterRMS/HoldTime/Value',
	OUTPUT_CHANNEL_CURRENT_LIMITER_RMS_RELEASETIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/CurrentLimiterRMS/ReleaseTime/Value',
	OUTPUT_CHANNEL_CURRENT_LIMITER_RMS_GAIN_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/CurrentLimiterRMS/Gain/Value',
	OUTPUT_CHANNEL_CURRENT_LIMITER_RMS_THRESHOLD_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/CurrentLimiterRMS/Threshold/Value',

	// Peak limiter rich fields
	OUTPUT_CHANNEL_PEAK_LIMITER_ENABLE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/Enable',
	OUTPUT_CHANNEL_PEAK_LIMITER_ATTACKTIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/AttackTime/Value',
	OUTPUT_CHANNEL_PEAK_LIMITER_HOLDTIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/HoldTime/Value',
	OUTPUT_CHANNEL_PEAK_LIMITER_RELEASETIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/ReleaseTime/Value',
	OUTPUT_CHANNEL_PEAK_LIMITER_GAIN_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/Gain/Value',
	// Canonical alias for threshold (replacing legacy OUTPUT_CHANNEL_PEAK_LIMITER)
	OUTPUT_CHANNEL_PEAK_LIMITER_THRESHOLD_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/Threshold/Value',
	// PeakLimiter SoftKnee (additional fields found in CSV)
	OUTPUT_CHANNEL_PEAK_LIMITER_SOFTKNEE_ENABLE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/SoftKnee/Enable',
	OUTPUT_CHANNEL_PEAK_LIMITER_SOFTKNEE_THRESHOLD_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/SoftKnee/Threshold/Value',

	// PeakLimiter - IIR filters subtree (from CSV)
	OUTPUT_CHANNEL_PEAK_LIMITER_IIR_ENABLE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/IIR/IIR-{1}/Enable',
	OUTPUT_CHANNEL_PEAK_LIMITER_IIR_FC_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/IIR/IIR-{1}/Fc/Value',
	OUTPUT_CHANNEL_PEAK_LIMITER_IIR_GAIN_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/IIR/IIR-{1}/Gain/Value',
	OUTPUT_CHANNEL_PEAK_LIMITER_IIR_Q_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/IIR/IIR-{1}/Q/Value',
	OUTPUT_CHANNEL_PEAK_LIMITER_IIR_SLOPE_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/IIR/IIR-{1}/Slope/Value',
	OUTPUT_CHANNEL_PEAK_LIMITER_IIR_TYPE_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/IIR/IIR-{1}/Type/Value',

	// Output Process - Common channel controls (from CSV)
	OUTPUT_CHANNEL_BRIDGE_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Bridge/Value',
	OUTPUT_CHANNEL_OUT_DELAY_ENABLE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/OutDelay/Enable',
	OUTPUT_CHANNEL_OUT_DELAY_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/OutDelay/Value',
	OUTPUT_CHANNEL_OUT_POLARITY_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/OutPolarity/Value',
	OUTPUT_CHANNEL_GAIN_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Gain/Value',
	// Output Process - Channel name
	OUTPUT_CHANNEL_NAME:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Name',
	// Output Process - Feedloop
	OUTPUT_CHANNEL_FEEDLOOP:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Feedloop',
	OUTPUT_CHANNEL_FEEDLOOP_ENABLE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Feedloop/Enable',
	OUTPUT_CHANNEL_FEEDLOOP_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Feedloop/Value',
	// Output Process - PilotTone
	OUTPUT_CHANNEL_PILOT_TONE_ENABLE_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PilotTone/Enable/Value',
	OUTPUT_CHANNEL_PILOT_TONE_FREQ_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PilotTone/Freq/Value',
	OUTPUT_CHANNEL_PILOT_TONE_HIGH_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PilotTone/High/Value',
	OUTPUT_CHANNEL_PILOT_TONE_LOW_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PilotTone/Low/Value',
	// Output Process - PilotToneGenerator
	OUTPUT_CHANNEL_PILOT_TONE_GENERATOR_ENABLE_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PilotToneGenerator/Enable/Value',
	OUTPUT_CHANNEL_PILOT_TONE_GENERATOR_FREQ_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PilotToneGenerator/Freq/Value',
	OUTPUT_CHANNEL_PILOT_TONE_GENERATOR_AMPLITUDE_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PilotToneGenerator/Amplitude/Value',
	// Output Process - True Power Limiter
	OUTPUT_CHANNEL_TRUE_POWER_LIMITER_ENABLE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/TruePowerLimiter/Enable',
	OUTPUT_CHANNEL_TRUE_POWER_LIMITER_ATTACKTIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/TruePowerLimiter/AttackTime/Value',
	OUTPUT_CHANNEL_TRUE_POWER_LIMITER_GAIN_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/TruePowerLimiter/Gain/Value',

	// Output Process - Load Monitor (from CSV)
	OUTPUT_CHANNEL_LOAD_MONITOR_ENABLE_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/LoadMonitor/Enable/Value',
	OUTPUT_CHANNEL_LOAD_MONITOR_FREQ_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/LoadMonitor/Freq/Value',
	OUTPUT_CHANNEL_LOAD_MONITOR_HIGH_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/LoadMonitor/High/Value',
	OUTPUT_CHANNEL_LOAD_MONITOR_LOW_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/LoadMonitor/Low/Value',

	// Output Process - Nominal Impedance (from CSV)
	OUTPUT_CHANNEL_NOMINAL_IMPEDANCE_ENABLE_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/NominalImpedance/Enable/Value',
	OUTPUT_CHANNEL_NOMINAL_IMPEDANCE_HIGH_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/NominalImpedance/High/Value',
	OUTPUT_CHANNEL_NOMINAL_IMPEDANCE_LOW_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/NominalImpedance/Low/Value',

	// Output Process - IIR block (from CSV)
	OUTPUT_CHANNEL_IIR_ENABLE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/IIR/IIR-{1}/Enable',
	OUTPUT_CHANNEL_IIR_FC_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/IIR/IIR-{1}/Fc/Value',
	OUTPUT_CHANNEL_IIR_GAIN_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/IIR/IIR-{1}/Gain/Value',
	OUTPUT_CHANNEL_IIR_Q_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/IIR/IIR-{1}/Q/Value',
	OUTPUT_CHANNEL_IIR_SLOPE_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/IIR/IIR-{1}/Slope/Value',
	OUTPUT_CHANNEL_IIR_TYPE_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/IIR/IIR-{1}/Type/Value',

	// Output Process - DynamicEq (from CSV)
	OUTPUT_CHANNEL_DYNAMICEQ_ENABLE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/DynamicEq/DYNAMICEQ-{1}/Enable',
	OUTPUT_CHANNEL_DYNAMICEQ_ATTACKTIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/DynamicEq/DYNAMICEQ-{1}/AttackTime/Value',
	OUTPUT_CHANNEL_DYNAMICEQ_FC_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/DynamicEq/DYNAMICEQ-{1}/Fc/Value',
	OUTPUT_CHANNEL_DYNAMICEQ_FILTERTYPE_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/DynamicEq/DYNAMICEQ-{1}/FilterType/Value',
	OUTPUT_CHANNEL_DYNAMICEQ_LIMITERTYPE_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/DynamicEq/DYNAMICEQ-{1}/LimiterType/Value',
	OUTPUT_CHANNEL_DYNAMICEQ_MINGAIN_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/DynamicEq/DYNAMICEQ-{1}/MinGain/Value',
	OUTPUT_CHANNEL_DYNAMICEQ_POSITION_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/DynamicEq/DYNAMICEQ-{1}/Position/Value',
	OUTPUT_CHANNEL_DYNAMICEQ_Q_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/DynamicEq/DYNAMICEQ-{1}/Q/Value',
	OUTPUT_CHANNEL_DYNAMICEQ_RATIO_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/DynamicEq/DYNAMICEQ-{1}/Ratio/Value',
	OUTPUT_CHANNEL_DYNAMICEQ_RELEASETIME_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/DynamicEq/DYNAMICEQ-{1}/ReleaseTime/Value',
	OUTPUT_CHANNEL_DYNAMICEQ_SUBPOSITION_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/DynamicEq/DYNAMICEQ-{1}/Subposition/Value',
	OUTPUT_CHANNEL_DYNAMICEQ_THRESHOLD_VALUE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/DynamicEq/DYNAMICEQ-{1}/Threshold/Value',

	// Output Process - FIR (basic)
	OUTPUT_CHANNEL_FIR_ENABLE:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/FIR/Enable',
	OUTPUT_CHANNEL_FIR_NTAPS:
		'/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/FIR/nTaps',
	OUTPUT_SPEAKER_GENERATOR_ENABLE:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/ToneGenerator/Enable/Value',
	OUTPUT_SPEAKER_GENERATOR_FREQUENCY:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/ToneGenerator/Frequency/Value',
	OUTPUT_SPEAKER_GENERATOR_VOLTAGE:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/ToneGenerator/Level/Value',
	OUTPUT_SPEAKER_IMPEDANCE_DETECTION_ENABLE:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputImpedanceMeasure/Enable/Value',
	OUTPUT_SPEAKER_IMPEDANCE_DETECTION_FREQUENCY:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputImpedanceMeasure/Frequency/Value',
	OUTPUT_SPEAKER_IMPEDANCE_DETECTION_MAX_V:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputImpedanceMeasure/MaxLevel/Value',
	OUTPUT_SPEAKER_IMPEDANCE_DETECTION_MIN_V:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputImpedanceMeasure/MinLevel/Value',
	OUTPUT_SPEAKER_TONE_DETECTION_ENABLE:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputToneDetection/Enable/Value',
	OUTPUT_SPEAKER_TONE_DETECTION_FREQUENCY:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputToneDetection/Frequency/Value',
	OUTPUT_SPEAKER_TONE_DETECTION_MAX_TH:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputToneDetection/MaxLevel/Value',
	OUTPUT_SPEAKER_TONE_DETECTION_MIN_TH:
		'/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputToneDetection/MinLevel/Value',
}
