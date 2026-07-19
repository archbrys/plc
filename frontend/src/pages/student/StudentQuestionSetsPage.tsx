import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentMenu } from '../../components/student/StudentMenu'
import { homeButtonApiService } from '../../services/homeButtonApiService'
import type { HomeButton } from '../../types/homeButton'

export function StudentQuestionSetsPage() {
  const navigate = useNavigate()
  const [buttons, setButtons] = useState<HomeButton[]>([])

  useEffect(() => {
    homeButtonApiService.getHomeButtons().then(setButtons).catch(console.error)
  }, [])

  const handleButtonClick = (button: HomeButton) => {
    if (button.locked) return
    if (button.targetType === 'CHAPTER' && button.chapterId !== null) {
      navigate(`/student/chapters/${button.chapterId}/flow`)
      return
    }
    if (button.targetType === 'ROUTE' && button.route) {
      navigate(button.route)
    }
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-actions">
          <StudentMenu />
        </div>
      </header>

      <main className="landing-content">
        <div className="landing-hero">
          <div className="hero-logo">
            <img src="/assets/logo-plc.png" alt="Interactive Digital Learning - PLC Trainer" className="plc-image" />
          </div>

          <div className="hero-buttons-grid">
            {(() => {
              const half = Math.ceil(buttons.length / 2);
              const columns = [buttons.slice(0, half), buttons.slice(half)];

              return columns.map((columnButtons, columnIndex) => (
                <div className="hero-buttons-column" key={columnIndex}>
                  {columnButtons.map((button) => (
                    <button
                      key={button.id}
                      className={`hero-box hero-box-btn${button.locked ? ' locked' : ''}`}
                      type="button"
                      disabled={button.locked}
                      onClick={() => handleButtonClick(button)}
                    >
                      <h3 className="box-title">{button.label}</h3>
                    </button>
                  ))}
                </div>
              ));
            })()}
          </div>
        </div>
      </main>
    </div>
  )
}
