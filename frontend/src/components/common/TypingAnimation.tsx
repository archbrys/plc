import { useState, useEffect } from 'react'
import './TypingAnimation.css'

interface TypingAnimationProps {
  contents: string[]
  typingSpeed?: number
  displayDuration?: number
  clearSpeed?: number
  loop?: boolean
  onComplete?: () => void
}

export function TypingAnimation({ 
  contents, 
  typingSpeed = 30, 
  displayDuration = 5000,
  clearSpeed = 10,
  loop = true,
  onComplete
}: TypingAnimationProps) {
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    const currentContent = contents[currentContentIndex]
    
    // Typing phase
    if (isTyping && !isClearing && displayedText.length < currentContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentContent.slice(0, displayedText.length + 1))
      }, typingSpeed)
      return () => clearTimeout(timeout)
    }
    
    // Finished typing, wait before clearing
    if (isTyping && !isClearing && displayedText.length === currentContent.length) {
      const isLastContent = currentContentIndex === contents.length - 1
      
      // If it's the last content and not looping, trigger completion
      if (isLastContent && !loop) {
        if (onComplete) {
          onComplete()
        }
        return
      }
      
      // Otherwise, wait and then clear/move to next
      const timeout = setTimeout(() => {
        const nextIndex = (currentContentIndex + 1) % contents.length
        setDisplayedText('')
        setCurrentContentIndex(nextIndex)
        setIsTyping(true)
        setIsClearing(false)
      }, displayDuration)
      return () => clearTimeout(timeout)
    }
  }, [displayedText, currentContentIndex, isTyping, isClearing, contents, typingSpeed, displayDuration, clearSpeed, loop, onComplete])

  return (
    <div className="typing-animation-container">
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
  )
}
