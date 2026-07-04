import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Chapter1Page.css'

export function Chapter1Page() {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const images = ['25.png', '26.png', '27.png', '28.png']

  useEffect(() => {
    if (currentImageIndex < images.length - 1) {
      const timer = setTimeout(() => {
        setCurrentImageIndex(prev => prev + 1)
      }, 3000)

      return () => clearTimeout(timer)
    } else {
      // Redirect to narration page after showing the last image for 3 seconds
      const timer = setTimeout(() => {
        navigate('/student/chapter1-narration1')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [currentImageIndex, images.length, navigate])

  return (
    <div className="chapter1-page">
      <main className="chapter1-main">
        <div className="chapter1-content">
          <div className="chapter1-image-container">
            <img
              src={`/assets/${images[currentImageIndex]}`}
              alt={`Chapter 1 - Slide ${currentImageIndex + 1}`}
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
