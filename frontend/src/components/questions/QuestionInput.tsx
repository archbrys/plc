import type { Question, StudentAnswer } from '../../types/quiz'

interface QuestionInputProps {
  question: Question
  answer?: StudentAnswer
  onChange: (answer: StudentAnswer) => void
  disabled?: boolean
}

export function QuestionInput({ question, answer, onChange, disabled = false }: QuestionInputProps) {
  const label = `${question.orderNumber}. ${question.questionText}`

  if (question.questionType === 'multiple_choice') {
    return (
      <section className="question-card">
        <h3>{label}</h3>
        <p className="muted">
          {question.points} point{question.points === 1 ? '' : 's'}
          {question.required ? ' • Required' : ''}
        </p>
        <div className="question-options">
          {question.choices
            .slice()
            .sort((a, b) => a.orderNumber - b.orderNumber)
            .map((choice) => (
              <label key={choice.id} className="choice-row">
                <input
                  type="radio"
                  name={question.id}
                  checked={answer?.selectedChoiceId === choice.id}
                  disabled={disabled}
                  onChange={() =>
                    onChange({
                      questionId: question.id,
                      selectedChoiceId: choice.id,
                    })
                  }
                />
                <span>{choice.choiceText}</span>
              </label>
            ))}
        </div>
      </section>
    )
  }

  if (question.questionType === 'true_false') {
    return (
      <section className="question-card">
        <h3>{label}</h3>
        <p className="muted">
          {question.points} point{question.points === 1 ? '' : 's'}
          {question.required ? ' • Required' : ''}
        </p>
        <div className="inline-actions">
          <button
            type="button"
            className={`btn ${answer?.selectedBoolean === true ? '' : 'secondary'}`}
            disabled={disabled}
            onClick={() =>
              onChange({
                questionId: question.id,
                selectedBoolean: true,
              })
            }
          >
            True
          </button>
          <button
            type="button"
            className={`btn ${answer?.selectedBoolean === false ? '' : 'secondary'}`}
            disabled={disabled}
            onClick={() =>
              onChange({
                questionId: question.id,
                selectedBoolean: false,
              })
            }
          >
            False
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="question-card">
      <h3>{label}</h3>
      <p className="muted">
        {question.points} point{question.points === 1 ? '' : 's'}
        {question.required ? ' • Required' : ''}
      </p>
      <textarea
        className="input"
        rows={3}
        placeholder="Type your answer"
        value={answer?.answerText ?? ''}
        disabled={disabled}
        onChange={(event) =>
          onChange({
            questionId: question.id,
            answerText: event.target.value,
          })
        }
      />
    </section>
  )
}
