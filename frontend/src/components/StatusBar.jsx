import React from 'react';
import './StatusBar.css';

const StatusBar = ({ wsConnected, serialConnected, connectionStatus }) => {
  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="status-label">WebSocket:</span>
        <span className={`status-indicator ${wsConnected ? 'connected' : 'disconnected'}`}>
          {wsConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>
      
      <div className="status-item">
        <span className="status-label">Serial Port:</span>
        <span className={`status-indicator ${serialConnected ? 'connected' : 'disconnected'}`}>
          {serialConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>

      <div className="status-item">
        <span className="status-label">System:</span>
        <span className={`status-indicator ${wsConnected && serialConnected ? 'ready' : 'not-ready'}`}>
          {wsConnected && serialConnected ? '✅ Ready' : '⏳ Not Ready'}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;

