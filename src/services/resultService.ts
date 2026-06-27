import type { QuizResult, StudentAnswer } from '../types/quiz'
import { createId } from '../utils/id'
import { validateStudentAnswers } from '../utils/validation'
import { initializeMockData } from './mockData'
import { questionSetService } from './questionSetService'
import { getResults, setResults, getStudents } from './storage'

initializeMockData()

export const resultService = {
  async submit(
    questionSetId: string,
    studentId: string,
    answers: StudentAnswer[],
  ): Promise<{ ok: boolean; errors?: string[]; result?: QuizResult }> {
    const questionSet = await questionSetService.getById(questionSetId)

    if (!questionSet || questionSet.status !== 'published') {
      return { ok: false, errors: ['Question set is unavailable.'] }
    }

    const validation = validateStudentAnswers(questionSet, answers)
    if (!validation.valid) {
      return { ok: false, errors: validation.errors }
    }

    const student = getStudents().find((item) => item.id === studentId)
    if (!student) {
      return { ok: false, errors: ['Student account not found.'] }
    }

    const scores = questionSet.questions.map((question) => {
      const answer = answers.find((item) => item.questionId === question.id)
      let earnedPoints = 0

      if (answer) {
        if (question.questionType === 'multiple_choice') {
          const selected = question.choices.find((choice) => choice.id === answer.selectedChoiceId)
          earnedPoints = selected?.isCorrect ? question.points : 0
        }

        if (question.questionType === 'true_false') {
          const trueChoice = question.choices.find((choice) => choice.isCorrect)
          const trueLabel = trueChoice?.choiceText.toLowerCase() === 'true'
          earnedPoints = trueLabel === answer.selectedBoolean ? question.points : 0
        }

        if (question.questionType === 'short_answer') {
          // Backend integration point:
          // Replace this simplistic scoring with server-side/manual grading logic.
          earnedPoints = answer.answerText?.trim() ? question.points : 0
        }
      }

      return {
        questionId: question.id,
        earnedPoints,
        maxPoints: question.points,
      }
    })

    const totalPoints = scores.reduce((sum, score) => sum + score.maxPoints, 0)
    const earnedPoints = scores.reduce((sum, score) => sum + score.earnedPoints, 0)

    const result: QuizResult = {
      id: createId('result'),
      questionSetId,
      questionSetTitle: questionSet.title,
      studentId: student.id,
      studentName: student.fullName,
      totalPoints,
      earnedPoints,
      submittedAt: new Date().toISOString(),
      answers,
      scores,
    }

    setResults([result, ...getResults()])
    return { ok: true, result }
  },

  async listAll(): Promise<QuizResult[]> {
    // Backend integration point:
    // Replace local storage reads with GET /api/results.
    return getResults().sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  },

  async listByStudent(studentId: string): Promise<QuizResult[]> {
    return getResults()
      .filter((result) => result.studentId === studentId)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
  },

  async getById(id: string): Promise<QuizResult | null> {
    return getResults().find((result) => result.id === id) ?? null
  },
}
