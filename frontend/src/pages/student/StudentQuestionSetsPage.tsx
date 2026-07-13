import { useNavigate } from 'react-router-dom'
import { StudentMenu } from '../../components/student/StudentMenu'

export function StudentQuestionSetsPage() {
  const navigate = useNavigate()

  const handlePLCClick = () => {
    navigate('/student/plc-intro')
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
          
          <button className="hero-box hero-box-btn" type="button" onClick={handlePLCClick}>
            <h3 className="box-title">PROGRAMMABLE LOGIC<br />CONTROLLER</h3>
          </button>
        </div>
      </main>
    </div>
  )
}
