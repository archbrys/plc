import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../../components/common/AppShell'
import { useAuth } from '../../hooks/useAuth'
import { questionSetService } from '../../services/questionSetService'
import { resultService } from '../../services/resultService'
import type { QuestionSet, StudentAnswer } from '../../types/quiz'

export function StudentQuestionSetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null)
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({})
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    questionSetService.getById(id).then((set) => {
      if (!set || set.status !== 'published') {
        setQuestionSet(null)
        return
      }
      setQuestionSet(set)
    })
  }, [id])

  const orderedQuestions = useMemo(
    () => [...(questionSet?.questions ?? [])].sort((a, b) => a.orderNumber - b.orderNumber),
    [questionSet?.questions],
  )

  if (!questionSet) {
    return (
      <AppShell title="Question Set" links={[{ label: 'Back', to: '/student/question-sets' }]}>
        <p className="muted">Question set not found or unavailable.</p>
      </AppShell>
    )
  }

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    if (!user || user.role !== 'student') {
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
    navigate('/student/result')
  }

  return (
    <AppShell
      title={questionSet.title}
      subtitle={questionSet.description}
      links={[{ label: 'Back to Sets', to: '/student/question-sets' }]}
    >
      <form className="stack" onSubmit={handleSubmit}>
        {error ? <p className="error-text">{error}</p> : null}

        {orderedQuestions.map((question) => (
          <section key={question.id} className="card">
            <h3>
              {question.orderNumber}. {question.questionText}
            </h3>
            <p className="muted">Points: {question.points}</p>

            {question.questionType === 'multiple_choice'
              ? question.choices.map((choice) => (
                  <label key={choice.id} className="choice-row">
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id]?.selectedChoiceId === choice.id}
                      onChange={() => updateAnswer(question.id, { selectedChoiceId: choice.id })}
                    />
                    <span>{choice.choiceText}</span>
                  </label>
                ))
              : null}

            {question.questionType === 'true_false' ? (
              <div className="grid-two">
                <label className="choice-row">
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id]?.selectedBoolean === true}
                    onChange={() => updateAnswer(question.id, { selectedBoolean: true })}
                  />
                  <span>True</span>
                </label>
                <label className="choice-row">
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id]?.selectedBoolean === false}
                    onChange={() => updateAnswer(question.id, { selectedBoolean: false })}
                  />
                  <span>False</span>
                </label>
              </div>
            ) : null}

            {question.questionType === 'short_answer' ? (
              <textarea
                rows={3}
                value={answers[question.id]?.answerText ?? ''}
                onChange={(event) =>
                  updateAnswer(question.id, {
                    answerText: event.target.value,
                  })
                }
              />
            ) : null}
          </section>
        ))}

        <button className="btn large" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </button>
      </form>
    </AppShell>
  )
}
