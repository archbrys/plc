import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import './Chapter2Layout.css'

export function Chapter2Narration1Page() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleNext = () => {
    navigate('/student/chapter2-section1')
  }

  return (
    <div className="chapter2-page">
      <header className="chapter2-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={() => navigate('/student/chapters')}>
            Back
          </button>
          <button className="btn" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="plc-intro-content chapter2-main">
        <div className="plc-intro-container">
          <div className="plc-intro-logo">
            <img
              src="/assets/logo-plc.png"
              alt="Interactive Digital Learning - PLC Trainer"
              className="plc-intro-image"
            />
          </div>

          <div className="plc-intro-narration">
            <div className="narration-box">
              <p className="narration-text">
                <strong>Aaron:</strong>
                <br />
                For the chapter 2, we will have to learn about the Parts of Programmable Logic Controller (PLC).
              </p>
            </div>
          </div>
        </div>

        <div className="plc-intro-actions">
          <button className="btn large ready-btn" type="button" onClick={handleNext}>
            Next
          </button>
        </div>
      </main>
    </div>
  )
}
