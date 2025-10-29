# PLC Motor Control - Usage Guide

## Interface Overview

The application features a main menu with two sections:

### Left Side - CIRCUITS
Choose from four motor control circuits:
1. **Direct-On-Line** - Simple full voltage starting
2. **Wye-Delta** - Reduced voltage starting method
3. **Forward Reverse** - Bidirectional motor control
4. **Cyclic Forward Reverse** - Automated reversing cycles

### Right Side - INPUTS
Access different learning and control modes:
1. **Tutorials** - Learn about PLC motor control
2. **Simulator** - Interactive circuit simulation
3. **Laboratory Works** - Hands-on experiments
4. **Assessment Modules** - Test your knowledge
5. **Video Demonstration** - Watch circuit operations

## Getting Started

### 1. Initial Setup

1. **Start the Backend Server**
   ```bash
   npm run dev:backend
   ```
   Wait for: `Server running on port 3001`

2. **Start the Frontend Application**
   ```bash
   cd frontend
   npm run dev
   ```
   The Electron window will open automatically.

3. **Configure Connection** (First Time Only)
   - Click the **⚙️ Settings** button in the top-right
   - The default WebSocket URL is `ws://localhost:3001`
   - Click **"Connect to Server"**
   - Status should show green indicators

4. **Connect to Arduino/PLC**
   - In Settings, click **🔄 Refresh** to scan for serial ports
   - Select your Arduino's port from the dropdown
   - Choose baud rate (default: 9600)
   - Click **"Connect to PLC"**
   - Both status indicators should now be green

### 2. Using the Main Menu

#### Selecting a Circuit

Click on any circuit button on the left:
- **Direct-On-Line** - For simple on/off motor control
- **Wye-Delta** - For reduced voltage starting applications
- **Forward Reverse** - For bidirectional motor applications
- **Cyclic Forward Reverse** - For automated reversing operations

The selected circuit will be highlighted in gold.

#### Accessing Features

Click on any input button on the right:
- **Tutorials** - Opens educational content (to be implemented)
- **Simulator** - Opens the real-time monitoring interface
- **Laboratory Works** - Access lab exercises (to be implemented)
- **Assessment Modules** - Take quizzes and tests (to be implemented)
- **Video Demonstration** - Watch instructional videos (to be implemented)

### 3. Using the Simulator

After selecting a circuit and clicking **Simulator**:

#### Command Panel (Left Side)

**Base Motor Commands** (Available for all circuits):
- ▶️ **Start Motor** - Energize the motor
- ⏹️ **Stop Motor** - De-energize the motor
- 🛑 **Emergency Stop** - Immediate shutdown
- 🔄 **Reset** - Reset the system
- 📊 **Status** - Request current status

**Circuit-Specific Commands**:

**Direct-On-Line:**
- ⚡ **Full Voltage Start** - DOL starting sequence

**Wye-Delta:**
- Y **Wye Start** - Start in Wye configuration
- Δ **Delta Run** - Switch to Delta configuration
- 🔀 **Auto Transition** - Enable automatic Wye-to-Delta transition

**Forward-Reverse:**
- ➡️ **Forward** - Run motor in forward direction
- ⬅️ **Reverse** - Run motor in reverse direction
- 🔒 **Interlock Check** - Verify interlock safety

**Cyclic Forward-Reverse:**
- 🔁 **Start Cycle** - Begin automatic cycling
- ⏸️ **Pause Cycle** - Pause the cycle
- ⏱️ **Set Interval** - Configure cycle timing

#### Data Monitor (Right Side)

- **Table View** - Organized display of PLC data with timestamps
- **Raw View** - JSON format of all received data
- Real-time updates as data arrives from the PLC
- Stores last 100 data entries

### 4. Custom Commands

In the Command Panel:
1. Type your custom command in the text field
2. Press **Enter** or click **Send**
3. Watch the response in the Data Monitor

Example custom commands:
```
START
STOP
STATUS
READ_ALL
CIRCUIT:direct-on-line
```

## Circuit Operations

### Direct-On-Line (DOL)

**Purpose**: Simple full voltage motor starting

**Operation**:
1. Select "Direct-On-Line" circuit
2. Click "Simulator"
3. Click "Full Voltage Start" or "Start Motor"
4. Motor receives full line voltage immediately
5. Click "Stop Motor" to stop

**Use Cases**:
- Small motors (< 5 HP)
- Applications where starting current is not a concern
- Simple on/off control

### Wye-Delta

**Purpose**: Reduced voltage starting to limit inrush current

**Operation**:
1. Select "Wye-Delta" circuit
2. Click "Simulator"
3. Click "Wye Start" - Motor starts in Wye configuration (reduced voltage)
4. Click "Delta Run" - Motor switches to Delta (full voltage)
5. Or use "Auto Transition" for automatic switching

**Use Cases**:
- Medium to large motors (5-50 HP)
- Limited power supply capacity
- Reducing mechanical stress during startup

### Forward-Reverse

**Purpose**: Bidirectional motor control with safety interlocking

**Operation**:
1. Select "Forward Reverse" circuit
2. Click "Simulator"
3. Click "Forward" - Motor runs forward
4. Click "Stop Motor" - Must stop before reversing
5. Click "Reverse" - Motor runs in reverse
6. "Interlock Check" verifies safety interlocks

**Use Cases**:
- Conveyor systems
- Hoists and cranes
- Machine tools

### Cyclic Forward-Reverse

**Purpose**: Automated reversing cycles for repetitive operations

**Operation**:
1. Select "Cyclic Forward Reverse" circuit
2. Click "Simulator"
3. Click "Set Interval" - Configure cycle timing
4. Click "Start Cycle" - Begin automatic cycling
5. Click "Pause Cycle" - Temporarily stop
6. Click "Stop Motor" - End cycling

**Use Cases**:
- Mixing applications
- Agitators
- Automated material handling

## Monitoring Data

### Understanding the Data Display

**Table View**:
- **Timestamp**: When the data was received
- **Data**: The actual values from the PLC

**Typical Data Fields**:
```json
{
  "timestamp": 12345,
  "running": true,
  "sensorRaw": 512,
  "voltage": 2.50,
  "temperature": 25,
  "pressure": 105
}
```

### Command History

The Command Panel shows:
- Last 20 commands sent
- Timestamp for each command
- Click on a previous command to resend (future feature)

## Troubleshooting

### Connection Issues

**WebSocket Not Connected**:
1. Verify backend server is running
2. Check the URL is `ws://localhost:3001`
3. Look for firewall blocking port 3001

**Serial Port Not Connected**:
1. Ensure Arduino is plugged in
2. Close Arduino IDE Serial Monitor
3. Refresh the port list
4. Verify correct baud rate (9600)
5. Check USB cable connection

### No Data Appearing

1. Verify both connections are green
2. Check Arduino Serial Monitor to confirm it's sending data
3. Try sending a "STATUS" or "READ_ALL" command
4. Check browser console for errors (Ctrl+Shift+I)

### Commands Not Working

1. Ensure serial connection is established
2. Verify Arduino code is uploaded and running
3. Check command spelling (case-insensitive)
4. Look for error messages in Data Monitor

## Tips and Best Practices

1. **Always Stop Before Reversing**: In Forward-Reverse mode, always stop the motor before changing direction

2. **Use Emergency Stop**: The E-Stop button provides immediate shutdown in any situation

3. **Monitor Data**: Keep an eye on the Data Monitor for system feedback and errors

4. **Check Status Regularly**: Use the Status command to verify system state

5. **Understand Interlocks**: Forward-Reverse circuits have safety interlocks to prevent simultaneous forward and reverse

6. **Wye-Delta Timing**: Allow sufficient time in Wye mode before transitioning to Delta (typically 3-5 seconds)

## Keyboard Shortcuts

- **Enter** - Send custom command
- **Ctrl+Shift+I** - Open developer tools (Electron)
- **Esc** - Close current view (future feature)

## Next Steps

- Explore each circuit type
- Try different command sequences
- Monitor the data responses
- Experiment with custom commands
- Upload your own Arduino code for custom circuits

For more information, see:
- README.md - Complete documentation
- QUICKSTART.md - Quick setup guide
- PROJECT_SUMMARY.md - Technical details

