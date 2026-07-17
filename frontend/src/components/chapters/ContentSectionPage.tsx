import { useState } from 'react'
import { TypingAnimation } from '../common/TypingAnimation'
import type { ContentSectionPageConfig } from '../../types/course'
import { resolveAssetSrc } from '../../utils/assets'
import { getContentBlockLayoutStyle } from './contentBlockLayout'
import './ContentSectionPage.css'

interface ContentSectionPageProps {
  config: ContentSectionPageConfig
  onNext?: () => void
}

export function ContentSectionPage({ config, onNext }: ContentSectionPageProps) {
  const [showNextButton, setShowNextButton] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const { contents } = config
  const currentBlock = contents[currentIndex] ?? contents[0]
  const hasText = Boolean(currentBlock?.text?.trim())
  const hasImage = Boolean(currentBlock?.image)

  return (
    <main className="chapter-section2-main">
      <div className="chapter-section2-content">
        <div className="chapter-section2-card">
          <div
            className={`chapter-section2-body-wrapper${
              !hasImage
                ? ' chapter-section2-body-wrapper--text-only'
                : !hasText
                  ? ' chapter-section2-body-wrapper--image-only'
                  : ''
            }`}
            style={hasImage && hasText ? getContentBlockLayoutStyle(currentBlock) : undefined}
          >
            <div
              className={`chapter-section2-text-column${
                hasText ? '' : ' chapter-section2-text-column--hidden'
              }`}
            >
              <TypingAnimation
                contents={contents.map((block) => block.text)}
                typingSpeed={30}
                displayDuration={5000}
                clearSpeed={10}
                loop={false}
                onComplete={() => setShowNextButton(true)}
                onIndexChange={setCurrentIndex}
              />
            </div>

            {hasImage && (
              <div className="chapter-section2-image-column">
                <img
                  src={resolveAssetSrc(currentBlock.image!)}
                  alt="Section Illustration"
                  className="chapter-section2-image"
                />
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
  )
}
