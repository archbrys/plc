import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { TypingAnimation } from '../../../components/common/TypingAnimation'
import './Chapter1IntroductionPage.css'

export function Chapter1IntroductionPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [showNextButton, setShowNextButton] = useState(false)

  const introBodyContents = [
    `Automation plays a vital role in modern industries. Machines and processes are controlled automatically to improve efficiency, accuracy and productivity. One of the most widely used control devices in industrial automation is the Programmable Logic Controller PLC.

- It's like a computer for machines that:
- Receives inputs (buttons, sensors)
- Processes logic (program)
- Sends outputs (motors, lights)

PLC is a computer — but a very specific kind of computer.

PLC is defined by NEMA (National Electrical Manufacturers Association) as a digital electronic device with a programmable memory for storing instructions to implement specific function such as logic, sequencing, timing, counting and arithmetic to control machines and processes.

PLC stands for Programmable Logic Controller, not "programmable logic computer". a PLC is a specialized industrial computer purpose-built to control machines, not a general-purpose computing device like a laptop or server.`,
    
    `Unlike a general-purpose computer (PC, laptop, server), a PLC is:

• Designed to operate in harsh industrial environments (dust, vibration, temperature extremes, electrical noise)
• Built around a deterministic scan cycle for predictable real-time behavior
• Equipped with industrial I/O interfaces (24 V DC, 4-20 mA, digital and analog modules)
• Certified for specific safety and regulatory standards
• Expected to run continuously for 10-20 years without human intervention`
  ]

  const handleNext = () => {
    navigate('/student/chapter1-section2')
  }

  return (
    <div className="chapter-intro-page">
      <header className="chapter-intro-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={() => navigate('/student/chapter1-narration3')}>
            Back
          </button>
          <button className="btn" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="chapter-intro-main">
        <div className="chapter-intro-content">
          <div className="chapter-intro-card">
            <div className="chapter-intro-header-text">
              <h1 className="chapter-intro-title">Chapter 1: Introduction to PLC and its History</h1>
              <p className="chapter-intro-subtitle">Section 1 of 3: Introduction</p>
            </div>

            <div className="chapter-intro-body">
              <TypingAnimation 
                contents={introBodyContents}
                typingSpeed={30}
                displayDuration={5000}
                clearSpeed={10}
                loop={false}
                onComplete={() => setShowNextButton(true)}
              />
            </div>
          </div>

          {showNextButton && (
            <div className="chapter-intro-actions">
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
