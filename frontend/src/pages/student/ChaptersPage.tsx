import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './ChaptersPage.css'

export function ChaptersPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleChapterClick = (chapter: number) => {
    switch (chapter) {
      case 1:
        navigate('/student/chapter1')
        break
      case 2:
        // Chapter 2 placeholder - navigate to question sets
        navigate('/student/question-sets')
        break
      case 3:
        // Chapter 3 placeholder - navigate to question sets
        navigate('/student/question-sets')
        break
      default:
        navigate('/student/question-sets')
    }
  }

  return (
    <div className="chapters-page">
      <header className="chapters-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={() => navigate('/student/plc-chapter-select')}>
            Back
          </button>
          <button className="btn" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="chapters-main">
        <div className="chapters-logo">
          <img 
            src="/assets/logo-plc.png" 
            alt="Interactive Digital Learning - PLC Trainer" 
            className="chapters-logo-image" 
          />
        </div>

        <div className="chapters-grid">
          <div className="chapters-column">
            <button 
              className="chapter-btn" 
              type="button"
              onClick={() => handleChapterClick(1)}
            >
              CHAPTER 1
            </button>
            <button 
              className="chapter-btn" 
              type="button"
              onClick={() => handleChapterClick(2)}
            >
              CHAPTER 2
            </button>
          </div>

          <div className="chapters-column">
            <button 
              className="chapter-btn" 
              type="button"
              onClick={() => handleChapterClick(3)}
            >
              CHAPTER 3
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
