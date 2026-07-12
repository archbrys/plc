import { useAuth } from '../../hooks/useAuth'
import { PLCSimulator } from '../student/PLCSimulator'
import type { InteractivePracticePageConfig } from '../../types/course'
import './InteractivePracticePage.css'

interface InteractivePracticePageProps {
  config: InteractivePracticePageConfig
  onNext?: () => void
  onBack?: () => void
}

export function InteractivePracticePage({ onNext, onBack }: InteractivePracticePageProps) {
  const { logout } = useAuth()

  return (
    <div className="chapter-practice-page">
      <header className="chapter-practice-header">
        <div className="header-actions">
          {onBack && (
            <button className="btn secondary" type="button" onClick={onBack}>
              Back
            </button>
          )}
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

      <main className="chapter-practice-main">
        <div className="chapter-practice-content">
          <PLCSimulator />

          <div className="chapter-practice-actions">
            <button className="btn large ready-btn" type="button" onClick={onNext}>
              Continue to Assessment
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
