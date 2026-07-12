import { useEffect, useState } from 'react'
import type { SlideshowPageConfig } from '../../types/course'
import './SlideshowPage.css'

interface SlideshowPageProps {
  config: SlideshowPageConfig
  onComplete?: () => void
  onBack?: () => void
}

export function SlideshowPage({ config, onComplete, onBack }: SlideshowPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { images, autoAdvanceMs } = config

  useEffect(() => {
    if (currentImageIndex < images.length - 1) {
      const timer = setTimeout(() => {
        setCurrentImageIndex((prev) => prev + 1)
      }, autoAdvanceMs)

      return () => clearTimeout(timer)
    }

    // Auto-complete after showing the last image
    const timer = setTimeout(() => {
      onComplete?.()
    }, autoAdvanceMs)

    return () => clearTimeout(timer)
  }, [currentImageIndex, images.length, autoAdvanceMs, onComplete])

  return (
    <div className="chapter-slideshow-page">
      <main className="chapter-slideshow-main">
        <div className="chapter-slideshow-content">
          <div className="chapter-slideshow-image-container">
            <img
              src={`/assets/${images[currentImageIndex]}`}
              alt={`Slide ${currentImageIndex + 1}`}
              className="chapter-slideshow-image"
            />
          </div>

          <div className="chapter-slideshow-progress">
            <div className="progress-dots">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`progress-dot ${index === currentImageIndex ? 'active' : ''} ${index < currentImageIndex ? 'completed' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
