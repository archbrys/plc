import { useNavigate } from 'react-router-dom'
import './StudentCharactersPage.css'

export function StudentCharactersPage() {
  const navigate = useNavigate()

  const handleNext = () => {
    navigate('/student/plc-welcome')
  }

  return (
    <div className="characters-page">
      <div className="characters-overlay" />
      
      <div className="characters-content">
        <h1 className="characters-title">CHARACTERS</h1>
        
        <div className="characters-labels">
          <div className="character-label jeffrey">
            <span>JEFFREY</span>
          </div>
          
          <div className="character-label jenny">
            <span>JENNY</span>
          </div>
          
          <div className="character-label aaron">
            <span>AARON</span>
          </div>
          
          <div className="character-label dezziel">
            <span>DEZZIEL</span>
          </div>
          
          <div className="character-label aerzien">
            <span>AERZIEN</span>
          </div>
        </div>
        
        <button
          className="btn-nav btn-next btn-next-characters"
          type="button"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  )
}
