import { useState, useEffect, useRef } from 'react'
import './TypingAnimation.css'

interface TypingAnimationProps {
  contents: string[]
  currentIndex: number
  typingSpeed?: number
  onTypingStateChange?: (isTyping: boolean) => void
}

export function TypingAnimation({
  contents,
  currentIndex,
  typingSpeed = 30,
  onTypingStateChange
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [renderedIndex, setRenderedIndex] = useState(currentIndex)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentContent = contents[currentIndex]
  const isTyping = displayedText.length < currentContent.length

  if (currentIndex !== renderedIndex) {
    setRenderedIndex(currentIndex)
    setDisplayedText('')
  }

  useEffect(() => {
    if (displayedText.length < currentContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentContent.slice(0, displayedText.length + 1))
      }, typingSpeed)
      return () => clearTimeout(timeout)
    }
  }, [displayedText, currentContent, typingSpeed])

  useEffect(() => {
    onTypingStateChange?.(isTyping)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [displayedText])

  const handleSkip = () => {
    if (isTyping) {
      setDisplayedText(currentContent)
    }
  }

  return (
    <div className="typing-animation-wrapper">
      <div className="typing-animation-container" onClick={handleSkip} ref={containerRef}>
        <div className="typing-animation-text">
          {displayedText.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < displayedText.split('\n').length - 1 && <br />}
            </span>
          ))}
          {isTyping && <span className="typing-cursor">|</span>}
        </div>
      </div>
    </div>
  )
}
