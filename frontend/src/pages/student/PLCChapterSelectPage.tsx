import { useNavigate } from 'react-router-dom'
import { StudentMenu } from '../../components/student/StudentMenu'

export function PLCChapterSelectPage() {
  const navigate = useNavigate()

  const handleNext = () => {
    navigate('/student/chapters')
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-actions">
          <button className="btn secondary small" type="button" onClick={() => navigate('/student/plc-welcome')}>
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
                Choose what chapter you want to learn in our IDL-PLCT
              </p>
            </div>
          </div>
        </div>
        
        <div className="plc-intro-actions">
          <button 
            className="btn small ready-btn"
            type="button" 
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  )
}
