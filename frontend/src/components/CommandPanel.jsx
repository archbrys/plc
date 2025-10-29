import React, { useState, useEffect } from 'react';
import './CommandPanel.css';

const CommandPanel = ({ onSendCommand, disabled, selectedCircuit }) => {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);

  // Base commands available for all circuits
  const baseCommands = [
    { label: 'Start Motor', value: 'START', icon: '▶️' },
    { label: 'Stop Motor', value: 'STOP', icon: '⏹️' },
    { label: 'Emergency Stop', value: 'ESTOP', icon: '🛑' },
    { label: 'Reset', value: 'RESET', icon: '🔄' },
    { label: 'Status', value: 'STATUS', icon: '📊' }
  ];

  // Circuit-specific commands
  const circuitCommands = {
    'direct-on-line': [
      { label: 'Full Voltage Start', value: 'DOL_START', icon: '⚡' }
    ],
    'wye-delta': [
      { label: 'Wye Start', value: 'WYE_START', icon: 'Y' },
      { label: 'Delta Run', value: 'DELTA_RUN', icon: 'Δ' },
      { label: 'Auto Transition', value: 'AUTO_TRANSITION', icon: '🔀' }
    ],
    'forward-reverse': [
      { label: 'Forward', value: 'FORWARD', icon: '➡️' },
      { label: 'Reverse', value: 'REVERSE', icon: '⬅️' },
      { label: 'Interlock Check', value: 'INTERLOCK', icon: '🔒' }
    ],
    'cyclic-forward-reverse': [
      { label: 'Start Cycle', value: 'CYCLE_START', icon: '🔁' },
      { label: 'Pause Cycle', value: 'CYCLE_PAUSE', icon: '⏸️' },
      { label: 'Set Interval', value: 'SET_INTERVAL', icon: '⏱️' }
    ]
  };

  // Get commands based on selected circuit
  const getAvailableCommands = () => {
    const specific = selectedCircuit ? circuitCommands[selectedCircuit] || [] : [];
    return [...baseCommands, ...specific];
  };

  const predefinedCommands = getAvailableCommands();

  const handleSend = () => {
    if (command.trim()) {
      onSendCommand(command);
      setCommandHistory(prev => [
        { command, timestamp: new Date().toISOString() },
        ...prev.slice(0, 19) // Keep last 20 commands
      ]);
      setCommand('');
    }
  };

  const handlePredefinedCommand = (cmd) => {
    onSendCommand(cmd);
    setCommandHistory(prev => [
      { command: cmd, timestamp: new Date().toISOString() },
      ...prev.slice(0, 19)
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !disabled) {
      handleSend();
    }
  };

  return (
    <div className="command-panel">
      <h2>⚡ Command Control</h2>

      {selectedCircuit && (
        <div className="circuit-info">
          <span className="circuit-badge">
            {selectedCircuit.replace(/-/g, ' ').toUpperCase()}
          </span>
        </div>
      )}

      <div className="section">
        <h3>Motor Commands</h3>
        <div className="quick-commands">
          {predefinedCommands.map((cmd) => (
            <button
              key={cmd.value}
              onClick={() => handlePredefinedCommand(cmd.value)}
              disabled={disabled}
              className="btn btn-command"
              title={cmd.label}
            >
              <span className="cmd-icon">{cmd.icon}</span>
              <span className="cmd-label">{cmd.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Custom Command</h3>
        <div className="custom-command">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter custom command..."
            disabled={disabled}
          />
          <button
            onClick={handleSend}
            disabled={disabled || !command.trim()}
            className="btn btn-primary"
          >
            Send
          </button>
        </div>
      </div>

      {commandHistory.length > 0 && (
        <div className="section">
          <h3>Command History</h3>
          <div className="command-history">
            {commandHistory.map((item, index) => (
              <div key={index} className="history-item">
                <span className="history-command">{item.command}</span>
                <span className="history-time">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandPanel;

