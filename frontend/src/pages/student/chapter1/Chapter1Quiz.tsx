import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { questionSetService } from '../../../services/questionSetService'
import { resultService } from '../../../services/resultService'
import type { QuestionSet, StudentAnswer } from '../../../types/quiz'

export function Chapter1Quiz() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null)
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    questionSetService.listPublished().then((sets) => {
      const chapter1Set = sets.find((set) => set.title === 'Chapter 1: Introduction to PLC') ?? null
      setQuestionSet(chapter1Set)
      setLoading(false)
    })
  }, [])

  const orderedQuestions = useMemo(
    () => [...(questionSet?.questions ?? [])].sort((a, b) => a.orderNumber - b.orderNumber),
    [questionSet?.questions],
  )

  const totalQuestions = orderedQuestions.length
  const currentQuestion = orderedQuestions[currentQuestionIndex]
  const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0
  const hasCurrentAnswer = currentQuestion
    ? currentQuestion.questionType === 'multiple_choice'
      ? Boolean(answers[currentQuestion.id]?.selectedChoiceId)
      : currentQuestion.questionType === 'true_false'
        ? typeof answers[currentQuestion.id]?.selectedBoolean === 'boolean'
        : Boolean(answers[currentQuestion.id]?.answerText?.trim())
    : false

  const updateAnswer = (questionId: string, patch: Partial<StudentAnswer>) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        ...current[questionId],
        ...patch,
        questionId,
      },
    }))
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (!hasCurrentAnswer) {
      return
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setError('')

    if (!user || user.role !== 'student' || !questionSet) {
      setError('Student session not found.')
      return
    }

    setSubmitting(true)
    const response = await resultService.submit(questionSet.id, user.id, Object.values(answers))
    setSubmitting(false)

    if (!response.ok || !response.result) {
      setError((response.errors ?? ['Unable to submit quiz.']).join(' '))
      return
    }

    sessionStorage.setItem('quiz_last_result_id', response.result.id)
    navigate('/student/completion')
  }

  if (loading) {
    return (
      <div className="landing-page">
        <main className="plc-intro-content">
          <p className="muted">Loading quiz...</p>
        </main>
      </div>
    )
  }

  if (!questionSet) {
    return (
      <div className="landing-page">
        <main className="plc-intro-content">
          <p className="muted">Chapter 1 quiz is not available.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={() => navigate('/student/chapter1-interactive-practice')}>
            Back
          </button>
          <button className="btn" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="plc-quiz-content">
        <div className="plc-quiz-logo">
          <img
            src="/assets/logo-plc.png"
            alt="Interactive Digital Learning - PLC Trainer"
            className="plc-logo-image"
          />
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        {currentQuestion && (
          <div className="question-container">
            {error ? <p className="error-text">{error}</p> : null}

            <div className="question-card">
              <h2 className="question-number">
                {currentQuestion.orderNumber}. {currentQuestion.questionText}
              </h2>

              <div className="choices-container">
                {currentQuestion.questionType === 'multiple_choice' &&
                  currentQuestion.choices
                    .sort((a, b) => a.orderNumber - b.orderNumber)
                    .map((choice) => (
                      <label key={choice.id} className="radio-choice">
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          checked={answers[currentQuestion.id]?.selectedChoiceId === choice.id}
                          onChange={() => updateAnswer(currentQuestion.id, { selectedChoiceId: choice.id })}
                        />
                        <span className="choice-text">{choice.choiceText}</span>
                      </label>
                    ))}

                {currentQuestion.questionType === 'true_false' && (
                  <>
                    <label className="radio-choice">
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        checked={answers[currentQuestion.id]?.selectedBoolean === true}
                        onChange={() => updateAnswer(currentQuestion.id, { selectedBoolean: true })}
                      />
                      <span className="choice-text">True</span>
                    </label>
                    <label className="radio-choice">
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        checked={answers[currentQuestion.id]?.selectedBoolean === false}
                        onChange={() => updateAnswer(currentQuestion.id, { selectedBoolean: false })}
                      />
                      <span className="choice-text">False</span>
                    </label>
                  </>
                )}

                {currentQuestion.questionType === 'short_answer' && (
                  <textarea
                    className="short-answer-input"
                    rows={5}
                    value={answers[currentQuestion.id]?.answerText ?? ''}
                    onChange={(event) =>
                      updateAnswer(currentQuestion.id, {
                        answerText: event.target.value,
                      })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="quiz-navigation">
          <button
            className="btn-nav btn-previous"
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button className="btn-nav btn-next" type="button" onClick={handleNext} disabled={submitting || !hasCurrentAnswer}>
            {submitting ? 'Submitting...' : currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default Chapter1Quiz