import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { questionSetService } from '../../services/questionSetService'
import { resultService } from '../../services/resultService'
import type { QuestionSet, StudentAnswer } from '../../types/quiz'
import type { QuizPageConfig } from '../../types/course'
import './QuizPage.css'

interface QuizPageProps {
  config: QuizPageConfig
  onPrevious?: () => void
}

export function QuizPage({ config, onPrevious }: QuizPageProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null)
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    questionSetService.listPublished().then((sets) => {
      const targetSet = sets.find((set) => set.id === config.questionSetId) ?? null
      setQuestionSet(targetSet)
      setLoading(false)
    })
  }, [config.questionSetId])

  const orderedQuestions = useMemo(
    () => [...(questionSet?.questions ?? [])].sort((a, b) => a.orderNumber - b.orderNumber),
    [questionSet?.questions]
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
    } else {
      onPrevious?.()
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
      <main className="plc-quiz-content">
        <p className="muted">Loading quiz...</p>
      </main>
    )
  }

  if (!questionSet) {
    return (
      <main className="plc-quiz-content">
        <p className="muted">Quiz not found for this page.</p>
      </main>
    )
  }

  if (!started) {
    return (
      <main className="quiz-start-content">
        <h1 className="quiz-start-title">Quiz Time!</h1>
        <div className="quiz-navigation">
          <button className="btn-nav btn-previous" type="button" onClick={onPrevious}>
            Previous
          </button>
          <button className="btn large ready-btn quiz-start-btn" type="button" onClick={() => setStarted(true)}>
            Begin
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="plc-quiz-content">
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
        <button className="btn-nav btn-previous" type="button" onClick={handlePrevious}>
          Previous
        </button>
        <button
          className="btn-nav btn-next"
          type="button"
          onClick={handleNext}
          disabled={submitting || !hasCurrentAnswer}
        >
          {submitting ? 'Submitting...' : currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </main>
  )
}
