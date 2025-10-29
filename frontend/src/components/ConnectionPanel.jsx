import React, { useState, useEffect } from 'react';
import './ConnectionPanel.css';

const ConnectionPanel = ({ serverUrl, onServerUrlChange, connected, onConnect, onDisconnect }) => {
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [baudRate, setBaudRate] = useState('9600');
  const [loading, setLoading] = useState(false);
  const [serialConnected, setSerialConnected] = useState(false);

  const API_BASE = serverUrl.replace('ws://', 'http://').replace('wss://', 'https://');

  const fetchPorts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/ports`);
      const data = await response.json();
      
      if (data.success) {
        setPorts(data.ports);
        if (data.ports.length > 0 && !selectedPort) {
          setSelectedPort(data.ports[0].path);
        }
      }
    } catch (error) {
      console.error('Error fetching ports:', error);
      alert('Failed to fetch serial ports. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectSerial = async () => {
    if (!selectedPort) {
      alert('Please select a serial port');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          port: selectedPort,
          baudRate: parseInt(baudRate)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSerialConnected(true);
        alert('Connected to serial port successfully!');
      } else {
        alert(`Failed to connect: ${data.error}`);
      }
    } catch (error) {
      console.error('Error connecting to serial port:', error);
      alert('Failed to connect to serial port');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectSerial = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/disconnect`, {
        method: 'POST'
      });

      const data = await response.json();
      
      if (data.success) {
        setSerialConnected(false);
        alert('Disconnected from serial port');
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      alert('Failed to disconnect from serial port');
    } finally {
      setLoading(false);
    }
  };

  const checkSerialStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/status`);
      const data = await response.json();
      
      if (data.success) {
        setSerialConnected(data.connected);
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  useEffect(() => {
    if (connected) {
      checkSerialStatus();
    }
  }, [connected]);

  return (
    <div className="connection-panel">
      <h2>🔌 Connection Settings</h2>
      
      <div className="section">
        <h3>WebSocket Server</h3>
        <div className="form-group">
          <label>Server URL:</label>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => onServerUrlChange(e.target.value)}
            disabled={connected}
            placeholder="ws://localhost:3001"
          />
        </div>
        
        <div className="button-group">
          {!connected ? (
            <button onClick={onConnect} className="btn btn-primary">
              Connect to Server
            </button>
          ) : (
            <button onClick={onDisconnect} className="btn btn-danger">
              Disconnect from Server
            </button>
          )}
        </div>
      </div>

      {connected && (
        <div className="section">
          <h3>Serial Port</h3>
          
          <div className="form-group">
            <label>Port:</label>
            <div className="input-with-button">
              <select
                value={selectedPort}
                onChange={(e) => setSelectedPort(e.target.value)}
                disabled={serialConnected || loading}
              >
                <option value="">Select a port...</option>
                {ports.map((port) => (
                  <option key={port.path} value={port.path}>
                    {port.path} {port.manufacturer ? `(${port.manufacturer})` : ''}
                  </option>
                ))}
              </select>
              <button 
                onClick={fetchPorts} 
                disabled={loading}
                className="btn btn-secondary btn-small"
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Baud Rate:</label>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(e.target.value)}
              disabled={serialConnected || loading}
            >
              <option value="9600">9600</option>
              <option value="19200">19200</option>
              <option value="38400">38400</option>
              <option value="57600">57600</option>
              <option value="115200">115200</option>
            </select>
          </div>

          <div className="button-group">
            {!serialConnected ? (
              <button 
                onClick={handleConnectSerial} 
                disabled={!selectedPort || loading}
                className="btn btn-success"
              >
                {loading ? 'Connecting...' : 'Connect to PLC'}
              </button>
            ) : (
              <button 
                onClick={handleDisconnectSerial}
                disabled={loading}
                className="btn btn-danger"
              >
                Disconnect from PLC
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionPanel;

