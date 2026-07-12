import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { TypingAnimation } from '../common/TypingAnimation'
import type { ContentSectionPageConfig } from '../../types/course'
import './ContentSectionPage.css'

interface ContentSectionPageProps {
  config: ContentSectionPageConfig
  onNext?: () => void
  onBack?: () => void
}

export function ContentSectionPage({ config, onNext, onBack }: ContentSectionPageProps) {
  const { logout } = useAuth()
  const [showNextButton, setShowNextButton] = useState(false)
  const { sectionNumber, sectionTitle, chapterTitle, contents, sideImage } = config

  return (
    <div className="chapter-section2-page">
      <header className="chapter-section2-header">
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

      <main className="chapter-section2-main">
        <div className="chapter-section2-content">
          <div className="chapter-section2-card">
            <div className="chapter-section2-header-text">
              <h1 className="chapter-section2-title">{chapterTitle}</h1>
              <p className="chapter-section2-subtitle">
                Section {sectionNumber} of 3: {sectionTitle}
              </p>
            </div>

            <div className="chapter-section2-body-wrapper">
              <div className="chapter-section2-text-column">
                <TypingAnimation
                  contents={contents}
                  typingSpeed={30}
                  displayDuration={5000}
                  clearSpeed={10}
                  loop={false}
                  onComplete={() => setShowNextButton(true)}
                />
              </div>

              {sideImage && (
                <div className="chapter-section2-image-column">
                  <img src={sideImage} alt="Section Illustration" className="chapter-section2-image" />
                </div>
              )}
            </div>
          </div>

          {showNextButton && (
            <div className="chapter-section2-actions">
              <button className="btn large ready-btn" type="button" onClick={onNext}>
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
