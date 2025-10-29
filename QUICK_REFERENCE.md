# PLC Motor Control - Quick Reference Card

## 🚀 Quick Start

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

## 🎯 Main Menu

### CIRCUITS (Left Side)
| Button | Description | Use Case |
|--------|-------------|----------|
| **Direct-On-Line** | Full voltage start | Small motors < 5 HP |
| **Wye-Delta** | Reduced voltage start | Medium motors 5-50 HP |
| **Forward Reverse** | Bidirectional control | Conveyors, hoists |
| **Cyclic Forward Reverse** | Auto reversing | Mixers, agitators |

### INPUTS (Right Side)
| Button | Function | Status |
|--------|----------|--------|
| 📚 **Tutorials** | Learning modules | Placeholder |
| 🖥️ **Simulator** | Real-time control | ✅ Active |
| 🔬 **Laboratory Works** | Experiments | Placeholder |
| 📝 **Assessment Modules** | Testing | Placeholder |
| 🎥 **Video Demonstration** | Videos | Placeholder |

## ⚡ Commands Reference

### Base Commands (All Circuits)
| Icon | Command | Function |
|------|---------|----------|
| ▶️ | **Start Motor** | Energize motor |
| ⏹️ | **Stop Motor** | De-energize motor |
| 🛑 | **Emergency Stop** | Immediate shutdown |
| 🔄 | **Reset** | Reset system |
| 📊 | **Status** | Request status |

### Direct-On-Line Commands
| Icon | Command | Function |
|------|---------|----------|
| ⚡ | **Full Voltage Start** | DOL starting |

### Wye-Delta Commands
| Icon | Command | Function |
|------|---------|----------|
| Y | **Wye Start** | Start in Wye |
| Δ | **Delta Run** | Switch to Delta |
| 🔀 | **Auto Transition** | Auto Wye→Delta |

### Forward-Reverse Commands
| Icon | Command | Function |
|------|---------|----------|
| ➡️ | **Forward** | Run forward |
| ⬅️ | **Reverse** | Run reverse |
| 🔒 | **Interlock Check** | Verify safety |

### Cyclic Forward-Reverse Commands
| Icon | Command | Function |
|------|---------|----------|
| 🔁 | **Start Cycle** | Begin cycling |
| ⏸️ | **Pause Cycle** | Pause cycle |
| ⏱️ | **Set Interval** | Set timing |

## 🔌 Connection Setup

### First Time Setup
1. Click **⚙️ Settings**
2. Click **Connect to Server** (ws://localhost:3001)
3. Click **🔄 Refresh** to find ports
4. Select your Arduino port
5. Choose baud rate (9600)
6. Click **Connect to PLC**
7. Verify green status indicators

### Status Indicators
| Color | Meaning |
|-------|---------|
| 🟢 Green | Connected |
| 🔴 Red | Disconnected |
| 🟡 Yellow | Not Ready |

## 📊 Data Monitor

### View Modes
- **Table View**: Organized display with timestamps
- **Raw View**: JSON format

### Data Fields
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

## 🔧 Troubleshooting

### Connection Issues
| Problem | Solution |
|---------|----------|
| WebSocket not connecting | Check backend is running on port 3001 |
| Serial port not found | Refresh port list, check USB cable |
| No data appearing | Send STATUS command, check Arduino |
| Commands not working | Verify both connections are green |

### Common Fixes
```bash
# Backend not starting
lsof -ti:3001 | xargs kill  # Kill process on port 3001
npm run dev:backend          # Restart

# Serial port access (Linux)
sudo usermod -a -G dialout $USER
# Log out and back in

# Arduino not responding
# 1. Close Arduino IDE Serial Monitor
# 2. Unplug and replug USB
# 3. Refresh port list
```

## 📝 Arduino Commands

### Send via Serial
```
START
STOP
ESTOP
RESET
STATUS
READ_ALL
DOL_START
WYE_START
DELTA_RUN
AUTO_TRANSITION
FORWARD
REVERSE
INTERLOCK
CYCLE_START
CYCLE_PAUSE
SET_INTERVAL
CIRCUIT:direct-on-line
CIRCUIT:wye-delta
CIRCUIT:forward-reverse
CIRCUIT:cyclic-forward-reverse
```

### Expected Responses
```json
// Success
{
  "status": "success",
  "message": "Motor started",
  "command": "START"
}

// Error
{
  "status": "error",
  "message": "Unknown command: XYZ"
}

// Status
{
  "status": "ok",
  "running": true,
  "uptime": 12345,
  "freeMemory": 1234
}
```

## 🎓 Usage Flow

### Typical Session
1. **Start** → Launch backend and frontend
2. **Connect** → Configure WebSocket and Serial
3. **Select** → Choose a circuit type
4. **Simulate** → Click Simulator button
5. **Control** → Use command buttons
6. **Monitor** → Watch data display
7. **Stop** → Stop motor before closing

### Best Practices
- ✅ Always stop motor before reversing
- ✅ Use E-Stop for emergencies
- ✅ Check status regularly
- ✅ Monitor data for errors
- ✅ Understand interlocks
- ✅ Allow Wye-Delta transition time

## 🔑 Keyboard Shortcuts
| Key | Action |
|-----|--------|
| Enter | Send custom command |
| Ctrl+Shift+I | Open dev tools |

## 📚 Documentation
| File | Purpose |
|------|---------|
| README.md | Complete documentation |
| QUICKSTART.md | Setup guide |
| USAGE_GUIDE.md | Detailed user manual |
| INTEGRATION_SUMMARY.md | Technical changes |
| MOCKUP_INTEGRATION.md | Design details |
| QUICK_REFERENCE.md | This card |

## 🆘 Support

### Check These First
1. Backend server running?
2. Frontend app open?
3. Both connections green?
4. Arduino code uploaded?
5. Correct baud rate (9600)?

### Debug Steps
1. Check browser console (Ctrl+Shift+I)
2. Check backend terminal for errors
3. Test Arduino with Serial Monitor
4. Verify port not in use elsewhere
5. Try different USB port/cable

## 📞 Quick Help

**No data?** → Send STATUS or READ_ALL command

**Can't connect?** → Check Settings, verify backend running

**Commands fail?** → Ensure serial connection is green

**Port access denied?** → Add user to dialout group (Linux)

**App won't start?** → Check Node.js installed, run npm install

---

**Version**: 2.0.0  
**Last Updated**: 2024  
**For detailed help**: See USAGE_GUIDE.md

