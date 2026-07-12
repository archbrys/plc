import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { PLCSimulator } from '../../../components/student/PLCSimulator'
import './Chapter1InteractivePracticePage.css'

export function Chapter1InteractivePracticePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleNext = () => {
    navigate('/student/chapter1-quiz')
  }

  const handleBack = () => {
    navigate('/student/chapter1-narration-final')
  }

  return (
    <div className="chapter1-practice-page">
      <header className="chapter1-practice-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={handleBack}>
            Back
          </button>
          <button className="btn" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="interactive-practice-banner">
        <svg className="banner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        <h1 className="banner-title">INTERACTIVE PRACTICE</h1>
      </div>

      <main className="chapter1-practice-main">
        <div className="chapter1-practice-content">
          <PLCSimulator />

          <div className="chapter1-practice-actions">
            <button 
              className="btn large ready-btn" 
              type="button" 
              onClick={handleNext}
            >
              Continue to Assessment
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
