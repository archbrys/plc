import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete: () => void
  duration?: number
}

export function SplashScreen({ onComplete, duration = 3000 }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, duration - 500)

    const completeTimer = setTimeout(() => {
      onComplete()
    }, duration)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [duration, onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 500ms ease-in-out',
      }}
    >
      
      {/* Logo layer - fully opaque */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/assets/logo-plc.png"
          alt="PLC Logo"
          style={{
            maxWidth: '600px',
            width: '80%',
            height: 'auto',
          }}
        />
      </div>
    </div>
  )
}
