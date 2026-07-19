import { useState } from 'react'
import { TypingAnimation } from '../common/TypingAnimation'
import type { ContentSectionPageConfig } from '../../types/course'
import { resolveAssetSrc } from '../../utils/assets'
import { getContentBlockLayoutStyle } from './contentBlockLayout'
import './ContentSectionPage.css'

interface ContentSectionPageProps {
  config: ContentSectionPageConfig
  onNext?: () => void
  onPrevious?: () => void
}

export function ContentSectionPage({ config, onNext, onPrevious }: ContentSectionPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const { contents } = config
  const currentBlock = contents[currentIndex] ?? contents[0]
  const hasText = Boolean(currentBlock?.text?.trim())
  const hasImage = Boolean(currentBlock?.image)
  const isFirstBlock = currentIndex === 0
  const isLastBlock = currentIndex === contents.length - 1

  const handlePrevious = () => {
    if (isFirstBlock) {
      onPrevious?.()
      return
    }
    setCurrentIndex((index) => index - 1)
  }

  const handleNext = () => {
    if (isLastBlock) {
      onNext?.()
      return
    }
    setCurrentIndex((index) => index + 1)
  }

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
                currentIndex={currentIndex}
                typingSpeed={30}
                onTypingStateChange={setIsTyping}
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

        <div className="chapter-section2-actions">
          {!isTyping && (
            <button className="btn-nav btn-previous" type="button" onClick={handlePrevious}>
              Previous
            </button>
          )}
          {!isTyping && (
            <button className="btn-nav btn-next" type="button" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
