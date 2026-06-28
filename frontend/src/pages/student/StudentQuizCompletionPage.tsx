import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { resultService } from '../../services/resultService'
import type { QuizResult } from '../../types/quiz'

export function StudentQuizCompletionPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login')
      return
    }

    // Get the result ID from session storage
    const resultId = sessionStorage.getItem('quiz_last_result_id')
    
    if (resultId) {
      resultService.getById(resultId).then((data) => {
        setResult(data)
        setLoading(false)
      })
    } else {
      // If no result ID, try to get the latest result
      resultService.listByStudent(user.id).then((results) => {
        if (results.length > 0) {
          setResult(results[0])
        }
        setLoading(false)
      })
    }
  }, [user, navigate])

  const handleContinue = () => {
    // Clear the session storage
    sessionStorage.removeItem('quiz_last_result_id')
    // Navigate to student question sets page
    navigate('/student/question-sets')
  }

  // Mock data for display (or use actual result data when available)
  const score = result ? result.earnedPoints : 0
  const totalPoints = result ? result.totalPoints : 30
  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0

  if (loading) {
    return (
      <div className="landing-page">
        <main className="completion-content">
          <p>Loading results...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="landing-page">
      <main className="completion-content">
        <div className="completion-container">
          {/* Check Icon */}
          <div className="completion-icon">
            <svg viewBox="0 0 100 100" className="check-icon">
              <circle cx="50" cy="50" r="45" fill="#4ade80" />
              <path
                d="M30 50 L45 65 L70 35"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Completed Text */}
          <h1 className="completion-title">completed!</h1>

          {/* Score Card */}
          <div className="completion-score-card">
            <div className="score-label">Your Score</div>
            <div className="score-value">
              {score}/{totalPoints}
            </div>
            <div className="score-percentage">{percentage}% Correct</div>

            {/* Progress Bar */}
            <div className="completion-progress-bar">
              <div 
                className="completion-progress-fill" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Continue Button */}
          <button 
            className="btn-continue-learning" 
            type="button" 
            onClick={handleContinue}
          >
            Continue Learning
          </button>
        </div>
      </main>
    </div>
  )
}
