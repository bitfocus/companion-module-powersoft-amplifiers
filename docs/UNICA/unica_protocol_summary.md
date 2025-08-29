# Powersoft UNICA Amplifiers – Command Protocol Summary

Source: UNICA 1.0.0.7 documentation

- Index: https://download.powersoft.it/temp/Unica/3dparty/index.html
- Intro: https://download.powersoft.it/temp/Unica/3dparty/introduction.html
- Discovery: https://download.powersoft.it/temp/Unica/3dparty/discovery.html
- Protocol (send commands): https://download.powersoft.it/temp/Unica/3dparty/protocol.html
- Unsolicited events (meters): https://download.powersoft.it/temp/Unica/3dparty/meters.html
- Special commands: https://download.powersoft.it/temp/Unica/3dparty/specialCommands.html
- Firmware update: https://download.powersoft.it/temp/Unica/3dparty/firmwareupdate.html
- Amplifier settings reference: https://download.powersoft.it/temp/Unica/3dparty/amplifierSettings.html

## Overview

- **Topology**: Master/Slave. Remote controller (client) is master; amplifier is slave.
- **Transport**: HTTPS over TCP.
- **Auth**: HTTP Basic Auth. Default credentials: `powersoft` / `powersoft`.
- **Main endpoint**: `https://<IP_ADDRESS>:4843/am` (HTTP POST with JSON body).
- **WebSocket meters**: `wss://<IP_ADDRESS>:4843/socket.io` (Socket.IO-compatible framing; Basic Auth header required).
- **Unavailable state**: If unit is part of an install/DMD system, API returns HTTP 409 Conflict.

## Discovery (UDP)

- **Datagram**: Send UDP broadcast probe. Packet format:
  - Starts with `@?` (STX)
  - Ends with `!` (ETX)
  - Fields separated by byte `0x1C` (File Separator). Many examples show `|` for readability; it actually represents `0x1C`.
  - Include provided RSA public key exactly as shown in documentation (including `0x0A` newlines).

Example request (visualized with `|` as field separator; use `0x1C` on wire):

```
"@?||-----BEGIN PUBLIC KEY----- MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+FWqPd1LGfQn6dGbWRh//pUZm LNAr1phxnToHHW75hXrMWSgA+vrGwR8SELrdgaqL2Gjyboen5BP7dFndF04hnIO3 DMdUSum4adSoZikzJe0w+o9Cm4p153K9WkJTJ7fPdcmb8wWMLUvI4/6Yjdazz1sy 1S9mRjS4SksSTTz0tQIDAQAB -----END PUBLIC KEY-----|ClientName!"
```

Example response (symbolic):

```
@?D*Model*\|*FwVersion*\|*serialNumber*\|...\|*options*\|...!
```

- **options**: `-` none, `D` Dante, `+` AES67.
- **Model identifiers** (subset): `8L-8K` (Unica 8K8), `8L-4K`, `8L-2K`, `8L-1K`, `4XL-16K`, `4XL-12K`, `4XL-8K`, `4XL-5K`.

## Command Protocol (HTTPS POST /am)

- **URL**: `https://<IP_ADDRESS>:4843/am`
- **Method**: POST
- **Headers**: Basic Auth (default `powersoft:powersoft`)
- **Body**: JSON object with a `payload` field

### Request envelope

Minimal WRITE example (mute channel 0):

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

Minimal READ example:

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

Notes:

- `values[].id`: key path; see full catalog at Amplifier settings reference.
- `READ values[].single`: true to read only that key (required for `/Device/Config/Hardware/*` and `/Device/Config/Software/*`).
- `data.type` for WRITE: one of `STRING`, `FLOAT`, `INT`, `BOOL`, `FLOATARRAY`, `UINT` with corresponding value field:
  - `stringValue`, `floatValue`, `intValue`, `boolValue`, `floatArrayValue` (comma-separated list), `uintValue`.

### Response envelope (generic)

```json
{
	"clientId": "x8-panel",
	"version": "1.0.0",
	"updateId": 2,
	"payload": {
		"type": 100,
		"action": {
			"type": 20,
			"values": [
				{
					"id": "/Device/.../Mute/Value",
					"result": 10,
					"data": { "type": 40, "boolValue": true }
				}
			]
		}
	}
}
```

- `values[].result`: `10` SUCCESS, `20` FAILED.
- For non-existent `id`, a `warning: 20` may be returned.
- In responses, `data.type` uses numeric enums: `10=STRING, 20=FLOAT, 30=INT, 40=BOOL, 50=FLOATARRAY, 60=UINT`.

## Unsolicited Events (Meters via WebSocket)

- **Endpoint**: `wss://<IP_ADDRESS>:4843/socket.io`
- **Protocol**: Socket.IO-compatible over WebSocket.
- **Auth header** required:

```
Authorization: Basic cG93ZXJzb2Z0OnBvd2Vyc29mdA==
```

- Server sends messages; consider only those starting with `42` and a JSON array `[type, payload]`.
- Types documented: `"status-update"` and `"value-changed"` (this guide focuses on status-update readings).

Example status-update (trimmed):

```
42["status-update", { "payload": { "readings": { "meters": { ... }, "slows": { ... } } } }]
```

### Fast meters (payload.readings.meters)

- Objects:
  - `source_selection[]`: per input channel
    - Peaks/RMS per slot `meter_peak_0..3`, `meter_rms_0..3`
    - Presence/clip per slot `signal_presence_0..3` (1.0 or 0.0), `signal_clipping_0..3` (bool)
    - `signal_presence_active`, `signal_clipping_active`
  - `output_process[]`: per output channel
    - `meter_v_post_peak/rms` (V), `meter_i_post_peak/rms` (A)
    - `meter_headroom`, `nominal_impedence`
    - Limiter reductions: `user_gain_reduction_*`, `soa_gain_reduction_current_clamp_limiter`, `user_gain_reduction_total`
  - `dsp_tskmgr`: `dsp_load_avg`, `dsp_load_peak`

### Slow meters (payload.readings.slows)

- Examples include:
  - `ext_state`: `fan`, `power_supply`, `mains`, `standby`, HW fault flags; `input_channels[]`, `output_channels[]` flags
  - `arm_info_slow`: CPU/mem/disk usage
  - `ali`: mains phases, volt/current RMS/peak
  - `source_selection[]`: pilot tone detection flags
  - `ampli[]`: temperature peaks
  - `output_process[]`: pilot tone detection, nominal impedance validity, dip switches

## Special Commands (SPECIALACTION payload)

Top-level envelope:

```json
{
  "clientId": "x8-panel",
  "payload": {
    "type": "SPECIALACTION",
    "specialAction": { "type": "<ACTION_TYPE>", ... }
  }
}
```

### Live Impedance

- Read:

```json
{
	"clientId": "x8-panel",
	"payload": {
		"type": "SPECIALACTION",
		"specialAction": { "type": "GET_LIVE_IMPEDANCE", "getLiveImpedance": { "channel": 0 } }
	}
}
```

- Reset:

```json
{
	"clientId": "x8-panel",
	"payload": {
		"type": "SPECIALACTION",
		"specialAction": { "type": "RESET_LIVE_IMPEDANCE", "resetLiveImpedance": { "channel": 0 } }
	}
}
```

- Response contains arrays: `frequency`, `magnitude`, `phase`, `variance` or `{ "result": 10 }` for reset.

### Blink (identify device)

- Request blink on/off:

```json
{
	"clientId": "x8-panel",
	"payload": {
		"type": "SPECIALACTION",
		"specialAction": { "type": "DEVICE_MANAGEMENT", "deviceManagement": { "type": "BLINK" } }
	}
}
```

- Response: `{ ... "deviceManagementResponse": { "result": true } }`

### Reset Live preset

```json
{ "clientId": "x8-panel", "payload": { "type": "SPECIALACTION", "specialAction": { "type": "RESET_LIVE" } } }
```

### Dante settings

- Read firmware:

```json
{
	"clientId": "x8-panel",
	"payload": { "type": "SPECIALACTION", "specialAction": { "type": "READ_AUDINATE_FIRMWARE", "readdantefirmware": {} } }
}
```

- Read info (keys array e.g. `["MODEL","NAME"]`):

```json
{
	"clientId": "x8-panel",
	"payload": {
		"type": "SPECIALACTION",
		"specialAction": { "type": "READ_AUDINATE_INFO", "readdanteinfo": { "keys": ["MODEL", "NAME"] } }
	}
}
```

- Set info:

```json
{
	"clientId": "x8-panel",
	"payload": {
		"type": "SPECIALACTION",
		"specialAction": { "type": "SET_AUDINATE", "setdanteinfo": { "data": [{ "key": "NAME", "s_value": "NEW_NAME" }] } }
	}
}
```

### Network

- Read network status:

```json
{ "clientId": "x8-panel", "payload": { "type": "SPECIALACTION", "specialAction": { "type": "NETWORK_STATUS" } } }
```

- Set network (example: static IP):

```json
{
	"clientId": "x8-panel",
	"payload": {
		"type": "SPECIALACTION",
		"specialAction": {
			"type": "NETWORKING_MANAGEMENT",
			"networkingManagement": {
				"type": "ETHERNET_APPLY",
				"ethernet": {
					"type": "STATICIP",
					"staticip": {
						"ip": "192.168.0.12",
						"netmask": "255.255.255.0",
						"gateway": "192.168.0.1",
						"dns": "192.168.0.1"
					}
				}
			}
		}
	}
}
```

### Preset Management

- List presets (FLASH or USB; kind PRESET or SPEAKER):

```json
{
	"clientId": "x8-panel",
	"payload": {
		"type": "SPECIALACTION",
		"specialAction": {
			"type": "PRESET_MANAGEMENT",
			"presetManagement": { "type": "LIST", "presetList": { "kind": "PRESET", "memory": "FLASH" } }
		}
	}
}
```

- Action (PLAY, PLAY_PRESERVE_GROUP, STORE, DELETE, COPY, LOCK, UNLOCK, SWAP):

```json
{
	"clientId": "x8-panel",
	"payload": {
		"type": "SPECIALACTION",
		"specialAction": {
			"type": "PRESET_MANAGEMENT",
			"presetManagement": { "type": "ACTION", "presetAction": { "action": "PLAY", "slotId": 0, "memory": "FLASH" } }
		}
	}
}
```

## Firmware Update (HTTPS on 1880)

Warning: Wrong file or power loss may brick the device. Use Admin credentials (default `admin` / `admin`).

1. Upload firmware (multipart/form-data):

```bash
curl -v -i -u <username>:<password> --insecure -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@<path_to_file>" \
  https://<IP_ADDRESS>:1880/upload
```

2. Trigger restart to apply:

```bash
curl -v -i -u <username>:<password> --insecure -X POST \
  -H 'Content-Length: 0' \
  https://<IP_ADDRESS>:1880/restart
```

Note: Device validates filename and contents.

## Amplifier Settings Catalog

The complete list of readable/writable keys and data models is documented here:

- https://download.powersoft.it/temp/Unica/3dparty/amplifierSettings.html

Areas include:

- General config (GPI/GPO, Latency Compensation, Signal Generator)
- Source routing and selection (Analog, AoIP, DigitalOutRouting)
- Matrix, Speakers
- System Processing (InDelay, InputEQ, Groups)
- Speaker Processing (Delay, FIR, XOver, IIR, HarmonicGenerator)
- Way Processing (Eq, Limiters, Damping Factor, Diagnostic, AuxAttenuation, AuxDelay)
- Settings snapshot

## Implementation Notes & Caveats

- **TLS**: endpoints use HTTPS/WSS with device certificate; many examples show `--insecure` for curl during development.
- **Auth**: change defaults in production; update Base64 header for WebSocket.
- **DMD mode**: expect HTTP 409 for command requests if the device is under an install/DMD controller.
- **Meters**: parse only Socket.IO `42[...]` events with `status-update`; ignore other engine-level frames.
- **Discovery**: remember UDP FS is `0x1C`. Preserve RSA public key line endings (0x0A) in the request.
