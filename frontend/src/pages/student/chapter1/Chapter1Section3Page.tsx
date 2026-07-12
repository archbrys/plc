import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { TypingAnimation } from '../../../components/common/TypingAnimation'
import './Chapter1Section3Page.css'

export function Chapter1Section3Page() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [showNextButton, setShowNextButton] = useState(false)

  const advantagesContents = [
    `Advantages of Programmable Logic Controller

• Reprogrammable – A PLC can be easily reprogrammed to perform different control tasks without changing the hardware, making it flexible for various applications.

• Faster Troubleshooting – PLCs have built-in diagnostic features that quickly identify faults, reducing downtime and making repairs easier.

• Smaller in Size – A PLC combines multiple control functions into one compact device, saving panel space and simplifying system installation.

• More Reliable – PLCs are designed to operate continuously in harsh industrial environments, providing stable and dependable performance.

• Easy to Modify – Changes to the control process can be made by updating the PLC program instead of rewiring electrical circuits, saving time and effort.

• Can Handle Complex Operations – PLCs can execute advanced control functions such as sequencing, timing, counting, data processing, and communication with other devices efficiently.`
  ]

  const handleNext = () => {
    navigate('/student/chapter1-narration-final')
  }

  const handleBack = () => {
    navigate('/student/chapter1-section2')
  }

  return (
    <div className="chapter-section3-page">
      <header className="chapter-section3-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={handleBack}>
            Back
          </button>
          <button className="btn" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="chapter-section3-main">
        <div className="chapter-section3-content">
          <div className="chapter-section3-card">
            <div className="chapter-section3-header-text">
              <h1 className="chapter-section3-title">Chapter 1: Introduction to PLC and its History</h1>
              <p className="chapter-section3-subtitle">Section 3 of 3: Relay Logic vs. PLC</p>
            </div>

            <div className="chapter-section3-body-wrapper">
              <div className="chapter-section3-text-column">
                <TypingAnimation 
                  contents={advantagesContents}
                  typingSpeed={30}
                  displayDuration={5000}
                  clearSpeed={10}
                  loop={false}
                  onComplete={() => setShowNextButton(true)}
                />
              </div>

              <div className="chapter-section3-image-column">
                <img 
                  src="/assets/logo-plc.png" 
                  alt="PLC Advantages Illustration" 
                  className="chapter-section3-image"
                />
              </div>
            </div>
          </div>

          {showNextButton && (
            <div className="chapter-section3-actions">
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
