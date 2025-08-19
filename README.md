# companion-module-powersoft-amplifier

This module allows you to control Powersoft amplifiers using their network API.

## Configuration

1. **Network Settings**
   - Set the IP address of your Powersoft amplifier in the `Amplifier IP` field
   - Set the port for the API (default: 80 for HTTP, 443 for HTTPS)
   - Configure the update frequency in milliseconds (default: 1000ms)

2. **Authentication**
   - Enter the username (default: admin)
   - Enter the password (if required by your device)

## Available Actions

**Power Control**

- Power On/Off
- Toggle Power

**Channel Control**

- Mute/Unmute Channel
- Set Channel Gain
- Select Preset

**System**

- Reboot Device
- Factory Reset (use with caution)

## Available Variables

**System**

- Device Model
- Firmware Version
- IP Address
- Temperature
- Fan Speed

**Channel Status**

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
