import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function PLCWelcomePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleNext = () => {
    navigate('/student/plc-chapter-select')
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={() => navigate('/student/characters')}>
            Back
          </button>
          <button className="btn" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      
      <main className="plc-intro-content">
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
                <strong>IDL-PLCT:</strong><br />
                Welcome to the Programmable Logic Controller for your interactive learning with us.
              </p>
            </div>
          </div>
        </div>
        
        <div className="plc-intro-actions">
          <button 
            className="btn large ready-btn" 
            type="button" 
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  )
}
