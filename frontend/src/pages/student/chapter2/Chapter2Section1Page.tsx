import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import './Chapter2Layout.css'
import { TypingAnimation } from '../../../components/common/TypingAnimation';
import { useState } from 'react';

export function Chapter2Section1Page() {
  const navigate = useNavigate()
  const { logout } = useAuth()

    const [showNextButton, setShowNextButton] = useState(false)

  const timelineContents = [
  `• Receives signals from input devices (switches, sensors, etc.)

• Converts the electrical signals into machine code.

• Scans and collects data from devices at regular intervals.`,

  `• Brain of the PLC and executes the program.

• Manages both input and output signals.

• Processes incoming data.

• Communicates with other devices in the system.

• Performs diagnostics and fault management.`,

  `• Sends signals to output devices (actuators, motors, etc.).

• Translates data from the CPU into digital or analog signals.

• Communicates with the system peripherals.`,

  `• Provides power to the PLC and other devices connected to the control system.`,

  `• Any device used to create or modify PLC programs (PC or Keyboard).`
];

 const handleNext = () => {
    navigate('/student/chapter1-section3')
  }


  return (
    <div className="chapter2-page">
      <header className="chapter2-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={() => navigate('/student/chapter2-narration1')}>
            Back
          </button>
          <button className="btn" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="chapter2-main">
        <div className="chapter2-content">
          <div className="chapter2-card">
            <div className="narration-box">
              <p className="chapter2-title">
                Chapter 2: Basic Parts of a PLC Machine and How it Works
              </p>
              <p className="chapter2-subtitle">
                Section 1 of 4: Parts of a PLC
              </p>
            </div>

            <div className="chapter-section2-body-wrapper">
              <div className="chapter-section2-text-column">
                <TypingAnimation 
                  contents={timelineContents}
                  typingSpeed={30}
                  displayDuration={5000}
                  clearSpeed={10}
                  loop={false}
                  onComplete={() => setShowNextButton(true)}
                />
              </div>

              <div className="chapter-section2-image-column">
                <img 
                  src="/assets/logo-plc.png" 
                  alt="PLC Timeline Illustration" 
                  className="chapter-section2-image"
                />
              </div>
            </div>
          </div>

          {showNextButton && (
            <div className="chapter2-actions">
              <button 
                className="btn large ready-btn" 
                type="button" 
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          )}

        
       </div>
      </main>
    </div>
  )
}
