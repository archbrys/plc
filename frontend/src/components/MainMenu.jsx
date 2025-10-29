import React from 'react';
import './MainMenu.css';

const MainMenu = ({ 
  onCircuitSelect, 
  onInputSelect, 
  selectedCircuit, 
  selectedInput,
  connected,
  serialConnected 
}) => {
  const circuits = [
    { id: 'direct-on-line', label: 'Direct-On-Line' },
    { id: 'wye-delta', label: 'Wye-Delta' },
    { id: 'forward-reverse', label: 'Forward Reverse' },
    { id: 'cyclic-forward-reverse', label: 'Cyclic Forward Reverse' }
  ];

  const inputs = [
    { id: 'tutorials', label: 'Tutorials', icon: '📚' },
    { id: 'simulator', label: 'Simulator', icon: '🖥️' },
    { id: 'laboratory', label: 'Laboratory Works', icon: '🔬' },
    { id: 'assessment', label: 'Assessment Modules', icon: '📝' },
    { id: 'video', label: 'Video Demonstration', icon: '🎥' }
  ];

  return (
    <div className="main-menu">
      {/* Title Section */}
      <div className="main-menu-header">
        <div className="header-logo">
          <div className="header-logo-circle">
            <svg viewBox="0 0 100 100" className="motor-icon-small">
              <ellipse cx="50" cy="50" rx="35" ry="30" fill="#666" stroke="#333" strokeWidth="2"/>
              <rect x="10" y="45" width="15" height="10" fill="#FFD700" rx="2"/>
              <circle cx="50" cy="50" r="15" fill="#888"/>
              <circle cx="50" cy="50" r="8" fill="#333"/>
            </svg>
          </div>
        </div>
        <h1 className="main-title">Programmable Logic Controller (PLC) for Motor Control</h1>
      </div>

      <div className="main-menu-container">
        {/* Circuits Section */}
        <div className="menu-section circuits-section">
          <h2 className="section-title">CIRCUITS</h2>
          <div className="menu-buttons">
            {circuits.map((circuit) => (
              <button
                key={circuit.id}
                className={`menu-button circuit-button ${
                  selectedCircuit === circuit.id ? 'selected' : ''
                }`}
                onClick={() => onCircuitSelect(circuit.id)}
              >
                {circuit.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center Motor Image */}
        <div className="center-motor">
          <div className="motor-circle">
            <svg viewBox="0 0 200 200" className="motor-icon">
              {/* Motor body */}
              <ellipse cx="100" cy="100" rx="70" ry="60" fill="#888" stroke="#555" strokeWidth="4"/>
              <ellipse cx="100" cy="100" rx="60" ry="50" fill="#999"/>

              {/* Motor shaft */}
              <rect x="20" y="90" width="30" height="20" fill="#FFD700" rx="3"/>
              <rect x="20" y="92" width="30" height="16" fill="#FFA500"/>

              {/* Motor details */}
              <ellipse cx="100" cy="100" rx="35" ry="28" fill="#777"/>
              <circle cx="100" cy="100" r="20" fill="#555"/>
              <circle cx="100" cy="100" r="12" fill="#333"/>

              {/* Cooling fins */}
              <line x1="100" y1="40" x2="100" y2="50" stroke="#666" strokeWidth="3"/>
              <line x1="100" y1="150" x2="100" y2="160" stroke="#666" strokeWidth="3"/>
              <line x1="40" y1="100" x2="50" y2="100" stroke="#666" strokeWidth="3"/>
              <line x1="150" y1="100" x2="160" y2="100" stroke="#666" strokeWidth="3"/>
            </svg>
          </div>
        </div>

        {/* Inputs Section */}
        <div className="menu-section inputs-section">
          <h2 className="section-title">INPUTS</h2>
          <div className="menu-buttons">
            {inputs.map((input) => (
              <button
                key={input.id}
                className={`menu-button input-button ${
                  selectedInput === input.id ? 'selected' : ''
                }`}
                onClick={() => onInputSelect(input.id)}
              >
                {input.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Connection Status Footer */}
      <div className="menu-footer">
        <div className="connection-indicator">
          <span className={`indicator-dot ${connected ? 'connected' : 'disconnected'}`}></span>
          <span>WebSocket: {connected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="connection-indicator">
          <span className={`indicator-dot ${serialConnected ? 'connected' : 'disconnected'}`}></span>
          <span>Serial: {serialConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        {!connected && (
          <div className="connection-warning">
            ⚠️ Please configure connection in Settings
          </div>
        )}
      </div>
    </div>
  );
};

export default MainMenu;

