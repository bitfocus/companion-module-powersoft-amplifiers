# Powersoft Amplifier API Documentation

This documentation provides a comprehensive reference for the Powersoft amplifier API, including:

- Command enums and their IDs (from the protobuf schema)
- All known parameter path IDs (for use in API requests)
- Example request formats

---

## 1. Command Enums and IDs

### DeviceManagement.Type

| Command Name  | ID  |
| ------------- | --- |
| SHUTDOWN      | 10  |
| REBOOT        | 20  |
| FACTORY_RESET | 30  |
| BLINK         | 40  |
| BLINK_OFF     | 41  |
| STANDBY_ON    | 50  |
| STANDBY_OFF   | 51  |

### SpecialAction.Type

| Command Name           | ID  |
| ---------------------- | --- |
| LOGIN                  | 10  |
| LOGOUT                 | 20  |
| COPY                   | 30  |
| PRESET_MANAGEMENT      | 50  |
| NETWORKING_MANAGEMENT  | 70  |
| NETWORK_STATUS         | 75  |
| DEVICE_MANAGEMENT      | 90  |
| LOCK_MANAGEMENT        | 200 |
| SET_TIME               | 300 |
| GET_LIVE_IMPEDANCE     | 400 |
| RESET_LIVE_IMPEDANCE   | 410 |
| GET_LIST_SP            | 500 |
| LOAD_SP                | 510 |
| REMOVE_SP              | 520 |
| COPY_SP                | 530 |
| LOCK_SP                | 540 |
| INFO_SP                | 550 |
| SET_BRIDGE_MODE        | 580 |
| GET_LIVE_BUFFERS       | 600 |
| GET_DISCOVERY          | 610 |
| RESET_LIVE             | 700 |
| ARM_PLAY               | 710 |
| GET_LIST_PLAY          | 711 |
| REMOVE_PLAY            | 712 |
| CALIBRATE_CURRENT      | 800 |
| READ_AUDINATE_INFO     | 810 |
| READ_AUDINATE_FIRMWARE | 811 |
| LOAD_AUDINATE_FIRMWARE | 812 |
| SET_AUDINATE           | 813 |

### Action.Type

| Command Name | ID  |
| ------------ | --- |
| READ         | 10  |
| READ_TMP     | 15  |
| WRITE        | 20  |
| WRITE_TMP    | 25  |

### Value.Type

| Type       | ID  |
| ---------- | --- |
| STRING     | 10  |
| FLOAT      | 20  |
| INT        | 30  |
| BOOL       | 40  |
| FLOATARRAY | 50  |
| UINT       | 60  |

---

## 2. Parameter Path IDs (AccessManagerKey)

These are used as the `"id"` field in API requests. Replace `{0}`, `{1}` with the appropriate channel/filter/index.

| Key                                          | Parameter Path (ID)                                                                                                          |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| DEVICE_CHANNELS                              | /Device/Config/Hardware/Channels                                                                                             |
| DEVICE_FIRMWARE_VERSION                      | /Device/Config/Software/Firmware/Version                                                                                     |
| DEVICE_NAME                                  | /Device/Config/Name                                                                                                          |
| DEVICE_SERIAL                                | /Device/Config/Hardware/Model/Serial                                                                                         |
| DEVICE_STANDBY                               | /Device/Audio/Presets/Live/Generals/Standby/Value                                                                            |
| GENERATOR_DURATION                           | /Device/Audio/Presets/Live/Extra/AuxSignalGenerator/Duration/Value                                                           |
| GENERATOR_ENABLE                             | /Device/Audio/Presets/Live/Extra/AuxSignalGenerator/Enable/Value                                                             |
| GENERATOR_FREQ                               | /Device/Audio/Presets/Live/Extra/AuxSignalGenerator/Frequency/Value                                                          |
| GENERATOR_FREQ_START                         | /Device/Audio/Presets/Live/Extra/AuxSignalGenerator/StartFreq/Value                                                          |
| GENERATOR_FREQ_STOP                          | /Device/Audio/Presets/Live/Extra/AuxSignalGenerator/StopFreq/Value                                                           |
| GENERATOR_SIGNAL_TYPE                        | /Device/Audio/Presets/Live/Extra/AuxSignalGenerator/Type/Value                                                               |
| GENERATOR_SIGNAL_LEVEL                       | /Device/Audio/Presets/Live/Extra/AuxSignalGenerator/Level/Value                                                              |
| INPUT_CHANNEL_AUXDELAY                       | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InDelay/Value                                                   |
| INPUT_CHANNEL_EQ                             | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Enable/Value                                            |
| INPUT_CHANNEL_EQ_POLARITY                    | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InPolarity/Value                                                |
| INPUT_CHANNEL_GAIN                           | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/Gain/Value                                                      |
| INPUT_CHANNEL_MANUAL_SOURCE_SELECTION        | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/Manual/Value                                    |
| INPUT_CHANNEL_MUTE                           | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/Mute/Value                                                      |
| INPUT_CHANNEL_SHADING                        | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/ShadingGain/Value                                               |
| INPUT_CHANNEL_SOURCE                         | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/Priority-{1}/Value                              |
| INPUT_CHANNEL_SOURCE_BACKUP_STRATEGY         | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/Enable/Value                                    |
| INPUT_CHANNEL_SOURCE_CARRIER_CHECK_PARAMS    | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/CarrierCheckParams/Enable/Value                 |
| INPUT_CHANNEL_SOURCE_ROUTING                 | /Device/Audio/Presets/Live/SourceSelection/RoutingChannel-{0}/Src-{1}/Value                                                  |
| INPUT_PILOT_TONE_CARRIER_CHECK               | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/PilotTone/Enable/Value                          |
| INPUT_PILOT_TONE_FREQUENCY                   | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/CarrierCheckParams/Freq/Value                   |
| INPUT_PILOT_TONE_THRESHOLD_AES3              | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/CarrierCheckParams/MinValAES3/Value             |
| INPUT_PILOT_TONE_THRESHOLD_ANALOG            | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/CarrierCheckParams/MinValAnalog/Value           |
| INPUT_PILOT_TONE_THRESHOLD_DANTE_A           | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/CarrierCheckParams/MinValNetStreamGroup0/Value  |
| INPUT_PILOT_TONE_THRESHOLD_DANTE_B           | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0}/CarrierCheckParams/MinValNetStreamGroup1/Value  |
| INPUT_EQ_FILTERS                             | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter                                                  |
| INPUT_EQ_FILTER_ENABLE                       | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Enable                                |
| INPUT_EQ_FILTER_TYPE                         | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Type/Value                            |
| INPUT_EQ_FILTER_FREQ1                        | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Freq1/Value                           |
| INPUT_EQ_FILTER_GAIN1                        | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Gain1/Value                           |
| INPUT_EQ_FILTER_SLOPE1                       | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Slope1/Value                          |
| INPUT_EQ_FILTER_FREQ2                        | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Freq2/Value                           |
| INPUT_EQ_FILTER_GAIN2                        | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Gain2/Value                           |
| INPUT_EQ_FILTER_SLOPE2                       | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Slope2/Value                          |
| INPUT_EQ_FILTER_FLAGS                        | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0}/InputEQ/Filter/Filter-{1}/Flags/Value                           |
| INPUT_PROCESS_GROUPS                         | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/                                                   |
| INPUT_PROCESS_GROUP_ENABLE                   | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/Enable                                   |
| INPUT_PROCESS_GROUP_MUTE_VALUE               | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/Mute/Value                               |
| INPUT_PROCESS_GROUP_GAIN_VALUE               | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/Gain/Value                               |
| INPUT_PROCESS_GROUP_DELAY_VALUE              | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/InDelay/Value                            |
| INPUT_PROCESS_GROUP_DELAY_ENABLE             | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0}/Groups/Group-{1}/InDelay/Enable                           |
| INPUT_SOURCE_AUX_INPUT_ENABLE                | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-0/AuxInput/Value                                    |
| LATENCY_COMPENSATION                         | /Device/Audio/Presets/Live/Generals/LatencyCompensation/Type                                                                 |
| MATRIX                                       | /Device/Audio/Presets/Live/InputMatrix/Channels                                                                              |
| MATRIX_INPUT_MUTE                            | /Device/Audio/Presets/Live/InputMatrix/InMute-{0}/Value                                                                      |
| MATRIX_INPUT_GAIN                            | /Device/Audio/Presets/Live/InputMatrix/InGain-{0}/Value                                                                      |
| MATRIX_GAIN                                  | /Device/Audio/Presets/Live/InputMatrix/Channels/Channel-{0}/Gain-{1}/Value                                                   |
| MATRIX_MUTE                                  | /Device/Audio/Presets/Live/InputMatrix/Channels/Channel-{0}/Mute-{1}/Value                                                   |
| NETWORK_ADDRESS                              | /Device/Config/Networking/Ethernet/Ip                                                                                        |
| NETWORK_DHCP_ENABLED                         | /Device/Config/Networking/Ethernet/Dhcp/Enable                                                                               |
| NETWORK_DHCP_FROM                            | /Device/Config/Networking/Wifi/Dhcp/From                                                                                     |
| NETWORK_DHCP_TO                              | /Device/Config/Networking/Wifi/Dhcp/To                                                                                       |
| NETWORK_DNS                                  | /Device/Config/Networking/Ethernet/Dns                                                                                       |
| NETWORK_GATEWAY                              | /Device/Config/Networking/Ethernet/Gateway                                                                                   |
| NETWORK_NETMASK                              | /Device/Config/Networking/Ethernet/Netmask                                                                                   |
| NETWORK_WIFI_ESSID                           | /Device/Config/Networking/Wifi/Ssid                                                                                          |
| NETWORK_WIFI_PASSWORD                        | /Device/Config/Networking/Wifi/Security/Passphrase                                                                           |
| NETWORK_WIFI_SECURITY                        | /Device/Config/Networking/Wifi/Security/Type                                                                                 |
| NETWORK_WIFI_BAND                            | /Device/Config/Networking/Wifi/Mode                                                                                          |
| NETWORK_WIFI_CHANNEL                         | /Device/Config/Networking/Wifi/Channel                                                                                       |
| NETWORK_WIFI_REGION                          | /Device/Config/Networking/Wifi/Country                                                                                       |
| OUTPUT_CHANNEL_ALARM                         | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputImpedanceMeasure/Enable          |
| OUTPUT_CHANNEL_EQ                            | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/IIR                                                            |
| OUTPUT_CHANNEL_FEEDLOOP                      | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Feedloop                                                       |
| OUTPUT_CHANNEL_FEEDLOOP_ENABLED              | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Feedloop/Enable                                                |
| OUTPUT_CHANNEL_FEEDLOOP_VALUE                | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Feedloop/Value                                                 |
| OUTPUT_CHANNEL_FREQUENCY                     | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputImpedanceMeasure/Frequency/Value |
| OUTPUT_CHANNEL_GAIN                          | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Gain/Value                                                     |
| OUTPUT_CHANNEL_MAX_TH                        | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputImpedanceMeasure/MaxLevel/Value  |
| OUTPUT_CHANNEL_MIN_TH                        | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputImpedanceMeasure/MinLevel/Value  |
| OUTPUT_CHANNEL_MUTE                          | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Mute/Value                                                     |
| OUTPUT_CHANNEL_NAME                          | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Name                                                           |
| OUTPUT_CHANNEL_PEAK_LIMITER                  | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/PeakLimiter/Threshold/Value                                    |
| OUTPUT_CHANNEL_BRIDGE                        | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0}/Bridge/Value                                                   |
| OUTPUT_SPEAKER_GENERATOR_ENABLE              | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/ToneGenerator/Enable/Value             |
| OUTPUT_SPEAKER_GENERATOR_FREQUENCY           | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/ToneGenerator/Frequency/Value          |
| OUTPUT_SPEAKER_GENERATOR_VOLTAGE             | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/ToneGenerator/Level/Value              |
| OUTPUT_SPEAKER_IMPEDANCE_DETECTION_ENABLE    | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputImpedanceMeasure/Enable/Value    |
| OUTPUT_SPEAKER_IMPEDANCE_DETECTION_FREQUENCY | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputImpedanceMeasure/Frequency/Value |
| OUTPUT_SPEAKER_IMPEDANCE_DETECTION_MAX_V     | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputImpedanceMeasure/MaxLevel/Value  |
| OUTPUT_SPEAKER_IMPEDANCE_DETECTION_MIN_V     | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputImpedanceMeasure/MinLevel/Value  |
| OUTPUT_SPEAKER_TONE_DETECTION_ENABLE         | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputToneDetection/Enable/Value       |
| OUTPUT_SPEAKER_TONE_DETECTION_FREQUENCY      | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputToneDetection/Frequency/Value    |
| OUTPUT_SPEAKER_TONE_DETECTION_MAX_TH         | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputToneDetection/MaxLevel/Value     |
| OUTPUT_SPEAKER_TONE_DETECTION_MIN_TH         | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0}/AuxLineDiagnostic/OutputToneDetection/MinLevel/Value     |
| LIVE_CURRENT_SNAPSHOT_ID                     | /Device/Audio/Presets/Live/ReadOnly/SnapshotSlotId/Current                                                                   |
| LIVE_SNAPSHOT_MODIFIED                       | /Device/Audio/Presets/Live/ReadOnly/SnapshotSlotId/Modified                                                                  |
| INPUT_MATRIX_EXTRA_CONTROL                   | /Device/Audio/Presets/Live/InputMatrix/Generals/ExtraControl/Enable/Value                                                    |
| SPEAKER_GROUPS_8                             | /Device/Audio/Presets/Live/SpeakerLayout/Connections                                                                         |
| SPEAKER_GROUPS_4                             | /Device/Audio/Presets/Live/SpeakerLayout/Connections                                                                         |
| SPEAKER_GROUPS_2                             | /Device/Audio/Presets/Live/SpeakerLayout/Connections                                                                         |
| SPEAKER_NAME                                 | /Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0}/ModelName                                                               |

---

## 3. Example API Request

### Standby Example (JSON)

```json
{
	"version": "1.0.0",
	"clientId": "x8-panel",
	"payload": {
		"type": 100, // ACTION
		"action": {
			"type": 20, // WRITE
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/Generals/Standby/Value",
					"data": {
						"type": 40, // BOOL
						"boolValue": true
					}
				}
			]
		}
	},
	"tag": 1,
	"updateId": 1
}
```

---

## 4. Notes

- Use the correct enum IDs for each command/action/value type.
- Parameter paths must match those in AccessManagerKey, with placeholders replaced as needed.
- For multi-device control, send the same request to each amplifier's IP.

---

For a full list of parameter paths, see the AccessManagerKey object in your app.js or request the full expanded table.
