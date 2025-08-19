## Powersoft Amplifier

# companion-module-powersoft-amplifier

This module allows you to control and monitor Powersoft amplifiers via their network API.

## Configuration

### Network Settings

- **Amplifier IP**: The IP address of your Powersoft amplifier
- **Port**: The port for the API (default: 80 for HTTP, 443 for HTTPS)
- **Update Frequency**: How often to poll the device for status updates (in milliseconds)

### Authentication

- **Username**: Authentication username (default: admin)
- **Password**: Authentication password (if required)

## Available Actions

### Power Control

- Power On
- Power Off
- Toggle Power

### Channel Control

- Mute/Unmute Channel
- Set Channel Gain
- Select Preset

### System

- Reboot Device
- Factory Reset (use with caution)

## Available Variables

### System

- Device Model
- Firmware Version
- IP Address
- Temperature
- Fan Speed
- Uptime

### Channel Status

- Channel Name
- Mute Status
- Gain Level
- Signal Present
- Clip Status
- Temperature
- Load Impedance

## Available Feedback

- Power Status
- Channel Mute Status
- Clip Detection
- Signal Present
- Temperature Warning
- Fault Status

## Troubleshooting

- Ensure your amplifier is connected to the network
- Verify the IP address is correct and reachable
- Check that the correct port is being used
- Verify authentication credentials if required by your device
- Check the module logs in Companion for any error messages
