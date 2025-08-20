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

## License

MIT
