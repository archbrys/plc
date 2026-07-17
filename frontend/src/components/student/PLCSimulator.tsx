import { useState } from 'react'
import './PLCSimulator.css'

export function PLCSimulator() {
  const [isPowerOn, setIsPowerOn] = useState(false)
  const [pushButton1, setPushButton1] = useState(false)
  const [pushButton2, setPushButton2] = useState(false)

  // PLC Logic: Outputs are driven by inputs when power is ON
  const motor = isPowerOn && pushButton1
  const lightIndicator = isPowerOn && pushButton2

  const handlePowerToggle = () => {
    const newPowerState = !isPowerOn
    setIsPowerOn(newPowerState)
    
    // Reset all inputs when power is turned OFF
    if (!newPowerState) {
      setPushButton1(false)
      setPushButton2(false)
    }
  }

  const handlePushButton1Toggle = () => {
    if (isPowerOn) {
      setPushButton1(!pushButton1)
    }
  }

  const handlePushButton2Toggle = () => {
    if (isPowerOn) {
      setPushButton2(!pushButton2)
    }
  }

  return (
    <div className="plc-simulator">
      <div className="plc-simulator-header">
        <h2 className="plc-simulator-title">Basic Input/Output Simulation</h2>
        <button
          type="button"
          className={`plc-power-toggle ${isPowerOn ? 'on' : 'off'}`}
          onClick={handlePowerToggle}
        >
          <svg className="plc-power-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v10M18.36 6.64a9 9 0 1 1-12.73 0" />
          </svg>
          {isPowerOn ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="plc-simulator-body">
        <div className="plc-io-grid">
          {/* Inputs Section */}
          <div className="plc-io-section">
            <div className="plc-section-header">
              <svg className="plc-section-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
              </svg>
              <h4 className="plc-section-label">Inputs</h4>
            </div>

            <div className="plc-io-items">
              {/* Push Button 1 */}
              <div className="plc-io-item">
                <div className="plc-io-indicator-wrapper">
                  <div className={`plc-io-indicator ${pushButton1 ? 'active' : 'inactive'}`} />
                  <span className="plc-io-label">Push Button 1</span>
                </div>
                <button
                  type="button"
                  className={`plc-io-button ${pushButton1 ? 'on' : 'off'}`}
                  onClick={handlePushButton1Toggle}
                  disabled={!isPowerOn}
                >
                  {pushButton1 ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Push Button 2 */}
              <div className="plc-io-item">
                <div className="plc-io-indicator-wrapper">
                  <div className={`plc-io-indicator ${pushButton2 ? 'active' : 'inactive'}`} />
                  <span className="plc-io-label">Push Button 2</span>
                </div>
                <button
                  type="button"
                  className={`plc-io-button ${pushButton2 ? 'on' : 'off'}`}
                  onClick={handlePushButton2Toggle}
                  disabled={!isPowerOn}
                >
                  {pushButton2 ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Outputs Section */}
          <div className="plc-io-section">
            <div className="plc-section-header">
              <svg className="plc-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <h4 className="plc-section-label">Outputs</h4>
            </div>

            <div className="plc-io-items">
              {/* Motor Output */}
              <div className="plc-io-item">
                <div className="plc-io-indicator-wrapper">
                  <div className={`plc-io-indicator output ${motor ? 'active' : 'inactive'}`} />
                  <span className="plc-io-label">Motor</span>
                </div>
                <div className={`plc-io-status ${motor ? 'active' : 'inactive'}`}>
                  {motor ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>

              {/* Light Indicator Output */}
              <div className="plc-io-item">
                <div className="plc-io-indicator-wrapper">
                  <div className={`plc-io-indicator output ${lightIndicator ? 'active' : 'inactive'}`} />
                  <span className="plc-io-label">Light Indicator</span>
                </div>
                <div className={`plc-io-status ${lightIndicator ? 'active' : 'inactive'}`}>
                  {lightIndicator ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
