import type { NarrationPageConfig } from '../../types/course'
import { resolveAssetSrc } from '../../utils/assets'
import './NarrationPage.css'

interface NarrationPageProps {
  config: NarrationPageConfig
  onNext?: () => void
  onPrevious?: () => void
}

export function NarrationPage({ config, onNext, onPrevious }: NarrationPageProps) {
  const { character, text, backgroundImage, image } = config

  return (
    <main className="narration-page-content">
      {image && (
        <div className="narration-page-image">
          <img src={resolveAssetSrc(image)} alt="" className="narration-page-image-img" />
        </div>
      )}
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
        <button className="btn-nav btn-previous" type="button" onClick={onPrevious}>
          Previous
        </button>
        <button className="btn large ready-btn" type="button" onClick={onNext}>
          Next
        </button>
      </div>
    </main>
  )
}
