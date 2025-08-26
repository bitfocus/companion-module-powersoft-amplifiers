# Amplifier Settings — Extracted Tables (topics 0..74)
Source: https://download.powersoft.it/temp/Unica/3dparty/amplifierSettings.html


## Name
| Field | Value |
|---|---|
| Key | /Device/Config/Name |
| Type | STRING |
| Default | The default value is set to the amplifier model |

## Standby
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Generals/Standby/Value |
| Type | BOOL |
| Default | False |

## Vca
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Generals/Gpi/Vca-{0:5}/Value |
| Type | INT |
| Default | -1 |
| Min | -1 |
| Max | 7 |

## Mute
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Generals/Gpi/Mute-{0:5}/Value |
| Type | INT |
| Default | -1 |
| Min | -1 |
| Max | 7 |

## Standby
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Generals/Gpi/Standby/Value |
| Type | INT |
| Default | -1 |
| Min | -1 |
| Max | 7 |

## General
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Generals/Gpo/Gpo-{0:6}/General/Value |
| Type | INT |
| Default | -1 |
| Min | -1 |
| Max | 5 |

## Type
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Generals/Gpo/Gpo-{0:6}/Type/Value |
| Type | INT |
| Default | -1 |
| Min | -1 |
| Max | 2147483647 |

## Type
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Generals/LatencyCompensation/Type |
| Type | ENUM |
| Allowed values | Disabled: 0
KStyle: 1
UserDefined: 2 |
| Default | 0 |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Generals/LatencyCompensation/Value |
| Type | FLOAT |
| Default | 0 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Generals/SignalGenerator/Enable/Value |
| Type | BOOL |
| Default | False |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Generals/SignalGenerator/Gain/Value |
| Type | FLOAT |
| Default | 0.000988553094656939 |
| Min | 0.000988553094656939 |
| Max | 3.9810717055349722 |
| Unit measure | Linear |

## Source Routing
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/RoutingChannel-{0:7}/Src-{0:3}/Value |
| Type | ENUM |
| Allowed values | No_Source: -1
Analog 1: 0
AES3 1: 1
Dante 1: 2
Dante 9: 3
Analog 2: 4
AES3 2: 5
Dante 2: 6
Dante 10: 7
Analog 3: 8
AES3 3: 9
Dante 3: 10
Dante 11: 11
Analog 4: 12
AES3 4: 13
Dante 4: 14
Dante 12: 15
Analog 5: 16
AES3 5: 17
Dante 5: 18
Dante 13: 19
Analog 6: 20
AES3 6: 21
Dante 6: 22
Dante 14: 23
Analog 7: 24
AES3 7: 25
Dante 7: 26
Dante 15: 27
Analog 8: 28
AES3 8: 29
Dante 8: 30
Dante 16: 31 |
| Default | 0 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/Enable/Value |
| Type | BOOL |
| Default | True |

## Priority
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/Priority-{0:3}/Value |
| Type | INT |
| Default | 0 |
| Min | 0 |
| Max | 3 |

## DefaultPriority
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/DefaultPriority/Value |
| Type | INT |
| Default | 0 |
| Min | 0 |
| Max | 3 |

## Manual
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/Manual/Value |
| Type | INT |
| Default | 0 |
| Min | -1 |
| Max | 32 |

## SecondaryManual
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/SecondaryManual/Value |
| Type | INT |
| Default | 0 |
| Min | -1 |
| Max | 32 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/CustomThresholdSignalDetect/Enable/Value |
| Type | BOOL |
| Default | False |

## Src
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/CustomThresholdSignalDetect/Src-{0:3}/Value |
| Type | FLOAT |
| Default | 0.002450765186630494 |
| Min | 0.002450765186630494 |
| Max | 4.358145270225206 |
| Unit measure | Linear |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/PilotTone/Enable/Value |
| Type | BOOL |
| Default | False |

## Low
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/PilotTone/Low/Value |
| Type | FLOAT |
| Default | 1.9920567316458693 |
| Min | 0.002450765186630494 |
| Max | 3.8842010606113595 |
| Unit measure | Linear |

## High
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/PilotTone/High/Value |
| Type | FLOAT |
| Default | 1.9920567316458693 |
| Min | 0.002450765186630494 |
| Max | 3.8842010606113595 |
| Unit measure | Linear |

## Freq
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/PilotTone/Freq/Value |
| Type | FLOAT |
| Default | 20000 |
| Min | 20 |
| Max | 22000 |

## GpioEnable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/BackupStrategy/BackupStrategy-{0:7}/PilotTone/GpioEnable/Value |
| Type | BOOL |
| Default | False |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/AnalogInput/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0 |
| Max | 5.7 |
| Unit measure | Linear |

## Delay
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/AnalogInput/Delay/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 0.15 |
| Unit measure | Seconds |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/NetStreamGroupGain{0:1}/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.003981071705534973 |
| Max | 3.9810717055349722 |
| Unit measure | Linear |

## Delay
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/NetStreamGroupGain{0:1}/Delay/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 0.15 |
| Unit measure | Seconds |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/Generals/DigitalOutRouting-{0:7}/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.000988553094656939 |
| Max | 5.623413251903491 |
| Unit measure | Linear |

## Position
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/Generals/DigitalOutRouting-{0:7}/Position/Value |
| Type | ENUM |
| Allowed values | None: 0
SourceSelection: 1
Matrix: 2
Out: 3
Source: 4
CurrentOut: 5
VoltageOut: 6
SourceMonoMix: 7 |
| Default | 0 |

## Channel
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/Generals/DigitalOutRouting-{0:7}/Channel/Value |
| Type | INT |
| Default | 0 |
| Min | 0 |
| Max | 31 |

## MonomixSecondSource
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SourceSelection/Generals/DigitalOutRouting-{0:7}/MonomixSecondSource/Value |
| Type | INT |
| Default | 0 |
| Min | 0 |
| Max | 31 |

## AdvancedMatrix
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputMatrix/Generals/ExtraControl/Enable/Value |
| Type | BOOL |
| Default | False |

## InGain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputMatrix/InGain-{0:7}/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.001 |
| Max | 5.623413251903491 |
| Unit measure | Linear |

## InMute
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputMatrix/InMute-{0:7}/Value |
| Type | BOOL |
| Default | False |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputMatrix/Channels/Channel-{0:7}/Gain-{0:7}/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.000988553094656939 |
| Max | 1 |
| Unit measure | Linear |

## Mute
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputMatrix/Channels/Channel-{0:7}/Mute-{0:7}/Value |
| Type | BOOL |
| Default | False |

## Connections
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SpeakerLayout/Connections |
| Type | STRING |
| Default | 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 |

## Name
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SpeakerLayout/SpeakerName-{0:7}/Name |
| Type | STRING |
| Default |  |

## Note
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0:7}/Note |
| Type | STRING |
| Default |  |

## Description
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0:7}/Description |
| Type | STRING |
| Default | Preset notes |

## BrandName
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0:7}/BrandName |
| Type | STRING |
| Default | Speaker Brand |

## FamilyName
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0:7}/FamilyName |
| Type | STRING |
| Default | Speaker Family |

## ModelName
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0:7}/ModelName |
| Type | STRING |
| Default | Speaker Model |

## Application
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0:7}/Application |
| Type | STRING |
| Default | Speaker Application |

## Type
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0:7}/Type |
| Type | ENUM |
| Allowed values | LineArray: 0
SingleSub: 1
DoubleSub: 2
PointSource: 3
Wedge: 4
MediumSub: 5
CardioStack: 6
Column: 7
Ceiling: 8
Mover: 9 |
| Default | 3 |

## PresetType
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SpeakerLayout/Speaker-{0:7}/PresetType |
| Type | STRING |
| Default | -1 |

## OEM Description
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/SpeakerLayout/SpeakerOemFields-{0:7}/Name |
| Type | STRING |
| Default |  |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.001 |
| Max | 5.623413251903491 |
| Unit measure | Linear |

## ShadingGain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/ShadingGain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.251188643150958 |
| Max | 1 |
| Unit measure | Linear |

## InPolarity
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InPolarity/Value |
| Type | BOOL |
| Default | False |

## Mute
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/Mute/Value |
| Type | BOOL |
| Default | False |

## MaxCurrentDraw
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Generals/MaxCurrentDraw/Value |
| Type | FLOAT |
| Default | 20 |
| Min | 10 |
| Max | 20 |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InDelay/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 2 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InDelay/Enable/Value |
| Type | BOOL |
| Default | True |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InputEQ/Enable/Value |
| Type | BOOL |
| Default | True |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InputEQ/Filter/Filter-{0:95}/Enable |
| Type | BOOL |
| Default | False |

## Type
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InputEQ/Filter/Filter-{0:95}/Type/Value |
| Type | ENUM |
| Allowed values | Empty: 0
Flat: 2147483648
ShelfAEnabled: 2147483649
HighShelfFilter: 2147483649
ShelfAIsLowShelf: 2147483650
LowShelfFilter: 2147483651
ShelfBEnabled: 2147483652
ShelfBIsLowShelf: 2147483656
ShelfTypeLinked: 2147483664
GainLinked: 2147483680
GainLinkedToOpposite: 2147483744
MesaFilter: 2147483765
SlopeLinked: 2147483776
ComputeFrequencyB: 2147483904
RaisedCosineFilter: 2147484149
HighBoundaryShelfFilter: 2147549185
LowBoundaryShelfFilter: 2147549187 |
| Default | 2147483648 |

## Flags
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InputEQ/Filter/Filter-{0:95}/Flags/Value |
| Type | INT |
| Default | 0 |

## Freq1
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InputEQ/Filter/Filter-{0:95}/Freq1/Value |
| Type | FLOAT |
| Default | 1000 |
| Min | 20 |
| Max | 20000 |

## Gain1
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InputEQ/Filter/Filter-{0:95}/Gain1/Value |
| Type | FLOAT |
| Default | 0 |
| Min | -15 |
| Max | 15 |

## Slope1
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InputEQ/Filter/Filter-{0:95}/Slope1/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.1 |
| Max | 10 |

## Freq2
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InputEQ/Filter/Filter-{0:95}/Freq2/Value |
| Type | FLOAT |
| Default | 1000 |
| Min | 20 |
| Max | 20000 |

## Gain2
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InputEQ/Filter/Filter-{0:95}/Gain2/Value |
| Type | FLOAT |
| Default | 0 |
| Min | -15 |
| Max | 15 |

## Slope2
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/InputProcess/Channels/Channel-{0:7}/InputEQ/Filter/Filter-{0:95}/Slope2/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.1 |
| Max | 10 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/Enable |
| Type | BOOL |
| Default | False |

## Guid
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/Guid |
| Type | STRING |
| Default |  |

## Name
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/Name |
| Type | STRING |
| Default |  |

## Type
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/Type |
| Type | INT |
| Default | 0 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/InputEQ/Filter/Filter-{0:95}/Enable |
| Type | BOOL |
| Default | False |

## Type
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/InputEQ/Filter/Filter-{0:95}/Type/Value |
| Type | ENUM |
| Allowed values | Empty: 0
Flat: 2147483648
ShelfAEnabled: 2147483649
HighShelfFilter: 2147483649
ShelfAIsLowShelf: 2147483650
LowShelfFilter: 2147483651
ShelfBEnabled: 2147483652
ShelfBIsLowShelf: 2147483656
ShelfTypeLinked: 2147483664
GainLinked: 2147483680
GainLinkedToOpposite: 2147483744
MesaFilter: 2147483765
SlopeLinked: 2147483776
ComputeFrequencyB: 2147483904
RaisedCosineFilter: 2147484149
HighBoundaryShelfFilter: 2147549185
LowBoundaryShelfFilter: 2147549187 |
| Default | 2147483648 |

## Flags
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/InputEQ/Filter/Filter-{0:95}/Flags/Value |
| Type | INT |
| Default | 0 |

## Freq1
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/InputEQ/Filter/Filter-{0:95}/Freq1/Value |
| Type | FLOAT |
| Default | 1000 |
| Min | 20 |
| Max | 20000 |

## Gain1
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/InputEQ/Filter/Filter-{0:95}/Gain1/Value |
| Type | FLOAT |
| Default | 0 |
| Min | -15 |
| Max | 15 |

## Slope1
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/InputEQ/Filter/Filter-{0:95}/Slope1/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.1 |
| Max | 10 |
# Amplifier Settings — Extracted Tables (topics 75..109)
Source: https://download.powersoft.it/temp/Unica/3dparty/amplifierSettings.html


## Freq2
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/InputEQ/Filter/Filter-{0:95}/Freq2/Value |
| Type | FLOAT |
| Default | 1000 |
| Min | 20 |
| Max | 20000 |

## Gain2
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/InputEQ/Filter/Filter-{0:95}/Gain2/Value |
| Type | FLOAT |
| Default | 0 |
| Min | -15 |
| Max | 15 |

## Slope2
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/InputEQ/Filter/Filter-{0:95}/Slope2/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.1 |
| Max | 10 |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/Mute/Value |
| Type | BOOL |
| Default | False |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.001 |
| Max | 5.623413251903491 |
| Unit measure | Linear |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/InDelay/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 2 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/InDelay/Enable |
| Type | BOOL |
| Default | True |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/InputProcess/Channels/Channel-{0:7}/Groups/Group-{0:7}/InPolarity/Value |
| Type | BOOL |
| Default | False |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.001 |
| Max | 5.623413251903491 |
| Unit measure | Linear |

## Polarity
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/Polarity/Value |
| Type | BOOL |
| Default | False |

## Mute
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/Mute/Value |
| Type | BOOL |
| Default | False |

## IsHighZActive
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/IsHighZActive/Value |
| Type | BOOL |
| Default | False |

## FilterNameA
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/FilterNameA |
| Type | STRING |
| Default |  |

## FilterNameB
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/FilterNameB |
| Type | STRING |
| Default |  |

## FilterNameC
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/FilterNameC |
| Type | STRING |
| Default |  |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/Delay/Enable |
| Type | BOOL |
| Default | True |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/Delay/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 2 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/FIR/Enable |
| Type | BOOL |
| Default | False |

## Taps number
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/FIR/nTaps |
| Type | INT |
| Default | 2048 |

## Taps
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/FIR/Taps |
| Type | FLOAT[] |
| Default | FLOAT[2048] |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/XOver/XOver-{0:1}/Enable |
| Type | BOOL |
| Default | False |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/XOver/XOver-{0:1}/Type/Value |
| Type | ENUM |
| Allowed values | Butterworth: 0
Bessel: 1
LinkwitzRiley: 2
FIR: 3
HybridFIR: 4 |
| Default | 0 |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/XOver/XOver-{0:1}/Fc/Value |
| Type | FLOAT |
| Default | 1000 |
| Min | 10 |
| Max | 24675 |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/XOver/XOver-{0:1}/Slope/Value |
| Type | FLOAT |
| Default | 24 |
| Min | 6 |
| Max | 48 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/IIR/IIR-{0:7}/Enable |
| Type | BOOL |
| Default | False |

## Type
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/IIR/IIR-{0:7}/Type/Value |
| Type | ENUM |
| Allowed values | Peaking: 0
LowShelving6: 1
HighShelving6: 2
LowShelving12: 3
HighShelving12: 4
LowShelving3: 5
HighShelving3: 6
LowShelving9: 7
HighShelving9: 8
LowShelving15: 9
HighShelving15: 10
LowShelving: 11
HighShelving: 12
LowPass: 13
HighPass: 14
BandPass: 15
BandStop: 16
AllPass: 17 |
| Default | 0 |

## Fc
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/IIR/IIR-{0:7}/Fc/Value |
| Type | FLOAT |
| Default | 1000 |
| Min | 20 |
| Max | 20000 |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/IIR/IIR-{0:7}/Gain/Value |
| Type | FLOAT |
| Default | 0 |
| Min | -15 |
| Max | 15 |

## Q
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/IIR/IIR-{0:7}/Q/Value |
| Type | FLOAT |
| Default | 1.4 |
| Min | 0.1 |
| Max | 30 |

## Slope
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/IIR/IIR-{0:7}/Slope/Value |
| Type | FLOAT |
| Default | 0.5 |
| Min | 0.25 |
| Max | 1.25 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/DryOutput/Enable |
| Type | BOOL |
| Default | False |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/DryOutput/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.003981071705534973 |
| Max | 1 |
| Unit measure | Linear |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/SubHarmonic/Enable |
| Type | BOOL |
| Default | False |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/SubHarmonic/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.003981071705534973 |
| Max | 1 |
| Unit measure | Linear |

## LowPassSlope
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/SubHarmonic/LowPassSlope/Value |
| Type | ENUM |
| Allowed values | _6: 6
_12: 12
_18: 18
_24: 24 |
| Default | 12 |
# Amplifier Settings — Extracted Tables (topics 110..149)
Source: https://download.powersoft.it/temp/Unica/3dparty/amplifierSettings.html


## LowPassFc
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/SubHarmonic/LowPassFc/Value |
| Type | FLOAT |
| Default | 40 |
| Min | 30 |
| Max | 80 |

## HiPassFc
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/SubHarmonic/HiPassFc/Value |
| Type | FLOAT |
| Default | 20 |
| Min | 10 |
| Max | 60 |

## HiPassSlope
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/SubHarmonic/HiPassSlope/Value |
| Type | ENUM |
| Allowed values | _6: 6
_12: 12
_18: 18
_24: 24 |
| Default | 6 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/Harmonic/Enable |
| Type | BOOL |
| Default | False |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/Harmonic/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.003981071705534973 |
| Max | 1 |
| Unit measure | Linear |

## LowPassSlope
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/Harmonic/LowPassSlope/Value |
| Type | ENUM |
| Allowed values | _6: 6
_12: 12
_18: 18
_24: 24 |
| Default | 12 |

## LowPassFc
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/Harmonic/LowPassFc/Value |
| Type | FLOAT |
| Default | 80 |
| Min | 40 |
| Max | 160 |

## HiPassFc
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/Harmonic/HiPassFc/Value |
| Type | FLOAT |
| Default | 40 |
| Min | 20 |
| Max | 140 |

## Mode
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/PreOutputProcess/Channels/Channel-{0:7}/HarmonicGenerator/Harmonic/Mode |
| Type | ENUM |
| Allowed values | Mode1: 0
Mode2: 1
Mode3: 2 |
| Default | 0 |

## Name
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/Name |
| Type | STRING |
| Default |  |

## Bridge
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/Bridge/Value |
| Type | BOOL |
| Default | False |

## Mute
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/Mute/Value |
| Type | BOOL |
| Default | False |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.001 |
| Max | 5.623413251903491 |
| Unit measure | Linear |

## OutPolarity
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/OutPolarity/Value |
| Type | BOOL |
| Default | False |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/OutDelay/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 0.1 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/OutDelay/Enable |
| Type | BOOL |
| Default | True |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/FIR/Enable |
| Type | BOOL |
| Default | False |

## Taps number
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/FIR/nTaps |
| Type | INT |
| Default | 2048 |

## Taps
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/FIR/Taps |
| Type | FLOAT[] |
| Default | FLOAT[2048] |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/XOver/XOver-{0:1}/Enable |
| Type | BOOL |
| Default | False |

## Type
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/XOver/XOver-{0:1}/Type/Value |
| Type | ENUM |
| Allowed values | Butterworth: 0
Bessel: 1
LinkwitzRiley: 2
FIR: 3
HybridFIR: 4 |
| Default | 0 |

## Fc
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/XOver/XOver-{0:1}/Fc/Value |
| Type | FLOAT |
| Default | 1000 |
| Min | 10 |
| Max | 24675 |

## Slope
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/XOver/XOver-{0:1}/Slope/Value |
| Type | FLOAT |
| Default | 24 |
| Min | 6 |
| Max | 48 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/IIR/IIR-{0:15}/Enable |
| Type | BOOL |
| Default | False |

## Type
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/IIR/IIR-{0:15}/Type/Value |
| Type | ENUM |
| Allowed values | Peaking: 0
LowShelving6: 1
HighShelving6: 2
LowShelving12: 3
HighShelving12: 4
LowShelving3: 5
HighShelving3: 6
LowShelving9: 7
HighShelving9: 8
LowShelving15: 9
HighShelving15: 10
LowShelving: 11
HighShelving: 12
LowPass: 13
HighPass: 14
BandPass: 15
BandStop: 16
AllPass: 17 |
| Default | 0 |

## Fc
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/IIR/IIR-{0:15}/Fc/Value |
| Type | FLOAT |
| Default | 1000 |
| Min | 20 |
| Max | 20000 |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/IIR/IIR-{0:15}/Gain/Value |
| Type | FLOAT |
| Default | 0 |
| Min | -15 |
| Max | 15 |

## Q
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/IIR/IIR-{0:15}/Q/Value |
| Type | FLOAT |
| Default | 1.4 |
| Min | 0.1 |
| Max | 30 |

## Slope
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/IIR/IIR-{0:15}/Slope/Value |
| Type | FLOAT |
| Default | 0.5 |
| Min | 0.25 |
| Max | 1.25 |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/TruePowerLimiter/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.001 |
| Max | 5.623413251903491 |
| Unit measure | Linear |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/TruePowerLimiter/Enable |
| Type | BOOL |
| Default | False |

## Threshold
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/TruePowerLimiter/Threshold/Value |
| Type | FLOAT |
| Default | 3500 |
| Min | 40 |
| Max | 7000 |

## AttackTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/TruePowerLimiter/AttackTime/Value |
| Type | FLOAT |
| Default | 2 |
| Min | 0.1 |
| Max | 30 |

## ReleaseTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/TruePowerLimiter/ReleaseTime/Value |
| Type | FLOAT |
| Default | 4 |
| Min | 0.2 |
| Max | 30 |

## HoldTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/TruePowerLimiter/HoldTime/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 30 |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/CurrentLimiterRMS/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.001 |
| Max | 5.623413251903491 |
| Unit measure | Linear |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/CurrentLimiterRMS/Enable |
| Type | BOOL |
| Default | False |

## Threshold
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/CurrentLimiterRMS/Threshold/Value |
| Type | FLOAT |
| Default | 80 |
| Min | 0.1 |
| Max | 80 |

## AttackTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/CurrentLimiterRMS/AttackTime/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.01 |
| Max | 30 |

## ReleaseTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/CurrentLimiterRMS/ReleaseTime/Value |
| Type | FLOAT |
| Default | 4 |
| Min | 0.01 |
| Max | 30 |
# Amplifier Settings — Extracted Tables (topics 150..179)
Source: https://download.powersoft.it/temp/Unica/3dparty/amplifierSettings.html


## HoldTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/CurrentLimiterRMS/HoldTime/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 30 |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/CurrentClamp/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.001 |
| Max | 5.623413251903491 |
| Unit measure | Linear |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/CurrentClamp/Enable |
| Type | BOOL |
| Default | False |

## Threshold
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/CurrentClamp/Threshold/Value |
| Type | FLOAT |
| Default | 10 |
| Min | 0.1 |
| Max | 150 |

## AttackTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/CurrentClamp/AttackTime/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 30 |

## ReleaseTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/CurrentClamp/ReleaseTime/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 30 |

## HoldTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/CurrentClamp/HoldTime/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 30 |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/ClipLimiter/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.001 |
| Max | 5.623413251903491 |
| Unit measure | Linear |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/ClipLimiter/Enable |
| Type | BOOL |
| Default | False |

## Threshold
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/ClipLimiter/Threshold/Value |
| Type | FLOAT |
| Default | 80 |
| Min | 10 |
| Max | 400 |

## AttackTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/ClipLimiter/AttackTime/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 30 |

## ReleaseTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/ClipLimiter/ReleaseTime/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 30 |

## HoldTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/ClipLimiter/HoldTime/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 30 |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.001 |
| Max | 5.623413251903491 |
| Unit measure | Linear |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/Enable |
| Type | BOOL |
| Default | False |

## Threshold
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/Threshold/Value |
| Type | FLOAT |
| Default | 150 |
| Min | 10 |
| Max | 300 |

## AttackTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/AttackTime/Value |
| Type | FLOAT |
| Default | 0.2 |
| Min | 0.01 |
| Max | 30 |

## ReleaseTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/ReleaseTime/Value |
| Type | FLOAT |
| Default | 0.8 |
| Min | 0.01 |
| Max | 30 |

## HoldTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/HoldTime/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 30 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/IIR/IIR-{0:1}/Enable |
| Type | BOOL |
| Default | False |

## Type
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/IIR/IIR-{0:1}/Type/Value |
| Type | ENUM |
| Allowed values | Peaking: 0
LowShelving6: 1
HighShelving6: 2
LowShelving12: 3
HighShelving12: 4
LowShelving3: 5
HighShelving3: 6
LowShelving9: 7
HighShelving9: 8
LowShelving15: 9
HighShelving15: 10
LowShelving: 11
HighShelving: 12
LowPass: 13
HighPass: 14
BandPass: 15
BandStop: 16
AllPass: 17 |
| Default | 0 |

## Fc
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/IIR/IIR-{0:1}/Fc/Value |
| Type | FLOAT |
| Default | 1000 |
| Min | 20 |
| Max | 20000 |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/IIR/IIR-{0:1}/Gain/Value |
| Type | FLOAT |
| Default | 0 |
| Min | -15 |
| Max | 15 |

## Q
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/IIR/IIR-{0:1}/Q/Value |
| Type | FLOAT |
| Default | 1.4 |
| Min | 0.1 |
| Max | 30 |

## Slope
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/IIR/IIR-{0:1}/Slope/Value |
| Type | FLOAT |
| Default | 0.5 |
| Min | 0.25 |
| Max | 1.25 |

## Threshold
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/SoftKnee/Threshold/Value |
| Type | FLOAT |
| Default | 0.7079457843841379 |
| Min | 0.5011872336272722 |
| Max | 1 |
| Unit measure | Linear |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/VoltageLimiterRMS/SoftKnee/Enable |
| Type | BOOL |
| Default | False |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/Gain/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.001 |
| Max | 5.623413251903491 |
| Unit measure | Linear |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/Enable |
| Type | BOOL |
| Default | False |

## Threshold
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/Threshold/Value |
| Type | FLOAT |
| Default | 200 |
| Min | 10 |
| Max | 380 |
# Amplifier Settings — Extracted Tables (topics 180..209)
Source: https://download.powersoft.it/temp/Unica/3dparty/amplifierSettings.html


## AttackTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/AttackTime/Value |
| Type | FLOAT |
| Default | 0.002 |
| Min | 0.0003 |
| Max | 2 |
| Unit measure | Seconds |

## ReleaseTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/ReleaseTime/Value |
| Type | FLOAT |
| Default | 0.032 |
| Min | 0.003 |
| Max | 8 |
| Unit measure | Seconds |

## HoldTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/HoldTime/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 30 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/IIR/IIR-{0:1}/Enable |
| Type | BOOL |
| Default | False |

## Type
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/IIR/IIR-{0:1}/Type/Value |
| Type | ENUM |
| Allowed values | Peaking: 0
LowShelving6: 1
HighShelving6: 2
LowShelving12: 3
HighShelving12: 4
LowShelving3: 5
HighShelving3: 6
LowShelving9: 7
HighShelving9: 8
LowShelving15: 9
HighShelving15: 10
LowShelving: 11
HighShelving: 12
LowPass: 13
HighPass: 14
BandPass: 15
BandStop: 16
AllPass: 17 |
| Default | 0 |

## Fc
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/IIR/IIR-{0:1}/Fc/Value |
| Type | FLOAT |
| Default | 1000 |
| Min | 20 |
| Max | 20000 |

## Gain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/IIR/IIR-{0:1}/Gain/Value |
| Type | FLOAT |
| Default | 0 |
| Min | -15 |
| Max | 15 |

## Q
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/IIR/IIR-{0:1}/Q/Value |
| Type | FLOAT |
| Default | 1.4 |
| Min | 0.1 |
| Max | 30 |

## Slope
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/IIR/IIR-{0:1}/Slope/Value |
| Type | FLOAT |
| Default | 0.5 |
| Min | 0.25 |
| Max | 1.25 |

## Threshold
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/SoftKnee/Threshold/Value |
| Type | FLOAT |
| Default | 0.7079457843841379 |
| Min | 0.5011872336272722 |
| Max | 1 |
| Unit measure | Linear |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PeakLimiter/SoftKnee/Enable |
| Type | BOOL |
| Default | False |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/Enable |
| Type | BOOL |
| Default | False |

## FilterType
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/FilterType/Value |
| Type | ENUM |
| Allowed values | Peaking: 0
LowShelving6: 1
HighShelving6: 2
LowShelving12: 3
HighShelving12: 4
LowShelving3: 5
HighShelving3: 6
LowShelving9: 7
HighShelving9: 8
LowShelving15: 9
HighShelving15: 10
LowShelving: 11
HighShelving: 12
LowPass: 13
HighPass: 14
BandPass: 15
BandStop: 16
AllPass: 17 |
| Default | 0 |

## Fc
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/Fc/Value |
| Type | FLOAT |
| Default | 1000 |
| Min | 20 |
| Max | 20000 |

## MinGain
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/MinGain/Value |
| Type | FLOAT |
| Default | -1 |
| Min | -25 |
| Max | -1 |

## Q
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/Q/Value |
| Type | FLOAT |
| Default | 1.4 |
| Min | 0.1 |
| Max | 30 |

## Slope
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/Slope/Value |
| Type | FLOAT |
| Default | 12 |
| Min | 6 |
| Max | 24 |

## Threshold
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/Threshold/Value |
| Type | FLOAT |
| Default | 20 |
| Min | 0.1 |
| Max | 380 |

## AttackTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/AttackTime/Value |
| Type | FLOAT |
| Default | 0.01 |
| Min | 0.0003 |
| Max | 30 |

## ReleaseTime
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/ReleaseTime/Value |
| Type | FLOAT |
| Default | 0.01 |
| Min | 0.003 |
| Max | 30 |

## LimiterType
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/LimiterType/Value |
| Type | ENUM |
| Allowed values | Peak: 0
RMS: 1 |
| Default | 0 |

## Position
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/Position/Value |
| Type | ENUM |
| Allowed values | PreRmsLimiter: 0
PostRmsLimiter: 1
PostPeakLimiter: 2 |
| Default | 2 |

## Subposition
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/Subposition/Value |
| Type | ENUM |
| Allowed values | First: 0
Second: 1
Third: 2 |
| Default | 0 |

## Ratio
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/DynamicEq/DYNAMICEQ-{0:2}/Ratio/Value |
| Type | FLOAT |
| Default | 0.25 |
| Min | 0 |
| Max | 1 |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/Feedloop/Value |
| Type | FLOAT |
| Default | 0 |
| Min | -2 |
| Max | 2 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/Feedloop/Enable |
| Type | BOOL |
| Default | False |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PilotToneGenerator/Enable/Value |
| Type | BOOL |
| Default | False |

## Freq
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PilotToneGenerator/Freq/Value |
| Type | FLOAT |
| Default | 20000 |
| Min | 20 |
| Max | 22000 |

## Amplitude
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PilotToneGenerator/Amplitude/Value |
| Type | FLOAT |
| Default | 2 |
| Min | 0.1 |
| Max | 40 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PilotTone/Enable/Value |
| Type | BOOL |
| Default | False |
# Amplifier Settings — Extracted Tables (topics 210..224)
Source: https://download.powersoft.it/temp/Unica/3dparty/amplifierSettings.html


## Low
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PilotTone/Low/Value |
| Type | FLOAT |
| Default | 1.2 |
| Min | 0.1 |
| Max | 40 |

## High
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PilotTone/High/Value |
| Type | FLOAT |
| Default | 1.8 |
| Min | 0.1 |
| Max | 40 |

## Freq
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/PilotTone/Freq/Value |
| Type | FLOAT |
| Default | 20000 |
| Min | 20 |
| Max | 22000 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/LoadMonitor/Enable/Value |
| Type | BOOL |
| Default | False |

## Low
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/LoadMonitor/Low/Value |
| Type | FLOAT |
| Default | 2 |
| Min | 1 |
| Max | 500 |

## High
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/LoadMonitor/High/Value |
| Type | FLOAT |
| Default | 16 |
| Min | 1 |
| Max | 500 |

## Freq
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/LoadMonitor/Freq/Value |
| Type | FLOAT |
| Default | 20000 |
| Min | 20 |
| Max | 22000 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/NominalImpedance/Enable/Value |
| Type | BOOL |
| Default | False |

## Low
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/NominalImpedance/Low/Value |
| Type | FLOAT |
| Default | 2 |
| Min | 1 |
| Max | 500 |

## High
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/OutputProcess/Channels/Channel-{0:7}/NominalImpedance/High/Value |
| Type | FLOAT |
| Default | 16 |
| Min | 1 |
| Max | 500 |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0:7}/AuxAttenuation/Value |
| Type | FLOAT |
| Default | 1 |
| Min | 0.001 |
| Max | 1 |
| Unit measure | Linear |

## Value
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0:7}/AuxDelay/Value |
| Type | FLOAT |
| Default | 0 |
| Min | 0 |
| Max | 0.1 |

## Enable
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/Extra/OutputProcess/Channels/Channel-{0:7}/AuxDelay/Enable |
| Type | BOOL |
| Default | False |

## Active Snapshot
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/ReadOnly/SnapshotSlotId/Current |
| Type | INT |
| Default | -1 |

## Snapshot modified
| Field | Value |
|---|---|
| Key | /Device/Audio/Presets/Live/ReadOnly/SnapshotSlotId/Modified |
| Type | INT |
| Default | 0 |
