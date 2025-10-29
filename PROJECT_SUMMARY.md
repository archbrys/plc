# PLC Machine Control - Project Summary

## Overview

A complete full-stack application for PLC (Programmable Logic Controller) communication via Arduino using serial communication. The system provides real-time bidirectional communication between hardware and a desktop application.

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework for REST API
- **ws** - WebSocket library for real-time communication
- **serialport** - Serial port communication with Arduino/PLC
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Frontend
- **Electron** - Desktop application framework
- **React** - UI library
- **Vite** - Build tool and dev server
- **Custom WebSocket Hook** - Real-time data handling

### Hardware
- **Arduino/PLC** - Hardware controller
- **Serial Communication** - USB/Serial connection

## Project Structure

```
plc-mc/
├── backend/                      # Node.js backend server
│   ├── server.js                # Main server with WebSocket
│   ├── routes/
│   │   └── api.js              # REST API endpoints
│   └── services/
│       └── serialCommunication.js  # Serial port handler
│
├── frontend/                     # Electron + React frontend
│   ├── electron/
│   │   └── main.js             # Electron main process
│   ├── src/
│   │   ├── App.jsx             # Main React component
│   │   ├── main.jsx            # React entry point
│   │   ├── components/         # React components
│   │   │   ├── ConnectionPanel.jsx
│   │   │   ├── CommandPanel.jsx
│   │   │   ├── DataDisplay.jsx
│   │   │   └── StatusBar.jsx
│   │   └── hooks/
│   │       └── useWebSocket.js # WebSocket custom hook
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── arduino/                      # Arduino example code
│   └── example_plc.ino         # Example PLC implementation
│
├── package.json                  # Backend dependencies
├── .env.example                  # Environment template
├── .gitignore
├── README.md                     # Full documentation
├── QUICKSTART.md                # Quick start guide
├── PROJECT_SUMMARY.md           # This file
└── setup.sh                     # Setup script
```

## Key Features

### 1. Real-time Communication
- WebSocket-based bidirectional communication
- Automatic reconnection with exponential backoff
- Message queuing and error handling

### 2. Serial Port Management
- Auto-discovery of available serial ports
- Configurable baud rates (9600-115200)
- Line-based protocol (newline-delimited)
- Support for both plain text and JSON data

### 3. User Interface
- **Connection Panel**: Configure and manage connections
- **Command Panel**: Send commands with quick buttons and custom input
- **Data Display**: Real-time data monitoring with table/raw views
- **Status Bar**: Visual connection status indicators

### 4. API Endpoints
- `GET /api/ports` - List available serial ports
- `GET /api/status` - Get connection status
- `POST /api/connect` - Connect to serial port
- `POST /api/disconnect` - Disconnect from serial port
- `POST /api/command` - Send command to PLC

### 5. WebSocket Messages
- `connection` - Connection status
- `plcData` - Data from PLC
- `serialStatus` - Serial port status
- `command` - Send command to PLC
- `commandResponse` - Command acknowledgment
- `error` - Error messages

## Data Flow

```
1. Arduino sends data via Serial → Node.js receives via SerialPort
2. Node.js broadcasts data via WebSocket → Electron receives
3. React updates UI with new data
4. User sends command via UI → WebSocket to Node.js
5. Node.js sends command via Serial → Arduino receives and executes
```

## Communication Protocol

### Arduino → Node.js (Data)
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

### Node.js → Arduino (Commands)
```
START
STOP
RESET
STATUS
READ_ALL
```

### Arduino → Node.js (Response)
```json
{
  "status": "success",
  "message": "System started"
}
```

## Installation & Setup

### Quick Setup
```bash
# Run the setup script
./setup.sh

# Or manually:
npm install
cd frontend && npm install
```

### Running the Application

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Configuration

### Environment Variables (.env)
```env
PORT=3001
SERIAL_PORT=/dev/ttyUSB0  # Optional
BAUD_RATE=9600            # Optional
```

### Serial Port Settings
- **Baud Rate**: 9600, 19200, 38400, 57600, 115200
- **Data Bits**: 8
- **Parity**: None
- **Stop Bits**: 1
- **Flow Control**: None

## Development

### Adding New Features

1. **New Command**
   - Add to `CommandPanel.jsx` predefinedCommands
   - Implement in Arduino code
   - Handle in `handleCommand()` function

2. **Custom Data Format**
   - Modify Arduino `sendData()` function
   - Update `DataDisplay.jsx` rendering logic

3. **New API Endpoint**
   - Add route in `backend/routes/api.js`
   - Implement handler function
   - Update frontend to call new endpoint

### Testing

1. **Backend Testing**
   ```bash
   # Test API endpoints
   curl http://localhost:3001/health
   curl http://localhost:3001/api/ports
   ```

2. **Serial Testing**
   - Use Arduino IDE Serial Monitor
   - Verify data format and timing
   - Test command responses

3. **Frontend Testing**
   - Open DevTools in Electron (Ctrl+Shift+I)
   - Monitor WebSocket messages
   - Check console for errors

## Deployment

### Backend as Service
```bash
# Using PM2
npm install -g pm2
pm2 start backend/server.js --name plc-backend
pm2 save
pm2 startup
```

### Electron App Packaging
```bash
# Install electron-builder
npm install --save-dev electron-builder

# Build for current platform
cd frontend
npm run build
npx electron-builder
```

## Troubleshooting

### Common Issues

1. **Serial Port Access Denied**
   - Linux: `sudo usermod -a -G dialout $USER`
   - Restart required after group change

2. **Port Already in Use**
   - Change PORT in .env
   - Kill process using port: `lsof -ti:3001 | xargs kill`

3. **WebSocket Connection Failed**
   - Verify backend is running
   - Check firewall settings
   - Ensure correct URL in frontend

4. **No Data Received**
   - Verify Arduino is sending data
   - Check baud rate matches
   - Ensure serial port is not in use elsewhere

## Performance Considerations

- **Data Rate**: Recommended max 10 messages/second from Arduino
- **Message Size**: Keep JSON messages under 1KB for best performance
- **History Limit**: Frontend stores last 100 data entries
- **Reconnection**: Max 5 attempts with 3-second delay

## Security Notes

- Backend runs on localhost by default
- No authentication implemented (add if exposing to network)
- Serial port access requires system permissions
- WebSocket connections are not encrypted (use WSS for production)

## Future Enhancements

- [ ] Add user authentication
- [ ] Implement data logging to file/database
- [ ] Add charts and graphs for data visualization
- [ ] Support multiple simultaneous serial connections
- [ ] Add configuration profiles
- [ ] Implement command scheduling
- [ ] Add alert/notification system
- [ ] Create mobile app version

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions:
1. Check README.md for detailed documentation
2. Review QUICKSTART.md for setup instructions
3. Check the troubleshooting sections
4. Open an issue on the repository

---

**Created**: 2024
**Version**: 1.0.0
**Status**: Production Ready

