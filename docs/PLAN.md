# Project Plan — Companion Module: Powersoft Amplifier

Last updated: 2025-08-18

## 1) Scope & Objectives

- Provide reliable control of Powersoft amplifiers via their network API.
- Cover core functions first: power/standby, channel mute/gain, preset load, basic device info.
- Expose high-signal feedbacks/variables for panels (clip, signal, temp, faults).
- Ensure robust error handling, retries, and clear user-facing errors.

### In Scope (Phase 1)

- Actions implemented in `src/actions.ts` (e.g., power, mute, gain, preset).
- API client in `src/api.ts` with authentication/session and write/read helpers.
- Config fields in `src/config.ts` (host, port, credentials, poll interval).
- Variables/feedbacks in `src/variables.ts`, `src/feedbacks.ts` aligned to `docs/README.md`.

### Out of Scope (Initial)

- Full parameter matrix coverage.
- Advanced DSP features beyond the high-impact set.

## 2) Milestones

- M1 — MVP device control
  - Implement and wire power/standby, channel mute, channel gain, preset select.
  - Read-only variables for model/firmware/IP and basic channel state.
  - Basic polling loop and connection lifecycle.

- M2 — Feedbacks & stability
  - Add clip/signal/temp/fault feedbacks with thresholds.
  - Improve retries/backoff, timeouts, and structured error messages.
  - Expand tests and simulator/mocks.

- M3 — Extended coverage & UX
  - Additional actions (reboot, blink, lock mgmt where applicable).
  - Better config validation and UI hints.
  - Documentation pass and examples.

## 3) Work Breakdown

- Actions (`src/actions.ts`)
  - Map core actions to API calls (standby on/off/toggle, mute/unmute, set gain, select preset).
  - Validate inputs (channel index, gain range, preset id).
  - Use enums in `src/enums.ts` and IDs from `docs/README.md`.

- API Client (`src/api.ts`)
  - Implement login/session management if required by device.
  - Implement `read`, `write` helpers using Action.Type 10/20 and Value.Type mapping.
  - Centralize request building: version, clientId, tag/updateId.
  - Handle HTTP(S) selection and TLS options.

- Config (`src/config.ts`)
  - Fields: host, port, username, password, polling interval, useHttps.
  - Validate host/port; sensible defaults (poll = 1000ms).

- Variables & Feedbacks (`src/variables.ts`, `src/feedbacks.ts`)
  - Variables: model, firmware, ip, temperature, fan speed, channel states.
  - Feedbacks: power status, mute status, clip, signal, temp warning, fault.
  - Align paths with `docs/README.md` AccessManagerKey table.

- Polling/State (`src/subscriptions.ts` or within `src/api.ts`)
  - Periodic READ for required parameter paths.
  - Debounce/state diff to minimize events.

- Error Handling & Logging
  - Standard error wrapper with user-friendly messages.
  - Retries with backoff for transient failures.

- Tests
  - Unit tests for request building and parsing.
  - Mock transport or simulator for API.

## 4) Risks & Mitigations

- Differences across amplifier models
  - Mitigation: Feature detection and conditional actions; document supported models.
- Authentication variations
  - Mitigation: Config switches and defensive login flow.
- API rate limiting or instability
  - Mitigation: Throttle writes, batch requests, and backoff.

## 5) Deliverables

- Working module with core actions/feedbacks.
- `docs/README.md` kept in sync with enums/paths used.
- This `docs/PLAN.md` as living roadmap.

## 6) Acceptance Criteria (MVP)

- Power, mute, gain, preset actions operate successfully on a test device.
- Variables reflect device model, firmware, and at least one channel's mute/gain.
- Feedbacks trigger appropriately for clip/signal.
- Reasonable errors on network/auth failures; no unhandled exceptions.
