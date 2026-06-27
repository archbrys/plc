import type { Question, QuestionSet, StudentAnswer } from '../types/quiz'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

function validateRequiredText(value: string, fieldName: string): string | null {
  if (!value.trim()) {
    return `${fieldName} is required.`
  }
  return null
}

export function validateQuestion(question: Question): ValidationResult {
  const errors: string[] = []

  const textError = validateRequiredText(question.questionText, 'Question text')
  if (textError) {
    errors.push(textError)
  }

  if (question.points <= 0) {
    errors.push('Points must be greater than 0.')
  }

  if (question.questionType === 'multiple_choice') {
    if (question.choices.length === 0) {
      errors.push('Multiple choice questions must include at least one choice.')
    }

    if (!question.choices.some((choice) => choice.isCorrect)) {
      errors.push('Multiple choice questions must include at least one correct choice.')
    }
  }

  return { valid: errors.length === 0, errors }
}

export function validateQuestionSetForPublish(questionSet: QuestionSet): ValidationResult {
  const errors: string[] = []

  const titleError = validateRequiredText(questionSet.title, 'Title')
  if (titleError) {
    errors.push(titleError)
  }

  if (questionSet.questions.length === 0) {
    errors.push('Cannot publish a question set without questions.')
  }

  for (const question of questionSet.questions) {
    const questionValidation = validateQuestion(question)
    if (!questionValidation.valid) {
      errors.push(...questionValidation.errors.map((error) => `${question.questionText || 'Question'}: ${error}`))
    }
  }

  return { valid: errors.length === 0, errors }
}

export function validateStudentAnswers(
  questionSet: QuestionSet,
  answers: StudentAnswer[],
): ValidationResult {
  const errors: string[] = []

  questionSet.questions.forEach((question) => {
    if (!question.required) {
      return
    }

    const answer = answers.find((item) => item.questionId === question.id)

    if (!answer) {
      errors.push(`Question ${question.orderNumber} is required.`)
      return
    }

    if (question.questionType === 'multiple_choice' && !answer.selectedChoiceId) {
      errors.push(`Question ${question.orderNumber} is required.`)
    }

    if (question.questionType === 'true_false' && answer.selectedBoolean === undefined) {
      errors.push(`Question ${question.orderNumber} is required.`)
    }

    if (question.questionType === 'short_answer' && !answer.answerText?.trim()) {
      errors.push(`Question ${question.orderNumber} is required.`)
    }
  })

  return { valid: errors.length === 0, errors }
}
