# companion-module-powersoft-amplifier

Short description and project overview for the Bitfocus Companion module for Powersoft amplifiers.

## Overview

This repository contains a Bitfocus Companion module to control Powersoft amplifiers over the network (HTTP API) with optional UDP feedback polling for power, mutes, and alarms.

- Supports single-device and multi-device setups.
- Targets Ottocanali and similar series using the documented API.
- UDP alarms/feedback can be enabled via `enableUdpFeedback` in the module config.

## Documentation

Detailed user-facing documentation (configuration, actions, variables, feedback, and notes) lives in:

- [companion/HELP.md](companion/HELP.md)
- Additional technical docs in [docs/](docs/)

## Beta: Auto Discovery Mode

This module includes a beta UDP-based auto-discovery for Powersoft amplifiers.

- **How it works**
  - Broadcasts a Powersoft discovery packet on UDP port `8004` with a hardcoded public RSA key and client name.
  - Discovered devices are parsed and listed live in the config as you scan.

- **Enabling**
  - In the instance config, enable `Scan network for Powersoft amplifiers (UDP 8004)`.
  - Use the `Select discovered amplifier(s)` multidropdown to pick one or more devices.

- **Single vs Multi mode**
  - `Mode = Single device`: The first selected device will populate the `Hostname/IP` field.
  - `Mode = Multiple devices`: All selected devices populate `Devices IPs` (comma-separated) in `devicesCsv`.

- **Notes**
  - The RSA public key and client name are hardcoded as per Powersoft documentation; they are not configurable.
  - Discovery runs only while `Scan` is enabled; disabling scan clears the in-memory discovered list and selection.
  - Discovery is network broadcast; ensure your environment allows UDP broadcast on port 8004.
  - This is a beta feature and may evolve. Please report issues/firmware quirks with debug logs if possible.

- **Troubleshooting**
  - If devices don’t appear, confirm Layer-2 broadcast reachability and that the amplifiers are on the same subnet.
  - Some environments may restrict broadcast; try configuring `Host` or `Devices IPs` manually as a fallback.

## License

MIT
