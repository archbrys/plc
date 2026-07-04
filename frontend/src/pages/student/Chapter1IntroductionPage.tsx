import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Chapter1IntroductionPage.css'

export function Chapter1IntroductionPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleNext = () => {
    navigate('/student/question-sets')
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
              <p>
                <strong>Automation</strong> plays a vital role in modern industries. Machines and processes are controlled 
                automatically to improve efficiency, accuracy and productivity. One of the most widely used control devices 
                in industrial automation is the <strong>Programmable Logic Controller PLC</strong>.
              </p>

              <ul className="chapter-intro-list">
                <li>It's like a computer for machines that:
                  <ul className="chapter-intro-sublist">
                    <li>Receives inputs (buttons, sensors)</li>
                    <li>Processes logic (program)</li>
                    <li>Sends outputs (motors, lights)</li>
                  </ul>
                </li>
              </ul>

              <p>
                <strong>PLC</strong> is a computer — but a very specific kind of computer.
              </p>

              <p>
                <strong>PLC</strong> is defined by NEMA (National Electrical Manufacturers Association) as a digital 
                electronic device with a programmable memory for storing instructions to implement specific function 
                such as logic, sequencing, timing, counting and arithmetic to control machines and processes.
              </p>

              <p>
                <strong>PLC</strong> stands for Programmable Logic Controller, not "programmable logic computer". a PLC 
                is a specialized industrial computer purpose-built to control machines, not a general-purpose computing 
                device like a laptop or server.
              </p>
            </div>
          </div>

          <div className="chapter-intro-actions">
            <button 
              className="btn large ready-btn" 
              type="button" 
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
