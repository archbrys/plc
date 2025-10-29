# Quick Start Guide

Get your PLC Machine Control system up and running in minutes!

## Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 2: Prepare Your Arduino/PLC

1. Upload the example Arduino code to your device:
   - Open `arduino/example_plc.ino` in Arduino IDE
   - Select your board and port
   - Upload the sketch

2. Note the serial port your Arduino is connected to:
   - **Windows**: Usually `COM3`, `COM4`, etc.
   - **macOS**: Usually `/dev/tty.usbserial-*` or `/dev/tty.usbmodem-*`
   - **Linux**: Usually `/dev/ttyUSB0` or `/dev/ttyACM0`

## Step 3: Start the Backend Server

```bash
# Start the backend server
npm run dev:backend
```

You should see:
```
Server running on port 3001
WebSocket server ready
```

## Step 4: Start the Frontend Application

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Start the Electron app
npm run dev
```

The Electron application window should open automatically.

## Step 5: Connect to Your PLC

1. **Connect to WebSocket Server**
   - The default URL `ws://localhost:3001` should already be filled in
   - Click "Connect to Server"
   - Status should show "🟢 Connected"

2. **Connect to Serial Port**
   - Click "🔄 Refresh" to scan for available ports
   - Select your Arduino's port from the dropdown
   - Choose the baud rate (default: 9600)
   - Click "Connect to PLC"
   - Both status indicators should now be green

## Step 6: Test the System

### Send Commands

Try the quick commands:
- Click **Start** - LED on Arduino should turn on
- Click **Status** - Should receive status information
- Click **Stop** - LED should turn off

### Monitor Data

Watch the "PLC Data Monitor" panel on the right:
- You should see real-time data coming from the Arduino
- Data updates every second
- Switch between "Table" and "Raw" view modes

### Custom Commands

1. Type a custom command in the text field
2. Press Enter or click "Send"
3. Watch the response in the data monitor

## Troubleshooting

### Backend won't start
- Check if port 3001 is already in use
- Try changing the PORT in `.env` file

### Can't see serial ports
- **Linux**: Add your user to the dialout group:
  ```bash
  sudo usermod -a -G dialout $USER
  ```
  Then log out and log back in

- **Windows**: Install Arduino drivers if not already installed

### Connection fails
- Ensure no other program is using the serial port (close Arduino IDE Serial Monitor)
- Verify the baud rate matches your Arduino code (default: 9600)
- Check the serial port path is correct

### No data appearing
- Check Arduino Serial Monitor to verify it's sending data
- Ensure the Arduino code is running (LED should blink on startup)
- Check browser console for errors (Ctrl+Shift+I in Electron)

## Next Steps

### Customize for Your PLC

1. **Modify Arduino Code**
   - Edit `arduino/example_plc.ino`
   - Add your sensor readings
   - Implement your control logic

2. **Add Custom Commands**
   - Edit `frontend/src/components/CommandPanel.jsx`
   - Add buttons for your specific commands

3. **Customize Data Display**
   - Edit `frontend/src/components/DataDisplay.jsx`
   - Format data according to your needs

### Production Deployment

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Package Electron App**
   - Add electron-builder to package.json
   - Configure build settings
   - Create installers for your platform

3. **Run Backend as Service**
   - Use PM2 or systemd to run backend continuously
   - Configure auto-start on boot

## Architecture Overview

```
┌─────────────────┐
│  Arduino/PLC    │
│  (Serial Port)  │
└────────┬────────┘
         │ Serial Communication
         │ (9600 baud, newline-delimited)
         │
┌────────▼────────┐
│  Node.js Server │
│  - Express API  │
│  - WebSocket    │
│  - SerialPort   │
└────────┬────────┘
         │ WebSocket (ws://localhost:3001)
         │ REST API (http://localhost:3001/api)
         │
┌────────▼────────┐
│ Electron App    │
│  - React UI     │
│  - Real-time    │
│    Data Display │
└─────────────────┘
```

## Support

For issues and questions:
1. Check the main README.md for detailed documentation
2. Review the troubleshooting section above
3. Check the browser/Electron console for errors
4. Verify serial communication with Arduino IDE Serial Monitor

Happy coding! 🚀

