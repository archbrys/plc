const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const EventEmitter = require('events');

class SerialCommunication extends EventEmitter {
  constructor() {
    super();
    this.port = null;
    this.parser = null;
    this.connected = false;
  }

  /**
   * Get list of available serial ports
   */
  async listPorts() {
    try {
      const ports = await SerialPort.list();
      return ports.map(port => ({
        path: port.path,
        manufacturer: port.manufacturer,
        serialNumber: port.serialNumber,
        pnpId: port.pnpId,
        vendorId: port.vendorId,
        productId: port.productId
      }));
    } catch (error) {
      console.error('Error listing ports:', error);
      throw error;
    }
  }

  /**
   * Connect to a serial port
   */
  async connect(portPath, baudRate = 9600) {
    try {
      if (this.connected) {
        await this.disconnect();
      }

      console.log(`Connecting to ${portPath} at ${baudRate} baud...`);

      this.port = new SerialPort({
        path: portPath,
        baudRate: baudRate,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        autoOpen: false
      });

      // Create parser for line-based data
      this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));

      // Set up event handlers
      this.parser.on('data', (data) => {
        const trimmedData = data.trim();
        if (trimmedData) {
          this.handleIncomingData(trimmedData);
        }
      });

      this.port.on('error', (error) => {
        console.error('Serial port error:', error);
        this.emit('error', error);
      });

      this.port.on('close', () => {
        console.log('Serial port closed');
        this.connected = false;
        this.emit('disconnected');
      });

      // Open the port
      await new Promise((resolve, reject) => {
        this.port.open((error) => {
          if (error) {
            reject(error);
          } else {
            this.connected = true;
            this.emit('connected');
            resolve();
          }
        });
      });

      console.log('Serial port connected successfully');
      return true;
    } catch (error) {
      console.error('Error connecting to serial port:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Disconnect from serial port
   */
  async disconnect() {
    if (this.port && this.port.isOpen) {
      return new Promise((resolve) => {
        this.port.close((error) => {
          if (error) {
            console.error('Error closing port:', error);
          }
          this.connected = false;
          this.port = null;
          this.parser = null;
          resolve();
        });
      });
    }
  }

  /**
   * Send command to PLC via serial port
   */
  async sendCommand(command) {
    if (!this.connected || !this.port || !this.port.isOpen) {
      throw new Error('Serial port not connected');
    }

    return new Promise((resolve, reject) => {
      // Add newline if not present
      const commandStr = command.toString().endsWith('\n') ? command : `${command}\n`;
      
      this.port.write(commandStr, (error) => {
        if (error) {
          console.error('Error sending command:', error);
          reject(error);
        } else {
          console.log('Command sent:', command);
          resolve();
        }
      });
    });
  }

  /**
   * Handle incoming data from serial port
   */
  handleIncomingData(data) {
    try {
      // Try to parse as JSON first
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch {
        // If not JSON, treat as plain text
        parsedData = { raw: data };
      }

      this.emit('data', parsedData);
    } catch (error) {
      console.error('Error handling incoming data:', error);
      this.emit('error', error);
    }
  }

  /**
   * Check if serial port is connected
   */
  isConnected() {
    return this.connected && this.port && this.port.isOpen;
  }

  /**
   * Get current port info
   */
  getPortInfo() {
    if (this.port) {
      return {
        path: this.port.path,
        baudRate: this.port.baudRate,
        isOpen: this.port.isOpen
      };
    }
    return null;
  }
}

module.exports = SerialCommunication;

