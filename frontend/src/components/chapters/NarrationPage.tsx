import { useAuth } from '../../hooks/useAuth'
import type { NarrationPageConfig } from '../../types/course'

interface NarrationPageProps {
  config: NarrationPageConfig
  onNext?: () => void
  onBack?: () => void
}

export function NarrationPage({ config, onNext, onBack }: NarrationPageProps) {
  const { logout } = useAuth()
  const { character, text, backgroundImage } = config

  return (
    <div className="landing-page">
      <header className="landing-header">
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

      <main className="plc-intro-content">
        <div className="plc-intro-container">
          <div className="plc-intro-logo">
            <img
              src={backgroundImage || '/assets/logo-plc.png'}
              alt="Interactive Digital Learning - PLC Trainer"
              className="plc-intro-image"
            />
          </div>

          <div className="plc-intro-narration">
            <div className="narration-box">
              <p className="narration-text">
                <strong>{character}:</strong>
                <br />
                {text}
              </p>
            </div>
          </div>
        </div>

        <div className="plc-intro-actions">
          <button className="btn large ready-btn" type="button" onClick={onNext}>
            Next
          </button>
        </div>
      </main>
    </div>
  )
}
