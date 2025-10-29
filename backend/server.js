const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
require('dotenv').config();

const SerialCommunication = require('./services/serialCommunication');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Initialize serial communication
const serialComm = new SerialCommunication();

// Store connected WebSocket clients
const clients = new Set();

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  clients.add(ws);

  // Send connection status
  ws.send(JSON.stringify({
    type: 'connection',
    status: 'connected',
    serialStatus: serialComm.isConnected()
  }));

  // Handle messages from client
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received from client:', data);

      switch (data.type) {
        case 'command':
          // Send command to PLC via serial
          if (serialComm.isConnected()) {
            // Format command with timestamp for logging
            const commandWithMeta = {
              command: data.payload,
              timestamp: new Date().toISOString(),
              circuit: data.circuit || 'unknown'
            };

            await serialComm.sendCommand(data.payload);

            ws.send(JSON.stringify({
              type: 'commandResponse',
              status: 'sent',
              command: data.payload,
              timestamp: commandWithMeta.timestamp
            }));

            // Broadcast command to all clients for monitoring
            broadcastToClients({
              type: 'commandSent',
              data: commandWithMeta
            });
          } else {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Serial port not connected'
            }));
          }
          break;

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message
      }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Broadcast data to all connected clients
function broadcastToClients(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Handle data received from serial port
serialComm.on('data', (data) => {
  console.log('Data from PLC:', data);
  broadcastToClients({
    type: 'plcData',
    data: data,
    timestamp: new Date().toISOString()
  });
});

// Handle serial port connection status
serialComm.on('connected', () => {
  console.log('Serial port connected');
  broadcastToClients({
    type: 'serialStatus',
    status: 'connected'
  });
});

serialComm.on('disconnected', () => {
  console.log('Serial port disconnected');
  broadcastToClients({
    type: 'serialStatus',
    status: 'disconnected'
  });
});

serialComm.on('error', (error) => {
  console.error('Serial port error:', error);
  broadcastToClients({
    type: 'error',
    message: error.message
  });
});

// API Routes
app.use('/api', apiRoutes(serialComm));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    serialConnected: serialComm.isConnected(),
    connectedClients: clients.size
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
  
  // Auto-connect to serial port if configured
  if (process.env.SERIAL_PORT) {
    serialComm.connect(process.env.SERIAL_PORT, parseInt(process.env.BAUD_RATE || '9600'));
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await serialComm.disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

