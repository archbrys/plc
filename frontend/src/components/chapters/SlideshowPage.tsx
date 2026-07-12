import { useEffect, useState } from 'react'
import type { SlideshowPageConfig } from '../../types/course'
import '../../pages/student/chapter1/Chapter1Page.css'

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
    <div className="chapter1-page">
      <main className="chapter1-main">
        <div className="chapter1-content">
          <div className="chapter1-image-container">
            <img
              src={`/assets/${images[currentImageIndex]}`}
              alt={`Slide ${currentImageIndex + 1}`}
              className="chapter1-image"
            />
          </div>

          <div className="chapter1-progress">
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
