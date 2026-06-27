import { useMemo, useState, type FormEvent } from 'react'
import type { Question, QuestionSet } from '../../types/quiz'

interface QuestionSetEditorProps {
  initialValue: QuestionSet
  onSave: (data: QuestionSet) => Promise<void>
  onCancel: () => void
  submitLabel: string
}

export function QuestionSetEditor({
  initialValue,
  onSave,
  onCancel,
  submitLabel,
}: QuestionSetEditorProps) {
  const [value, setValue] = useState<QuestionSet>(initialValue)
  const [error, setError] = useState<string>('')
  const [saving, setSaving] = useState(false)

  const questionCountLabel = useMemo(
    () => `${value.questions.length} question${value.questions.length === 1 ? '' : 's'}`,
    [value.questions.length],
  )

  const updateQuestion = (questionId: string, patch: Partial<Question>) => {
    setValue((current) => ({
      ...current,
      questions: current.questions.map((question) =>
        question.id === questionId ? { ...question, ...patch } : question,
      ),
    }))
  }

  const addQuestion = () => {
    setValue((current) => ({
      ...current,
      questions: [
        ...current.questions,
        {
          id: `tmp-q-${Date.now()}`,
          questionSetId: current.id,
          questionText: '',
          questionType: 'multiple_choice',
          orderNumber: current.questions.length + 1,
          points: 1,
          required: true,
          choices: [
            {
              id: `tmp-c-${Date.now()}-1`,
              questionId: `tmp-q-${Date.now()}`,
              choiceText: '',
              isCorrect: false,
              orderNumber: 1,
            },
          ],
        },
      ],
    }))
  }

  const removeQuestion = (questionId: string) => {
    setValue((current) => ({
      ...current,
      questions: current.questions
        .filter((question) => question.id !== questionId)
        .map((question, index) => ({ ...question, orderNumber: index + 1 })),
    }))
  }

  const addChoice = (questionId: string) => {
    setValue((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) {
          return question
        }

        return {
          ...question,
          choices: [
            ...question.choices,
            {
              id: `tmp-c-${Date.now()}-${question.choices.length + 1}`,
              questionId,
              choiceText: '',
              isCorrect: false,
              orderNumber: question.choices.length + 1,
            },
          ],
        }
      }),
    }))
  }

  const removeChoice = (questionId: string, choiceId: string) => {
    setValue((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) {
          return question
        }

        return {
          ...question,
          choices: question.choices
            .filter((choice) => choice.id !== choiceId)
            .map((choice, index) => ({ ...choice, orderNumber: index + 1 })),
        }
      }),
    }))
  }

  const updateChoice = (
    questionId: string,
    choiceId: string,
    patch: Partial<Question['choices'][number]>,
  ) => {
    setValue((current) => ({
      ...current,
      questions: current.questions.map((question) => {
        if (question.id !== questionId) {
          return question
        }

        return {
          ...question,
          choices: question.choices.map((choice) =>
            choice.id === choiceId ? { ...choice, ...patch } : choice,
          ),
        }
      }),
    }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!value.title.trim()) {
      setError('Title is required.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await onSave(value)
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Failed to save question set.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      {error ? <p className="error-text">{error}</p> : null}

      <label className="field">
        <span>Title</span>
        <input
          value={value.title}
          onChange={(event) => setValue((current) => ({ ...current, title: event.target.value }))}
          required
        />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          value={value.description}
          rows={3}
          onChange={(event) => setValue((current) => ({ ...current, description: event.target.value }))}
        />
      </label>

      <label className="field">
        <span>Status</span>
        <select
          value={value.status}
          onChange={(event) =>
            setValue((current) => ({
              ...current,
              status: event.target.value as QuestionSet['status'],
            }))
          }
        >
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="archived">archived</option>
        </select>
      </label>

      <div className="row-between">
        <h2>Questions</h2>
        <p className="muted">{questionCountLabel}</p>
      </div>

      {value.questions.map((question, index) => (
        <section key={question.id} className="card">
          <div className="row-between">
            <h3>Question {index + 1}</h3>
            <button
              type="button"
              className="btn danger"
              onClick={() => removeQuestion(question.id)}
            >
              Remove
            </button>
          </div>

          <label className="field">
            <span>Question Text</span>
            <input
              value={question.questionText}
              onChange={(event) => updateQuestion(question.id, { questionText: event.target.value })}
              required
            />
          </label>

          <div className="grid-two">
            <label className="field">
              <span>Type</span>
              <select
                value={question.questionType}
                onChange={(event) =>
                  updateQuestion(question.id, {
                    questionType: event.target.value as Question['questionType'],
                    choices:
                      event.target.value === 'short_answer'
                        ? []
                        : question.choices.length
                          ? question.choices
                          : [
                              {
                                id: `tmp-c-${Date.now()}`,
                                questionId: question.id,
                                choiceText: '',
                                isCorrect: false,
                                orderNumber: 1,
                              },
                            ],
                  })
                }
              >
                <option value="multiple_choice">multiple_choice</option>
                <option value="true_false">true_false</option>
                <option value="short_answer">short_answer</option>
              </select>
            </label>

            <label className="field">
              <span>Points</span>
              <input
                type="number"
                min={1}
                value={question.points}
                onChange={(event) =>
                  updateQuestion(question.id, {
                    points: Number(event.target.value),
                  })
                }
              />
            </label>
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(event) => updateQuestion(question.id, { required: event.target.checked })}
            />
            Required question
          </label>

          {question.questionType !== 'short_answer' ? (
            <div className="stack">
              <div className="row-between">
                <h4>Choices</h4>
                <button type="button" className="btn secondary" onClick={() => addChoice(question.id)}>
                  Add Choice
                </button>
              </div>

              {question.choices.map((choice, choiceIndex) => (
                <div key={choice.id} className="choice-row">
                  <span className="choice-index">{choiceIndex + 1}</span>
                  <input
                    value={choice.choiceText}
                    onChange={(event) =>
                      updateChoice(question.id, choice.id, {
                        choiceText: event.target.value,
                      })
                    }
                    placeholder="Choice text"
                    required={question.questionType === 'multiple_choice'}
                  />
                  <label className="checkbox-row inline">
                    <input
                      type="checkbox"
                      checked={choice.isCorrect}
                      onChange={(event) =>
                        updateChoice(question.id, choice.id, {
                          isCorrect: event.target.checked,
                        })
                      }
                    />
                    Correct
                  </label>
                  <button
                    type="button"
                    className="btn danger"
                    onClick={() => removeChoice(question.id, choice.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ))}

      <div className="row-between">
        <button type="button" className="btn secondary" onClick={addQuestion}>
          Add Question
        </button>
        <div className="header-actions">
          <button type="button" className="btn secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
