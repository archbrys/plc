import { PLCSimulator } from '../student/PLCSimulator'
import type { InteractivePracticePageConfig } from '../../types/course'
import './InteractivePracticePage.css'

interface InteractivePracticePageProps {
  config: InteractivePracticePageConfig
  onNext?: () => void
  onPrevious?: () => void
}

export function InteractivePracticePage({ onNext, onPrevious }: InteractivePracticePageProps) {
  return (
    <main className="chapter-practice-main">
      <div className="chapter-practice-content">
        <div className="chapter-practice-simulator">
          <PLCSimulator />
        </div>

        <div className="chapter-practice-actions">
          <button className="btn-nav btn-previous" type="button" onClick={onPrevious}>
            Previous
          </button>
          <button className="btn large ready-btn" type="button" onClick={onNext}>
            Continue to Assessment
          </button>
        </div>
      </div>
    </main>
  )
}
