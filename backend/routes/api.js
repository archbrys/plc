const express = require('express');

module.exports = (serialComm) => {
  const router = express.Router();

  /**
   * GET /api/ports - List available serial ports
   */
  router.get('/ports', async (req, res) => {
    try {
      const ports = await serialComm.listPorts();
      res.json({ success: true, ports });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * POST /api/connect - Connect to a serial port
   */
  router.post('/connect', async (req, res) => {
    try {
      const { port, baudRate } = req.body;
      
      if (!port) {
        return res.status(400).json({ success: false, error: 'Port path is required' });
      }

      await serialComm.connect(port, baudRate || 9600);
      res.json({ success: true, message: 'Connected to serial port' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * POST /api/disconnect - Disconnect from serial port
   */
  router.post('/disconnect', async (req, res) => {
    try {
      await serialComm.disconnect();
      res.json({ success: true, message: 'Disconnected from serial port' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  /**
   * GET /api/status - Get connection status
   */
  router.get('/status', (req, res) => {
    const portInfo = serialComm.getPortInfo();
    res.json({
      success: true,
      connected: serialComm.isConnected(),
      portInfo
    });
  });

  /**
   * POST /api/command - Send command to PLC
   */
  router.post('/command', async (req, res) => {
    try {
      const { command } = req.body;
      
      if (!command) {
        return res.status(400).json({ success: false, error: 'Command is required' });
      }

      if (!serialComm.isConnected()) {
        return res.status(400).json({ success: false, error: 'Serial port not connected' });
      }

      await serialComm.sendCommand(command);
      res.json({ success: true, message: 'Command sent successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
};

