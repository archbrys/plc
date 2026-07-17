import type { NarrationPageConfig } from '../../types/course'
import './NarrationPage.css'

interface NarrationPageProps {
  config: NarrationPageConfig
  onNext?: () => void
}

export function NarrationPage({ config, onNext }: NarrationPageProps) {
  const { character, text, backgroundImage } = config

  return (
    <main className="narration-page-content">
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

      <div className="narration-page-actions">
        <button className="btn large ready-btn" type="button" onClick={onNext}>
          Next
        </button>
      </div>
    </main>
  )
}
