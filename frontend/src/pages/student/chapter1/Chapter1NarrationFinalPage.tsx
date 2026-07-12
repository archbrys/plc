import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'

export function Chapter1NarrationFinalPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleNext = () => {
    navigate('/student/chapter1-interactive-practice')
  }

  const handleBack = () => {
    navigate('/student/chapter1-section3')
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={handleBack}>
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
                <strong>Aaron:</strong><br />
                Chapter 1 is done, before we proceed to the next chapter. I want to know if you really learn from this chapter.
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
