# PLC Machine Control (PLC-MC)

A full-stack educational application for PLC (Programmable Logic Controller) motor control circuits via Arduino using serial communication.

## Overview

This application provides an interactive learning platform for understanding and simulating various motor control circuits commonly used in industrial automation:

- **Direct-On-Line (DOL)** - Full voltage motor starting
- **Wye-Delta** - Reduced voltage starting method
- **Forward-Reverse** - Bidirectional motor control
- **Cyclic Forward-Reverse** - Automated reversing cycles

## Architecture

```
Arduino/PLC (Serial) ⇄ Node.js Backend Server ⇄ Electron Frontend (React)
```

### Components

1. **Backend Server (Node.js)**
   - Handles serial communication with Arduino/PLC
   - Exposes REST API for configuration
   - Provides WebSocket server for real-time bidirectional communication
   - Built with Express, WebSocket (ws), and SerialPort

2. **Frontend (Electron + React)**
   - Desktop application built with Electron
   - React-based UI for monitoring and control
   - Real-time data display from PLC
   - Command interface for sending instructions to PLC

3. **Hardware Integration**
   - Connects to Arduino/PLC via serial port
   - Supports configurable baud rates
   - Line-based protocol (newline-delimited)

## Features

### Educational Features
- 📚 **Tutorials** - Interactive learning modules
- 🖥️ **Simulator** - Real-time circuit simulation
- 🔬 **Laboratory Works** - Hands-on experiments
- 📝 **Assessment Modules** - Knowledge testing
- 🎥 **Video Demonstrations** - Visual learning aids

### Motor Control Circuits
- ⚡ **Direct-On-Line (DOL)** - Full voltage starting
- 🔀 **Wye-Delta** - Reduced voltage starting with automatic transition
- ↔️ **Forward-Reverse** - Bidirectional control with interlocking
- 🔁 **Cyclic Forward-Reverse** - Automated reversing cycles

### Technical Features
- ✅ Real-time bidirectional communication
- ✅ WebSocket-based data streaming
- ✅ Serial port auto-discovery
- ✅ Configurable connection settings
- ✅ Circuit-specific command sets
- ✅ Command history tracking
- ✅ Live data monitoring
- ✅ Cross-platform support (Windows, macOS, Linux)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Arduino/PLC connected via USB/Serial

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd plc-mc
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Configure environment**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env and configure your serial port (optional)
   # You can also configure this through the UI
   ```

## Usage

### Running the Backend Server

```bash
# Production mode
npm run backend

# Development mode (with auto-reload)
npm run dev:backend
```

The server will start on `http://localhost:3001` (or the port specified in `.env`)

### Running the Frontend (Electron App)

```bash
# Production mode
npm run frontend

# Development mode (with hot reload)
cd frontend
npm run dev
```

### Running Both Simultaneously

For development, you can run both in separate terminals:

**Terminal 1 (Backend):**
```bash
npm run dev:backend
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## API Endpoints

### REST API

- `GET /health` - Health check endpoint
- `GET /api/ports` - List available serial ports
- `GET /api/status` - Get current connection status
- `POST /api/connect` - Connect to a serial port
  ```json
  {
    "port": "/dev/ttyUSB0",
    "baudRate": 9600
  }
  ```
- `POST /api/disconnect` - Disconnect from serial port
- `POST /api/command` - Send command to PLC
  ```json
  {
    "command": "START"
  }
  ```

### WebSocket Messages

**Client → Server:**
```json
{
  "type": "command",
  "payload": "START"
}
```

**Server → Client:**
```json
{
  "type": "plcData",
  "data": { "raw": "sensor_value: 123" },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Arduino/PLC Protocol

The system expects line-based communication (newline-delimited messages).

### Example Arduino Code

See `arduino/example_plc.ino` for a complete example.

**Basic structure:**
```cpp
void setup() {
  Serial.begin(9600);
}

void loop() {
  // Send data to Node.js
  Serial.println("sensor_value: 123");
  
  // Read commands from Node.js
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    // Process command
  }
  
  delay(1000);
}
```

### Data Format

**Plain text:**
```
sensor_value: 123
```

**JSON (recommended):**
```json
{"temperature": 25.5, "pressure": 101.3, "status": "OK"}
```

## Project Structure

```
plc-mc/
├── backend/
│   ├── server.js                 # Main server file
│   ├── routes/
│   │   └── api.js               # REST API routes
│   └── services/
│       └── serialCommunication.js # Serial port handler
├── frontend/
│   ├── electron/
│   │   └── main.js              # Electron main process
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   ├── components/          # React components
│   │   │   ├── ConnectionPanel.jsx
│   │   │   ├── CommandPanel.jsx
│   │   │   ├── DataDisplay.jsx
│   │   │   └── StatusBar.jsx
│   │   └── hooks/
│   │       └── useWebSocket.js  # WebSocket hook
│   ├── package.json
│   └── vite.config.js
├── arduino/
│   └── example_plc.ino          # Example Arduino code
├── package.json
├── .env.example
└── README.md
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001

# Serial Port Configuration (optional)
SERIAL_PORT=/dev/ttyUSB0
BAUD_RATE=9600
```

### Serial Port Settings

Common baud rates:
- 9600 (default)
- 19200
- 38400
- 57600
- 115200

## Troubleshooting

### Serial Port Access Issues

**Linux:**
```bash
# Add user to dialout group
sudo usermod -a -G dialout $USER
# Log out and log back in
```

**macOS:**
```bash
# List available ports
ls /dev/tty.*
```

**Windows:**
- Check Device Manager for COM port number
- Ensure drivers are installed for your Arduino/PLC

### Connection Issues

1. Verify the backend server is running
2. Check the WebSocket URL in the frontend (default: `ws://localhost:3001`)
3. Ensure the serial port is not in use by another application
4. Verify correct baud rate settings

## Development

### Adding New Commands

1. Add command to `frontend/src/components/CommandPanel.jsx`
2. Handle command in Arduino code
3. Update documentation

### Customizing Data Display

Modify `frontend/src/components/DataDisplay.jsx` to change how PLC data is displayed.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

