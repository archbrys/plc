import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentMenu } from '../../components/student/StudentMenu'
import { questionSetService } from '../../services/questionSetService'
import type { QuestionSet } from '../../types/quiz'

const PLC_FUNDAMENTALS_TITLE = 'PLC Fundamentals'

export function PLCIntroPage() {
  const navigate = useNavigate()
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    questionSetService.listPublished().then((sets) => {
      const set = sets.find((s) => s.title.trim().toLowerCase() === PLC_FUNDAMENTALS_TITLE.toLowerCase())
      setQuestionSet(set ?? null)
      setLoading(false)
    })
  }, [])

  const handleReady = () => {
    if (questionSet) {
      navigate('/student/plc-fundamentals')
    }
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={() => navigate('/student/plc')}>
            Back
          </button>
          <StudentMenu />
        </div>
      </header>
      
      <main className="plc-intro-content">
        <div className="plc-intro-container">
          <div className="plc-intro-logo">
            <img 
              src="/assets/logo-plc.png" 
              alt="Interactive Digital Learning - PLC Trainer" 
              className="plc-intro-image" 
            />
          </div>
          
          <div className="plc-intro-narration">
            <div className="narration-box">
              <p className="narration-text">
                <strong>IDL-PLCT:</strong><br />
                Before we proceed, I want to know if you have a knowledge about the topics. Are you ready?
              </p>
            </div>
          </div>
        </div>
        
        <div className="plc-intro-actions">
          <button 
            className="btn large ready-btn" 
            type="button" 
            onClick={handleReady}
            disabled={loading || !questionSet}
          >
            {loading ? 'Loading...' : 'Ready'}
          </button>
        </div>
      </main>
    </div>
  )
}
