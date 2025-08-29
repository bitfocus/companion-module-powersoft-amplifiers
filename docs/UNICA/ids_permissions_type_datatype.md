# UNICA Protocol: IDs, Permissions, and Data Types

---

## Device Audio — Generals

### GPO Configuration

- Key: `/Device/Audio/Presets/Live/Generals/Gpo/Gpo-{0:6}/General/Value` (INT)
  - Default: -1
  - Min/Max: -1 / 5
  - Meaning:
    - -1 = Not configured
    - 0 = Alarm + standby
    - 1 = Standby
    - 2 = 5V
    - 3 = GND
    - 4 = Input pilot tone presence
    - 5 = Nominal impedance out of range
- Key: `/Device/Audio/Presets/Live/Generals/Gpo/Gpo-{0:6}/Type/Value` (INT)
  - Default: -1
  - Min/Max: -1 / 2147483647
  - Used only when General is 4 (Pilot tone presence) or 5 (Nominal impedance out of range). Value selects the channel to monitor.

READ example (GPO General)

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/Generals/Gpo/Gpo-0/General/Value", "single": true }]
		}
	}
}
```

WRITE example (GPO General = Standby)

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/Generals/Gpo/Gpo-0/General/Value",
					"data": { "type": "INT", "intValue": 1 }
				}
			]
		}
	}
}
```

### GPI Configuration

- Key: `/Device/Audio/Presets/Live/Generals/Gpi/Vca-{0:5}/Value` (INT)
  - Default: -1
  - Min/Max: -1 / 7
  - Assigns which GPI controls the speaker VCA (index refers to speaker/channel).
- Key: `/Device/Audio/Presets/Live/Generals/Gpi/Mute-{0:5}/Value` (INT)
  - Default: -1
  - Min/Max: -1 / 7
  - Assigns which GPI controls the speaker Mute.
- Key: `/Device/Audio/Presets/Live/Generals/Gpi/Standby/Value` (INT)
  - Default: -1
  - Min/Max: -1 / 7
  - Assigns which GPI controls device Standby.

WRITE example (GPI Mute-0 controlled by GPI 1)

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{ "id": "/Device/Audio/Presets/Live/Generals/Gpi/Mute-0/Value", "data": { "type": "INT", "intValue": 1 } }
			]
		}
	}
}
```

### Latency Compensation

- Key: `/Device/Audio/Presets/Live/Generals/LatencyCompensation/Type` (ENUM)
  - Default: 0
  - Notes: 1 aligns latency with K-Series; 2 = UserDefined (requires Value set).
- Key: `/Device/Audio/Presets/Live/Generals/LatencyCompensation/Value` (FLOAT)
  - Default: 0
  - Only used when Type = 2 (UserDefined)

WRITE example (set UserDefined latency 1.5)

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/Generals/LatencyCompensation/Type",
					"data": { "type": "INT", "intValue": 2 }
				},
				{
					"id": "/Device/Audio/Presets/Live/Generals/LatencyCompensation/Value",
					"data": { "type": "FLOAT", "floatValue": 1.5 }
				}
			]
		}
	}
}
```

### Signal Generator

- Key: `/Device/Audio/Presets/Live/Generals/SignalGenerator/Enable/Value` (BOOL)
  - Default: False
- Key: `/Device/Audio/Presets/Live/Generals/SignalGenerator/Gain/Value` (FLOAT)
  - Default: 0.000988553094656939
  - Min/Max: 0.000988553094656939 / 3.9810717055349722
  - Unit: Linear

WRITE example (Enable + set Gain)

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/Generals/SignalGenerator/Enable/Value",
					"data": { "type": "BOOL", "boolValue": true }
				},
				{
					"id": "/Device/Audio/Presets/Live/Generals/SignalGenerator/Gain/Value",
					"data": { "type": "FLOAT", "floatValue": 0.5 }
				}
			]
		}
	}
}
```

## Device Audio — Source Selection

### BackupStrategy

- Key: `/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/Enable/Value` (BOOL)
  - Default: True
- Key: `/.../BackupStrategy-{0:7}/Priority-{0:3}/Value` (INT)
  - Default: 0, Min/Max: 0/3
- Key: `/.../BackupStrategy-{0:7}/DefaultPriority/Value` (INT)
  - Default: 0, Min/Max: 0/3
- Key: `/.../BackupStrategy-{0:7}/Manual/Value` (INT)
  - Default: 0, Min/Max: -1/32
- Key: `/.../BackupStrategy-{0:7}/SecondaryManual/Value` (INT)
  - Default: 0, Min/Max: -1/32

CustomThresholdSignalDetect

- Key: `/.../BackupStrategy-{0:7}/CustomThresholdSignalDetect/Enable/Value` (BOOL) Default: False
- Key: `/.../BackupStrategy-{0:7}/CustomThresholdSignalDetect/Src-{0:3}/Value` (FLOAT)
  - Default: 0.002450765186630494, Min: 0.002450765186630494, Max: 4.358145270225206 (Linear)

PilotTone

- Key: `/.../BackupStrategy-{0:7}/PilotTone/Enable/Value` (BOOL) Default: False
- Key: `/.../BackupStrategy-{0:7}/PilotTone/Low/Value` (FLOAT)
  - Default: 1.9920567316458693, Min: 0.002450765186630494, Max: 3.8842010606113595 (Linear)
- Key: `/.../BackupStrategy-{0:7}/PilotTone/High/Value` (FLOAT)
  - Default: 1.9920567316458693, Min: 0.002450765186630494, Max: 3.8842010606113595 (Linear)
- Key: `/.../BackupStrategy-{0:7}/PilotTone/Freq/Value` (FLOAT) Default: 20000, Min: 20, Max: 22000
- Key: `/.../BackupStrategy-{0:7}/PilotTone/GpioEnable/Value` (BOOL) Default: False

### Analog Inputs

- Key: `/Device/Audio/Presets/Live/SourceSelection/AnalogInput/Gain/Value` (FLOAT)
  - Default: 1, Min: 0, Max: 5.7 (Linear)
- Key: `/Device/Audio/Presets/Live/SourceSelection/AnalogInput/Delay/Value` (FLOAT)
  - Default: 0, Min: 0, Max: 0.15 (Seconds)

### Audio over IP inputs

- Key: `/Device/Audio/Presets/Live/SourceSelection/NetStreamGroupGain{0:1}/Gain/Value` (FLOAT)
  - Default: 1, Min: 0.003981071705534973, Max: 3.9810717055349722 (Linear)
- Key: `/Device/Audio/Presets/Live/SourceSelection/NetStreamGroupGain{0:1}/Delay/Value` (FLOAT)
  - Default: 0, Min: 0, Max: 0.15 (Seconds)

### DigitalOutRouting

- Key: `/Device/Audio/Presets/Live/SourceSelection/Generals/DigitalOutRouting-{0:7}/Gain/Value` (FLOAT)
  - Default: 1, Min: 0.000988553094656939, Max: 5.623413251903491 (Linear)
- Key: `/.../DigitalOutRouting-{0:7}/Position/Value` (ENUM) Default: 0
  - Defines the pick point for routing to AOIP channel
- Key: `/.../DigitalOutRouting-{0:7}/Channel/Value` (INT) Default: 0, Min/Max: 0/31
- Key: `/.../DigitalOutRouting-{0:7}/MonomixSecondSource/Value` (INT) Default: 0, Min/Max: 0/31

READ example (Priority)

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-0/Priority-0/Value",
					"single": true
				}
			]
		}
	}
}
```

## Device Audio — Matrix

- Key: `/Device/Audio/Presets/Live/InputMatrix/Generals/ExtraControl/Enable/Value` (BOOL) Default: False
- Key: `/Device/Audio/Presets/Live/InputMatrix/InGain-{0:7}/Value` (FLOAT)
  - Default: 1, Min: 0.001, Max: 5.623413251903491 (Linear)
- Key: `/Device/Audio/Presets/Live/InputMatrix/InMute-{0:7}/Value` (BOOL) Default: False

Channels

- Key: `/Device/Audio/Presets/Live/InputMatrix/Channels/Channel-{0:7}/Gain-{0:7}/Value` (FLOAT)
  - Default: 1, Min: 0.000988553094656939, Max: 1 (Linear)
- Key: `/Device/Audio/Presets/Live/InputMatrix/Channels/Channel-{0:7}/Mute-{0:7}/Value` (BOOL) Default: False

WRITE example (set matrix cell gain)

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/InputMatrix/Channels/Channel-0/Gain-0/Value",
					"data": { "type": "FLOAT", "floatValue": 0.5 }
				}
			]
		}
	}
}
```

## Device Audio — System Processing

### InDelay

- Key: `/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InDelay/Value` (FLOAT) Default: 0, Min/Max: 0/2
- Key: `/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InDelay/Enable/Value` (BOOL) Default: True

### InputEQ

- Key: `/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InputEQ/Enable/Value` (BOOL) Default: True

Filters (`Filter-{0:95}`)

- Key: `/.../InputEQ/Filter/Filter-{0:95}/Enable` (BOOL) Default: False
- Key: `/.../InputEQ/Filter/Filter-{0:95}/Type/Value` (ENUM) Default: 2147483648
- Key: `/.../InputEQ/Filter/Filter-{0:95}/Flags/Value` (INT) Default: 0
  - 0 = not instantiated, 3 = processed
- Key: `/.../InputEQ/Filter/Filter-{0:95}/Freq1/Value` (FLOAT) Default: 1000, Min: 20, Max: 20000
- Key: `/.../InputEQ/Filter/Filter-{0:95}/Gain1/Value` (FLOAT) Default: 0, Min: -15, Max: 15
- Key: `/.../InputEQ/Filter/Filter-{0:95}/Slope1/Value` (FLOAT) Default: 1, Min: 0.1, Max: 10
- Key: `/.../InputEQ/Filter/Filter-{0:95}/Freq2/Value` (FLOAT) Default: 1000, Min: 20, Max: 20000
- Key: `/.../InputEQ/Filter/Filter-{0:95}/Gain2/Value` (FLOAT) Default: 0, Min: -15, Max: 15
- Key: `/.../InputEQ/Filter/Filter-{0:95}/Slope2/Value` (FLOAT) Default: 1, Min: 0.1, Max: 10

READ example (InDelay)

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/InputProcess/Channels/Channel-0/InDelay/Value", "single": true }]
		}
	}
}
```

This document describes how to construct READ/WRITE requests for amplifier settings using the official UNICA protocol specification, and how to interpret data types and responses.

Primary source (request/response schema):

- Sending commands to the amplifier (Protocol): https://download.powersoft.it/temp/Unica/3dparty/protocol.html

Reference for the list of IDs, their data types, and descriptions:

- Amplifier settings catalog: https://download.powersoft.it/temp/Unica/3dparty/amplifierSettings.html

Notes on scope:

- The Protocol page defines the HTTP endpoint, authentication, request/response frames, action types, value fields, and data.type mapping.
- The Amplifier settings page defines each setting ID, its type (STRING/INT/...), valid ranges/enums, defaults, and whether it is ReadOnly.

---

## Endpoint and Authentication

- URL: https://<IP_ADDRESS>:4843/am
- Method: POST
- Auth: HTTP Basic (default credentials):
  - username: powersoft
  - password: powersoft

---

## Request Frames

All requests share the same top-level structure with a mandatory payload field.

- Generic shape (quoted from protocol):

```json
{
	"clientId": "x8-panel",
	"payload": {
		"action": {
			"type": "WRITE",
			"values": [
				{
					"data": { "boolValue": true, "type": "BOOL" },
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/Mute/Value"
				}
			]
		},
		"type": "ACTION"
	}
}
```

#### Example: WRITE Ratio

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-1/DynamicEq/DYNAMICEQ-0/Ratio/Value",
					"data": { "type": "FLOAT", "floatValue": 0.5 }
				}
			]
		}
	}
}
```

### WRITE amplifier settings

- Required fields under payload.action:
  - type: "WRITE"
  - values: array of items with:
    - id: setting identifier (see Amplifier settings)
    - data: object containing `type` and corresponding value field

- Data object (Protocol-defined):
  - type: one of [STRING, FLOAT, INT, BOOL, FLOATARRAY, UINT]
  - stringValue: required if type == STRING
  - floatValue: required if type == FLOAT
  - intValue: required if type == INT
  - boolValue: required if type == BOOL
  - floatArrayValue: required if type == FLOATARRAY (floats separated by comma)
  - uintValue: required if type == UINT

- Example (mute channel 0):

```json
{
	"clientId": "x8-panel",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/Mute/Value",
					"data": { "type": "BOOL", "boolValue": true }
				}
			]
		}
	}
}
```

### READ amplifier settings

- Required fields under payload.action:
  - type: "READ"
  - values: array of items with:
    - id: setting identifier (see Amplifier settings)
    - single: boolean
      - Use true to read only the specified key (faster)
      - Must be true for `/Device/Config/Hardware/*` and `/Device/Config/Software/*`

- Example (read channel 0 mute):

```json
{
	"clientId": "x8-panel",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/Mute/Value",
					"single": true
				}
			]
		}
	}
}
```

---

## Response Frames

- Generic response shape (Protocol):

```json
{
	"clientId": "x8-panel",
	"payload": {
		"type": 100,
		"action": {
			"type": 20,
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/Mute/Value",
					"result": 10,
					"data": { "type": 40, "boolValue": true }
				}
			]
		}
	},
	"updateId": 2,
	"version": "1.0.0"
}
```

- Result codes (Protocol):
  - result: 10 = SUCCESS, 20 = FAILED
  - data.type numeric mapping:
    - 10 = STRING
    - 20 = FLOAT
    - 30 = INT
    - 40 = BOOL
    - 50 = FLOATARRAY
    - 60 = UINT

- Warning: if an `id` does not exist, the amplifier returns a `warning` field with value 20.

---

## Determining Data Types and Permissions per ID

- Data type per ID is defined in the Amplifier settings catalog; use that to choose the proper `data.type` and value field.
- Permissions:
  - Paths under `/Device/Audio/Presets/Live/ReadOnly/*` are Read-Only (RO).
  - Device info under `/Device/Config/Hardware/*` and `/Device/Config/Software/*` are read-only and require `single: true` on READ.
  - Most configuration under `/Device/Audio/Presets/Live/*` (not in ReadOnly) are read-write (RW) per their descriptions.

---

## Per-ID request guidance (examples)

Below are examples of constructing requests for commonly used IDs. For the complete set of IDs, their types, ranges, and semantics, consult the Amplifier settings catalog.

- Mute a channel (BOOL):
  - ID: `/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{ch}/Mute/Value`
  - Type: BOOL
  - WRITE example: see above
  - READ example: use `single: true`

- Output channel gain (FLOAT):
  - ID: `/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{ch}/Gain/Value`
  - Type: FLOAT
  - WRITE:

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/Gain/Value",
					"data": { "type": "FLOAT", "floatValue": 0.0 }
				}
			]
		}
	}
}
```

- Device name (STRING):
  - ID: `/Device/Config/Name`
  - Type: STRING
  - READ requires `single: true`
  - WRITE:

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Config/Name",
					"data": { "type": "STRING", "stringValue": "Main Rack" }
				}
			]
		}
	}
}
```

- Snapshot state (ReadOnly, INT):
  - ID: `/Device/Audio/Presets/Live/ReadOnly/SnapshotSlotId/Current`
  - Type: INT
  - READ example:

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/ReadOnly/SnapshotSlotId/Current", "single": true }]
		}
	}
}
```

- Input matrix gain (FLOAT):
  - ID: `/Device/Audio/Presets/Live/InputMatrix/InGain-{in}/Value`
  - Type: FLOAT
  - READ/WRITE analogous to examples above.

---

## How to extend this document per ID

For each ID you need:

- Determine the Type from the Amplifier settings catalog.
- Determine if it is ReadOnly (path or description); otherwise assume RW.
- Use the Protocol-defined envelopes:
  - WRITE: payload.type=ACTION, action.type=WRITE, values=[{ id, data: { type, <valueField> } }]
  - READ: payload.type=ACTION, action.type=READ, values=[{ id, single: true }]
- If the ID resides under `/Device/Config/Hardware/*` or `/Device/Config/Software/*`, always include `single: true` on READ.

Where applicable, preserve placeholders like `{0}`, `{1}` exactly as documented (these are channel/filter indices).

---

# Per-ID table (from Amplifier settings)

Notes

- Permission: RO when the path is under `/Device/Audio/Presets/Live/ReadOnly/*`, otherwise RW unless the text explicitly states read-only behavior.
- READ always allowed; WRITE only included for RW keys.
- Use `single: true` for `/Device/Config/Hardware/*` and `/Device/Config/Software/*` (per Protocol page), and recommended for single-key reads elsewhere.

## General amplifier’s configuration

1. Name

- ID: `/Device/Config/Name`
- Type: STRING
- Permission: RW
- READ

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": { "type": "READ", "values": [{ "id": "/Device/Config/Name", "single": true }] }
	}
}
```

- WRITE

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [{ "id": "/Device/Config/Name", "data": { "type": "STRING", "stringValue": "Main Rack" } }]
		}
	}
}
```

2. Standby

- ID: `/Device/Audio/Presets/Live/Generals/Standby/Value`
- Type: BOOL
- Permission: RW
- READ

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/Generals/Standby/Value", "single": true }]
		}
	}
}
```

- WRITE

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{ "id": "/Device/Audio/Presets/Live/Generals/Standby/Value", "data": { "type": "BOOL", "boolValue": true } }
			]
		}
	}
}
```

### GPO Configuration

3. General

- ID: `/Device/Audio/Presets/Live/Generals/Gpo/Gpo-{0:6}/General/Value`
- Type: INT
- Permission: RW
- READ

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/Generals/Gpo/Gpo-0/General/Value", "single": true }]
		}
	}
}
```

- WRITE

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/Generals/Gpo/Gpo-0/General/Value",
					"data": { "type": "INT", "intValue": 0 }
				}
			]
		}
	}
}
```

4. Type

- ID: `/Device/Audio/Presets/Live/Generals/Gpo/Gpo-{0:6}/Type/Value`
- Type: INT
- Permission: RW
- READ

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/Generals/Gpo/Gpo-0/Type/Value", "single": true }]
		}
	}
}
```

- WRITE

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{ "id": "/Device/Audio/Presets/Live/Generals/Gpo/Gpo-0/Type/Value", "data": { "type": "INT", "intValue": 1 } }
			]
		}
	}
}
```

### Latency Compensation

5. Type

- ID: `/Device/Audio/Presets/Live/Generals/LatencyCompensation/Type`
- Type: ENUM
- Permission: RW
- READ

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/Generals/LatencyCompensation/Type", "single": true }]
		}
	}
}
```

- WRITE

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/Generals/LatencyCompensation/Type",
					"data": { "type": "INT", "intValue": 2 }
				}
			]
		}
	}
}
```

6. Value (used when Type=UserDefined)

- ID: `/Device/Audio/Presets/Live/Generals/LatencyCompensation/Value`
- Type: FLOAT
- Permission: RW
- READ

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/Generals/LatencyCompensation/Value", "single": true }]
		}
	}
}
```

- WRITE

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/Generals/LatencyCompensation/Value",
					"data": { "type": "FLOAT", "floatValue": 0.5 }
				}
			]
		}
	}
}
```

### Signal Generator

7. Enable

- ID: `/Device/Audio/Presets/Live/Generals/SignalGenerator/Enable/Value`
- Type: BOOL
- Permission: RW
- READ

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/Generals/SignalGenerator/Enable/Value", "single": true }]
		}
	}
}
```

- WRITE

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/Generals/SignalGenerator/Enable/Value",
					"data": { "type": "BOOL", "boolValue": true }
				}
			]
		}
	}
}
```

8. Gain

- ID: `/Device/Audio/Presets/Live/Generals/SignalGenerator/Gain/Value`
- Type: FLOAT
- Permission: RW
- READ

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/Generals/SignalGenerator/Gain/Value", "single": true }]
		}
	}
}
```

- WRITE

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/Generals/SignalGenerator/Gain/Value",
					"data": { "type": "FLOAT", "floatValue": 1.0 }
				}
			]
		}
	}
}
```

## Source routing and source selection

9. Source Routing

- ID: `/Device/Audio/Presets/Live/SourceSelection/RoutingChannel-{0:7}/Src-{0:3}/Value`
- Type: ENUM
- Permission: RW
- READ

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/SourceSelection/RoutingChannel-0/Src-0/Value", "single": true }]
		}
	}
}
```

- WRITE

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/SourceSelection/RoutingChannel-0/Src-0/Value",
					"data": { "type": "INT", "intValue": 0 }
				}
			]
		}
	}
}
```

### Source selection strategy

10. Enable

- ID: `/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/Enable/Value`
- Type: BOOL
- Permission: RW
- READ

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-0/Enable/Value",
					"single": true
				}
			]
		}
	}
}
```

- WRITE

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-0/Enable/Value",
					"data": { "type": "BOOL", "boolValue": true }
				}
			]
		}
	}
}
```

11. Priority

- ID: `/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/Priority-{0:3}/Value`
- Type: INT
- Permission: RW
- READ/WRITE as above (use INT with `intValue`)

12. DefaultPriority, Manual, SecondaryManual

- IDs:
  - `/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/DefaultPriority/Value` (INT)
  - `/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/Manual/Value` (INT)
  - `/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/SecondaryManual/Value` (INT)
- Permission: RW
- READ/WRITE as above (use INT with `intValue`)

13. CustomThresholdSignalDetect

- IDs:
  - Enable: `/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/CustomThresholdSignalDetect/Enable/Value` (BOOL)
  - Src-{0:3}: `/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/CustomThresholdSignalDetect/Src-{0:3}/Value` (FLOAT)
- Permission: RW

14. PilotTone (BackupStrategy)

- IDs: Enable (BOOL), Low/High/Freq (FLOAT), GpioEnable (BOOL)
- Base path: `/Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/PilotTone/...`
- Permission: RW

### Analog Inputs

15. Gain, Delay

- IDs:
  - `/Device/Audio/Presets/Live/SourceSelection/AnalogInput/Gain/Value` (FLOAT)
  - `/Device/Audio/Presets/Live/SourceSelection/AnalogInput/Delay/Value` (FLOAT)
- Permission: RW

### Audio over IP inputs

16. Gain, Delay

- IDs:
  - `/Device/Audio/Presets/Live/SourceSelection/NetStreamGroupGain{0:1}/Gain/Value` (FLOAT)
  - `/Device/Audio/Presets/Live/SourceSelection/NetStreamGroupGain{0:1}/Delay/Value` (FLOAT)
- Permission: RW

### DigitalOutRouting

17. Gain, Position, Channel, MonomixSecondSource

- IDs under `/Device/Audio/Presets/Live/SourceSelection/Generals/DigitalOutRouting-{0:7}/...`
- Types: Gain (FLOAT), Position (ENUM), Channel (INT), MonomixSecondSource (INT)
- Permission: RW

## Matrix

18. AdvancedMatrix enable

- ID: `/Device/Audio/Presets/Live/InputMatrix/Generals/ExtraControl/Enable/Value`
- Type: BOOL
- Permission: RW

19. InGain, InMute

- IDs:
  - `/Device/Audio/Presets/Live/InputMatrix/InGain-{0:7}/Value` (FLOAT)
  - `/Device/Audio/Presets/Live/InputMatrix/InMute-{0:7}/Value` (BOOL)
- Permission: RW

20. Channel Gains/Mutes

- IDs:
  - `/Device/Audio/Presets/Live/InputMatrix/Channels/Channel-{0:7}/Gain-{0:7}/Value` (FLOAT)
  - `/Device/Audio/Presets/Live/InputMatrix/Channels/Channel-{0:7}/Mute-{0:7}/Value` (BOOL)
- Permission: RW

## Speakers

21. Layout metadata

- IDs include:
  - `/Device/Audio/Presets/Live/SpeakerLayout/Connections` (STRING)
  - `/Device/Audio/Presets/Live/SpeakerLayout/SpeakerName-{0:7}/Name` (STRING)
  - `/Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0:7}/Note` (STRING)
  - `/Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0:7}/Description` (STRING)
  - BrandName, FamilyName, ModelName, Application (STRING)
  - Type (ENUM), PresetType (STRING)
  - OEM field: `/Device/Audio/Presets/Live/SpeakerLayout/SpeakerOemFields-{0:7}/Name` (STRING)
- Permission: RW (note firmware min version for OEM field)

## System Processing

22. Channel controls

- IDs under `/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/...`
- Examples:
  - Gain (FLOAT), ShadingGain (FLOAT), InPolarity (BOOL), Mute (BOOL)
  - InDelay Value (FLOAT) and Enable (BOOL)
  - InputEQ Enable (BOOL)
- Permission: RW

23. InputEQ Filters

- Base path: `/Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InputEQ/Filter/Filter-{0:95}/...`
- Keys:
  - Enable (BOOL), Type (ENUM), Flags (INT)
  - Freq1/Gain1/Slope1, Freq2/Gain2/Slope2 (FLOAT)
- Permission: RW

24. Groups (Extra)

- Base: `/Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/...`
- Keys: Enable (BOOL), Guid (STRING), Name (STRING), Type (INT), Mute (BOOL), Gain (FLOAT), InDelay Value/Enable, InPolarity (BOOL), plus Group InputEQ filters
- Permission: RW

## Speaker Processing (PreOutputProcess)

25. Basic

- IDs under `/Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/...`
- Keys: Gain (FLOAT), Polarity (BOOL), Mute (BOOL), IsHighZActive (BOOL), FilterNameA/B/C (STRING)
- Permission: RW

26. Delay/FIR/XOver/IIR

- Delay: Enable (BOOL), Value (FLOAT)
- FIR: Enable (BOOL), nTaps (INT), Taps (FLOAT[])
- XOver: Enable (BOOL), Type (ENUM), Fc (FLOAT), Slope (FLOAT)
- IIR: Enable (BOOL), Type (ENUM), Fc/Gain/Q/Slope (FLOAT)
- Permission: RW

27. HarmonicGenerator

- Subsections DryOutput, SubHarmonic, Harmonic with Enable (BOOL), Gain (FLOAT), slopes/frequencies (ENUM/FLOAT) and Mode (ENUM)
- Base: `/Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/...`
- Permission: RW

## Way Processing (OutputProcess)

28. Name, Bridge

- IDs:
  - `/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/Name` (STRING)
  - `/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/Bridge/Value` (BOOL)
- Permission: RW

29. Eq section

- Basic: Mute (BOOL), Gain (FLOAT), OutPolarity (BOOL)
- OutDelay Value (FLOAT) and Enable (BOOL)
- FIR/XOver/IIR blocks analogous to PreOutputProcess
- Permission: RW

30. Limiters

- Blocks: TruePowerLimiter, CurrentLimiterRMS, CurrentClamp, ClipLimiter, VoltageLimiterRMS (and nested IIR/SoftKnee), PeakLimiter (and nested IIR/SoftKnee), DynamicEq (multiple bands)
- Types: Enable (BOOL), Threshold/Times/Gains (FLOAT), Filter params (ENUM/FLOAT)
- Base: `/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/...`
- Permission: RW

31. Damping Factor (Feedloop)

- IDs: `/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/Feedloop/Value` (FLOAT), `/Enable` (BOOL)
- Permission: RW

32. Diagnostic

- PilotToneGenerator: Enable (BOOL), Freq (FLOAT), Amplitude (FLOAT)
- PilotTone: Enable (BOOL), Low/High/Freq (FLOAT)
- LoadMonitor: Enable (BOOL), Low/High/Freq (FLOAT)
- NominalImpedance: Enable (BOOL), Low/High (FLOAT)
- Permission: RW

33. AuxAttenuation, AuxDelay (Extra)

- IDs under `/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0:7}/...`
- Types: AuxAttenuation Value (FLOAT), AuxDelay Value (FLOAT), AuxDelay Enable (BOOL)
- Permission: RW

## Amplifier’s settings snapshot (ReadOnly)

34. Active Snapshot

- ID: `/Device/Audio/Presets/Live/ReadOnly/SnapshotSlotId/Current`
- Type: INT
- Permission: RO
- READ

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/ReadOnly/SnapshotSlotId/Current", "single": true }]
		}
	}
}
```

35. Snapshot modified

- ID: `/Device/Audio/Presets/Live/ReadOnly/SnapshotSlotId/Modified`
- Type: INT
- Permission: RO
- READ

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Audio/Presets/Live/ReadOnly/SnapshotSlotId/Modified", "single": true }]
		}
	}
}
```

---

## Way Processing — Limiters (detailed IDs and examples)

All below are RW unless noted otherwise in future docs. Use `Channel-{ch}` 0..7 and other placeholders as shown.

### TruePowerLimiter

- IDs (Type):
  - `/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/TruePowerLimiter/Enable` (BOOL)
  - `/.../TruePowerLimiter/Gain/Value` (FLOAT)
  - `/.../TruePowerLimiter/Threshold/Value` (FLOAT)
  - `/.../TruePowerLimiter/AttackTime/Value` (FLOAT)
  - `/.../TruePowerLimiter/ReleaseTime/Value` (FLOAT)
  - `/.../TruePowerLimiter/HoldTime/Value` (FLOAT)
- READ example (Enable)

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [
				{ "id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/TruePowerLimiter/Enable", "single": true }
			]
		}
	}
}
```

- WRITE example (Threshold)

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/TruePowerLimiter/Threshold/Value",
					"data": { "type": "FLOAT", "floatValue": 3500 }
				}
			]
		}
	}
}
```

### CurrentLimiterRMS

- IDs: Enable (BOOL), Gain (FLOAT), Threshold (FLOAT), AttackTime (FLOAT), ReleaseTime (FLOAT), HoldTime (FLOAT)
- WRITE example (Enable)

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/CurrentLimiterRMS/Enable",
					"data": { "type": "BOOL", "boolValue": true }
				}
			]
		}
	}
}
```

### CurrentClamp

- IDs: Enable (BOOL), Gain (FLOAT), Threshold (FLOAT), AttackTime (FLOAT), ReleaseTime (FLOAT), HoldTime (FLOAT)

### ClipLimiter

- IDs: Enable (BOOL), Gain (FLOAT), Threshold (FLOAT), AttackTime (FLOAT), ReleaseTime (FLOAT), HoldTime (FLOAT)

### VoltageLimiterRMS

- IDs: Enable (BOOL), Gain (FLOAT), Threshold (FLOAT), AttackTime (FLOAT), ReleaseTime (FLOAT), HoldTime (FLOAT)
- Nested IIR (per band `IIR-{0:1}`): Enable (BOOL), Type (ENUM), Fc (FLOAT), Gain (FLOAT), Q (FLOAT), Slope (FLOAT)
- Nested SoftKnee: Enable (BOOL), Threshold (FLOAT)
- READ example (IIR Type)

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/VoltageLimiterRMS/IIR/IIR-0/Type/Value",
					"single": true
				}
			]
		}
	}
}
```

#### Example: WRITE SoftKnee Threshold

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/VoltageLimiterRMS/SoftKnee/Threshold/Value",
					"data": { "type": "FLOAT", "floatValue": 0.9 }
				}
			]
		}
	}
}
```

### PeakLimiter

- IDs: Enable (BOOL), Gain (FLOAT), Threshold (FLOAT), AttackTime (FLOAT), ReleaseTime (FLOAT), HoldTime (FLOAT)
- Nested IIR (IIR-{0:1}): Enable (BOOL), Type (ENUM), Fc (FLOAT), Gain (FLOAT), Q (FLOAT), Slope (FLOAT)
- Nested SoftKnee: Enable (BOOL), Threshold (FLOAT)
- WRITE example (AttackTime)

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/PeakLimiter/AttackTime/Value",
					"data": { "type": "FLOAT", "floatValue": 0.002 }
				}
			]
		}
	}
}
```

#### Example: READ IIR Q

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/PeakLimiter/IIR/IIR-1/Q/Value",
					"single": true
				}
			]
		}
	}
}
```

#### Example: WRITE SoftKnee Enable

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/PeakLimiter/SoftKnee/Enable",
					"data": { "type": "BOOL", "boolValue": true }
				}
			]
		}
	}
}
```

### DynamicEq (three bands `DYNAMICEQ-{0:2}`)

- IDs (Type): Enable (BOOL), FilterType (ENUM), Fc (FLOAT), MinGain (FLOAT), Q (FLOAT), Slope (FLOAT), Threshold (FLOAT), AttackTime (FLOAT), ReleaseTime (FLOAT), LimiterType (ENUM), Position (ENUM), Subposition (ENUM), Ratio (FLOAT)
- READ example (Threshold)

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-1/DynamicEq/DYNAMICEQ-0/Threshold/Value",
					"single": true
				}
			]
		}
	}
}
```

## Way Processing — Damping Factor

- IDs:
  - `/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/Feedloop/Value` (FLOAT)
  - `/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/Feedloop/Enable` (BOOL)
- WRITE example (Value)

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "WRITE",
			"values": [
				{
					"id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-0/Feedloop/Value",
					"data": { "type": "FLOAT", "floatValue": 0.0 }
				}
			]
		}
	}
}
```

## Way Processing — Diagnostic

### PilotToneGenerator

- IDs: Enable (BOOL), Freq (FLOAT), Amplitude (FLOAT)

### PilotTone

- IDs: Enable (BOOL), Low (FLOAT), High (FLOAT), Freq (FLOAT)

### LoadMonitor

- IDs: Enable (BOOL), Low (FLOAT), High (FLOAT), Freq (FLOAT)

### NominalImpedance

- IDs: Enable (BOOL), Low (FLOAT), High (FLOAT)

READ template (Diagnostic)

```json
{
	"clientId": "c",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [
				{ "id": "/Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{ch}/PilotTone/Freq/Value", "single": true }
			]
		}
	}
}
```

## Way Processing — Extras

### AuxAttenuation

- ID: `/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0:7}/AuxAttenuation/Value` (FLOAT)

### AuxDelay

- IDs:
  - `/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0:7}/AuxDelay/Value` (FLOAT)
  - `/Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0:7}/AuxDelay/Enable` (BOOL)

---

## Device Info (Hardware/Software) — pending exact ID list

These keys are expected to be Read-Only under the following roots:

- `/Device/Config/Hardware/*` (RO)
- `/Device/Config/Software/*` (RO)

Use `single: true` for single-key reads.

READ template (Hardware)

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Config/Hardware/<ExactKey>", "single": true }]
		}
	}
}
```

READ template (Software)

```json
{
	"clientId": "your-client",
	"payload": {
		"type": "ACTION",
		"action": {
			"type": "READ",
			"values": [{ "id": "/Device/Config/Software/<ExactKey>", "single": true }]
		}
	}
}
```

Note: Populate <ExactKey> with the official names from the Powersoft documentation when available.
