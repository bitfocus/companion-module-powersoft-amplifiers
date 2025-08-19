# Powersoft Canali‑DSP UDP Protocol (Working Notes)

These notes summarize the UDP control protocol used by Powersoft Canali‑DSP amplifiers, based on field tests with `scripts/canali-udp-probe.mjs` and excerpts from `docs/API_for_X_T_Canali-DSP_0.16.pdf`.

This document will be updated as more PDF pages are shared and validated on hardware.

---

### 0x19 – READALLALARMS2 (Newer)

Used to read extended alarms/status.

- Request data: none (`count=0`).
- Response data:
  - `answer_ok` (UINT8)
  - `gpio_alarms` (UINT8) – status of output relays (Ottocanali DSP+D). Bit0=CH0 … Bit7=CH7.
  - `0` (UINT16LE reserved)
  - `global_alarms` (UINT32LE)
  - `channel X alarms` (8 × UINT32LE for channels 0..7)

Bit meanings (excerpt):

- `global_alarms` bits: 0 mains phases detect error (only X), 1 AD config fault, 2 DA config fault, 3 AUX voltage fault (only X), 4 Digi board over-temp [shutdown], 5 PSU over-temp (only X) [shutdown], 6 Fan fault [shutdown], 7 moderate over-temp (only X) [shutdown], 8 high over-temp (only X) [shutdown].
- `channel X` bits: 0 input clip, 1 active thermal SOA (only X), 3 over-temp, 4 rail voltage fault, 5 AUX current fault (only X), 6 other fault, 7 low load protection. Others: not used per excerpt.

Probe usage:

```powershell
corepack yarn probe:udp <ip> 1234 3000 readallalarms2
```

Example output (fields vary by device):

```
READALLALARMS2 decoded: {
  answer_ok: 1,
  gpio_alarms_hex: '0x00',
  global_alarms_hex: '0x00000000',
  channels: [ { ch:0, hex:'0x00000000', bits:[] }, ... ]
}
```

---

## Overview

- Transport: UDP
- Default device port: `1234`
- All messages are fixed header frames with optional data, followed by CRC16 and an inverted command byte.
- Endianness: multi‑byte numeric fields are little‑endian unless explicitly noted.
- Cookie: 16‑bit value chosen by the client and echoed back by the device.
- Answer port: 16‑bit UDP port where the device should reply. We use our bound local UDP port; some devices may require `0`.

---

## Generic Message Format

From the PDF summary (applies to both requests and responses):

- **STX**: 0x02
- **cmd**: 1 byte. Requests: 0–127. Responses: 128–255 (typically `~request_cmd`).
- **cookie**: uint16 LE (arbitrary; echoed by device)
- **count**: uint16 LE (number of data bytes)
- **answer_port**: uint16 LE (UDP port where device replies; if 0, device may use 1234)
- **data**: command-specific payload (length = `count`)
- **crc16**: uint16 LE, CRC‑16/IBM of `data` (0 when `count=0`).
- **~cmd**: 1 byte, bitwise complement of `cmd` (i.e., `cmd ^ 0xFF`).
- **ETX**: 0x03

Notes:

- For STANDBY (cmd=0x0E), the command page requires **CRC16=0 even when `count=4`**. Devices ignore the request if a computed CRC is used.

### Command List (from PDF)

- 0 PING (`~cmd`=255)
- 1 READGM (`~cmd`=254)
- 2 WRITEMUTE (`~cmd`=253)
- 3 WRITEMUTEON (`~cmd`=252)
- 4 WRITEGAIN (`~cmd`=251)
- 5 WRITEGAINON (`~cmd`=250)
- 6 READPRESET (`~cmd`=249)
- 7 LOADPRESET (`~cmd`=248)
- 8 WRITEMULTI (`~cmd`=247)
- 9 REMOVEPRESET (`~cmd`=246)
- 10 SAVEPASTE (`~cmd`=245)
- 11 INFO (`~cmd`=244)
- 12 READPRESETINFO (`~cmd`=243)
- 13 READALLALARMS (`~cmd`=240) [deprecated; use READALLALARMS2]
- 14 STANDBY (`~cmd`=241)
- 15 READALLALARMS (`~cmd`=240)
- 16 READALLALARMS? (see PDF variants)
- 17 READALLOCT (`~cmd`=238) [per extended list]
- 18 READAUDIO? (`~cmd`=237)
- 19 READLOADMONITOR (`~cmd`=236)
- 21 SETPILOTONEGENERATOR (`~cmd`=234)
- 22 SETPILOTONEDETECTION (`~cmd`=233)
- 23 SETLOADMONITOR (`~cmd`=232)
- 24 SETLOADDETECT (`~cmd`=231)
- 25 READALLALARMS2 (`~cmd`=230)
- 26 LOADPRESET2 (`~cmd`=229)
- 27 SOURCEMETER (`~cmd`=228)
- 28 OUTPUTMETER (`~cmd`=227)
- 29 READLOADSTATUS (`~cmd`=226)

This list may vary by model/firmware; only a subset is implemented in the probe.

---

## Frame Format

```
Offset  Size  Field                   Notes
0       1     STX                     0x02
1       1     cmd                     Command ID
2       2     cookie                  uint16 LE (client-chosen, echoed by device)
4       2     count                   uint16 LE (byte count of the data payload)
6       2     answer_port             uint16 LE (UDP port to reply to)
8       N     data                    Command-specific payload
8+N     2     crc16                   uint16 LE; computed over bytes [0 .. 7+N]
10+N    1     notCmd                  Bitwise NOT of cmd (i.e., cmd ^ 0xFF)
11+N    1     ETX                     0x03
```

- CRC: CRC‑16/IBM (ANSI), polynomial 0xA001, init 0xFFFF. Example: CRC("123456789") = 0xBB3D.
- `notCmd` is a simple integrity check: `notCmd == (~cmd & 0xFF)`.

---

## Common Response Header

Device responses mirror the request header with:

- `cmd` set to `~request_cmd` (bitwise NOT), e.g., request `0x01` → response `0xFE`.
- Same `cookie` as the request.
- `count`, `answer_port`, and `data` according to the command.

Example response header (decoded by the probe):

```
Header: {
  STX: 2,
  cmd: 254,            // ~0x01
  cookie: 30267,
  count: 52,
  answerPort: 0,
  crc16: '0xdbf3',
  notCmd: 1,
  ETX: 3
}
```

---

### 0x0F – READALLALARMS (Deprecated)

Reads alarms/live status. PDF notes this is deprecated (use newer variant if available), but devices still respond.

- Request data: none (`count=0`).
- Response data: 4 bytes `[answer_ok, alarms, 0, 0]`
  - `answer_ok` = 1 means valid
  - `alarms` = bitfield (PDF: status of output relays for Ottocanali DSP+D)

Observed example:

```
READALLALARMS decoded: { answer_ok: 1, alarms_hex: '0x00', alarms_bin: '00000000', dataLen: 4 }
```

Probe usage:

```powershell
corepack yarn probe:udp <ip> 1234 3000 readallalarms
```

---

## Commands Validated So Far

### 0x00 – PING

- Purpose: connectivity check.
- Request data: none (`count=0`).
- Response: device echoes cookie; data layout not specified by PDF, but presence of valid response confirms connectivity and framing.

Probe usage:

```powershell
corepack yarn probe:udp <ip> 1234 3000
```

---

### 0x0B – INFO (Read static info)

Reads static amplifier information. Per PDF, response is 128 bytes made of four null‑terminated strings (max 31 chars + NUL) each, in this order:

- Manufacturer (32 bytes)
- Family (32 bytes)
- Model (32 bytes)
- Serial (32 bytes)

- Request data: none (`count=0`).
- Response data: 128 bytes as above.

Observed example:

```
INFO decoded: {
  manufacturer: 'Powersoft',
  family: 'Ottocanali',
  model: '4K4',
  serial: '718049'
}
```

Probe usage:

```powershell
corepack yarn probe:udp <ip> 1234 3000 info
```

---

### 0x01 – READGM (Read Gains & Mutes)

Reads per‑channel input/output gains (centi‑dB) and mute states.

- Request data: none (`count=0`).
- Response data (observed):
  - Byte 0: `answer_ok` (1 = valid)
  - Byte 1: `num_channels`
  - Then per channel fields packed as follows:
    - Input gain: int16 LE (centi‑dB)
    - Output gain: int16 LE (centi‑dB)
    - Input mute: 1 byte (0 = unmuted, 1 = muted)
    - Output mute: 1 byte (0 = unmuted, 1 = muted)

Example decoded on an 8‑channel unit:

```
READGM decoded: { answer_ok: 1, num_channels: 8, dataLen: 52 }
  CH1: IN 0.00 dB UNMUTE | OUT 0.00 dB UNMUTE
  CH2: IN 0.00 dB UNMUTE | OUT 0.00 dB UNMUTE
  CH3: IN 0.00 dB UNMUTE | OUT 0.00 dB UNMUTE
  CH4: IN 0.00 dB UNMUTE | OUT 0.00 dB UNMUTE
  CH5: IN 0.00 dB UNMUTE | OUT 0.00 dB MUTE
  CH6: IN 0.00 dB UNMUTE | OUT 0.00 dB MUTE
  CH7: IN 0.00 dB UNMUTE | OUT 0.00 dB MUTE
  CH8: IN 0.00 dB UNMUTE | OUT 0.00 dB MUTE
```

Probe usage:

```powershell
corepack yarn probe:udp <ip> 1234 3000 readgm
```

---

### 0x0E – STANDBY (Set/Read Standby)

Set or read the amplifier standby state.

- Request data (PDF): 4 bytes `[ON_OFF_READ, 0, 0, 0]`
  - `0` = read current state without changing it
  - `1` = set standby OFF (amplifier operative, i.e., power on)
  - `2` = set standby ON (amplifier in standby, not operative)
- Response data (PDF): 4 bytes `[answer_ok, ON_OFF, 0, 0]`
  - `answer_ok` = 1 means valid answer
  - `ON_OFF` = 2 → STANDBY OFF (operative), 1 → STANDBY ON (not operative)

Important:

- The spec requires CRC16 = 0 for this command, even though `count = 4`. Using a computed CRC causes the device to ignore the request. After forcing CRC16 to zero, devices reply as expected.

Observed example (read):

```
Data(hex): 01 01 00 00
STANDBY decoded: { answer_ok: 1, onoff: 1, powerState: 'STANDBY (not operative)', dataLen: 4 }
```

Observed example (read with ON_OFF=2):

```
Data(hex): 01 02 00 00
STANDBY decoded: { answer_ok: 1, onoff: 2, powerState: 'STANDBY OFF (operative)', dataLen: 4 }
```

Status: On the tested unit, successful responses to read have been observed after forcing CRC16 to zero.

- Probe usage (added options):

```powershell
# Read (unicast)
corepack yarn probe:udp <ip> 1234 3000 standby 0

# Read (broadcast)
corepack yarn probe:udp <ip> 1234 3000 standby 0 broadcast

# Read with answer_port forced to 0
corepack yarn probe:udp <ip> 1234 3000 standby 0 ap0

# Set OFF (operative) then read back – will toggle the device
corepack yarn probe:udp <ip> 1234 3000 standby 1
corepack yarn probe:udp <ip> 1234 3000 standby 0

# Set ON (standby) then read back – will toggle the device
corepack yarn probe:udp <ip> 1234 3000 standby 2
corepack yarn probe:udp <ip> 1234 3000 standby 0
```

---

## Probe Script Reference

- Script: `scripts/canali-udp-probe.mjs`
- Key features:
  - Builds frames with correct CRC‑16/IBM and `~cmd` trailer.
  - Binds a UDP socket and uses its local port as `answer_port` (or `0` with `ap0`).
  - Pretty‑prints parsed headers and command‑specific decodes.

Examples:

```powershell
# PING
yarn probe:udp <ip> 1234 3000

# READGM
yarn probe:udp <ip> 1234 3000 readgm

# STANDBY read
yarn probe:udp <ip> 1234 3000 standby 0
```

---

## Open Questions / To Validate

- ALARMS/STATUS commands providing power/thermal/fault states.
- Whether some commands require broadcast or `answer_port=0` on certain firmware.
- Precise range/units for gains and any clipping/signal indicators over UDP.

Please share the remaining PDF pages (INFO, alarms/status, mute/gain write, etc.) and we will extend this document with authoritative layouts and examples verified on hardware.
