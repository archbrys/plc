import React from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onContinue }) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-main">
          <div className="welcome-logo">
            <svg viewBox="0 0 200 240" className="bulb-gear-icon">
              {/* Light bulb base/screw */}
              <rect x="85" y="180" width="30" height="8" fill="#5aa0f2" rx="2"/>
              <rect x="87" y="188" width="26" height="6" fill="#4a90e2" rx="1"/>
              <rect x="89" y="194" width="22" height="6" fill="#5aa0f2" rx="1"/>
              <rect x="91" y="200" width="18" height="8" fill="#4a90e2" rx="2"/>

              {/* Light bulb glass - lower part */}
              <path d="M 75 160 Q 75 175 85 180 L 115 180 Q 125 175 125 160"
                    fill="none" stroke="#5aa0f2" strokeWidth="4" strokeLinecap="round"/>

              {/* Light bulb glass - main bulb */}
              <ellipse cx="100" cy="100" rx="50" ry="60"
                       fill="none" stroke="#5aa0f2" strokeWidth="4"/>

              {/* Filament/connection lines */}
              <line x1="100" y1="160" x2="100" y2="140" stroke="#5aa0f2" strokeWidth="3"/>

              {/* Gear in center */}
              <g transform="translate(100, 100)">
                {/* Gear teeth */}
                <path d="M 0,-35 L 8,-38 L 8,-32 L 0,-30 Z" fill="#4a90e2"/>
                <path d="M 0,-35 L 8,-38 L 8,-32 L 0,-30 Z" fill="#4a90e2" transform="rotate(60)"/>
                <path d="M 0,-35 L 8,-38 L 8,-32 L 0,-30 Z" fill="#4a90e2" transform="rotate(120)"/>
                <path d="M 0,-35 L 8,-38 L 8,-32 L 0,-30 Z" fill="#4a90e2" transform="rotate(180)"/>
                <path d="M 0,-35 L 8,-38 L 8,-32 L 0,-30 Z" fill="#4a90e2" transform="rotate(240)"/>
                <path d="M 0,-35 L 8,-38 L 8,-32 L 0,-30 Z" fill="#4a90e2" transform="rotate(300)"/>

                {/* Gear body */}
                <circle r="30" fill="#5aa0f2"/>

                {/* Center hole */}
                <circle r="12" fill="#003366"/>

                {/* Inner details */}
                <circle r="18" fill="none" stroke="#003366" strokeWidth="2"/>
              </g>

              {/* Glow effect lines inside bulb */}
              <line x1="70" y1="80" x2="80" y2="90" stroke="#a8d0ff" strokeWidth="2" opacity="0.6"/>
              <line x1="130" y1="80" x2="120" y2="90" stroke="#a8d0ff" strokeWidth="2" opacity="0.6"/>
              <line x1="65" y1="110" x2="75" y2="115" stroke="#a8d0ff" strokeWidth="2" opacity="0.6"/>
            </svg>
          </div>

          <div className="welcome-title">
            <h1 className="title-main">IDL-PLCT</h1>
            <h2 className="title-sub">Interactive Digital Learning</h2>
            <h2 className="title-sub">Programmable Logic</h2>
            <h2 className="title-sub">Controller Trainer</h2>
          </div>
        </div>

        <button className="continue-button" onClick={onContinue}>
          Click to Continue
        </button>
      </div>

      <div className="welcome-sparkle"></div>
    </div>
  );
};

export default WelcomeScreen;

