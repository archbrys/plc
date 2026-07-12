import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import './Chapter2Layout.css'

export function Chapter2Section1Page() {
  const navigate = useNavigate()
  const { logout } = useAuth()

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
                Chapter 2:
                <br />
                Basic Parts of a PLC Machine
                <br />
                and How it Works
              </p>
              <p className="chapter2-subtitle">
                Section 1 of 4: Parts of a PLC
              </p>
            </div>
          </div>

        <div className="chapter2-actions">
          <button className="btn large ready-btn" type="button" onClick={() => navigate('/student/question-sets')}>
            Start
          </button>
        </div>
       </div>
      </main>
    </div>
  )
}
