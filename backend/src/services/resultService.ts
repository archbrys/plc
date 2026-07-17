import {
  QuestionType,
  type Choice,
  type Question,
  type QuestionSet,
  type StudentAnswer,
  type Submission,
} from '@prisma/client'

import type { QuizResultDTO, StudentAnswerDTO } from '../types/domain.js'
import { HttpError } from '../utils/httpError.js'
import { prisma } from '../config/prisma.js'
import { QuestionSetRepository } from '../repositories/questionSetRepository.js'
import { SubmissionRepository } from '../repositories/submissionRepository.js'

function mapResult(
  submission: Submission & {
    questionSet: QuestionSet
    student: { fullName: string; studentId: string | null }
    answers: (StudentAnswer & { question: Question })[]
  },
): QuizResultDTO {
  const scores = submission.answers.map((answer) => ({
    questionId: answer.questionId,
    earnedPoints: answer.awardedPoints,
    maxPoints: answer.question.points,
  }))

  const answerData: StudentAnswerDTO[] = submission.answers.map((answer) => {
    const mapped: StudentAnswerDTO = { questionId: answer.questionId }

    if (answer.answerText !== null) {
      mapped.answerText = answer.answerText
    }
    if (answer.selectedChoiceId !== null) {
      mapped.selectedChoiceId = answer.selectedChoiceId
    }
    if (answer.selectedBoolean !== null) {
      mapped.selectedBoolean = answer.selectedBoolean
    }

    return mapped
  })

  return {
    id: submission.id,
    questionSetId: submission.questionSetId,
    questionSetTitle: submission.questionSet.title,
    studentId: submission.student.studentId ?? submission.studentId,
    studentName: submission.student.fullName,
    totalPoints: submission.totalPoints,
    earnedPoints: submission.earnedPoints,
    submittedAt: submission.submittedAt.toISOString(),
    answers: answerData,
    scores,
  }
}

function gradeQuestion(question: Question & { choices: Choice[] }, answer?: StudentAnswerDTO): number {
  if (!answer) return 0

  if (question.questionType === QuestionType.MULTIPLE_CHOICE) {
    const selected = question.choices.find((choice) => choice.id === answer.selectedChoiceId)
    return selected?.isCorrect ? question.points : 0
  }

  if (question.questionType === QuestionType.TRUE_FALSE) {
    const trueChoice = question.choices.find((choice) => choice.isCorrect)
    const expected = trueChoice?.choiceText.toLowerCase() === 'true'
    return expected === answer.selectedBoolean ? question.points : 0
  }

  return answer.answerText?.trim() ? question.points : 0
}

export class ResultService {
  constructor(
    private readonly questionSetRepository: QuestionSetRepository,
    private readonly submissionRepository: SubmissionRepository,
  ) {}

  async submit(questionSetId: string, studentId: string, answers: StudentAnswerDTO[]): Promise<QuizResultDTO> {
    const questionSet = await this.questionSetRepository.getById(questionSetId)

    if (!questionSet || questionSet.status !== 'PUBLISHED') {
      throw new HttpError(400, 'Question set is unavailable.')
    }

    for (const question of questionSet.questions) {
      if (question.required) {
        const answer = answers.find((item) => item.questionId === question.id)
        const hasValue =
          question.questionType === QuestionType.MULTIPLE_CHOICE
            ? Boolean(answer?.selectedChoiceId)
            : question.questionType === QuestionType.TRUE_FALSE
              ? typeof answer?.selectedBoolean === 'boolean'
              : Boolean(answer?.answerText?.trim())

        if (!hasValue) {
          throw new HttpError(400, `Question ${question.orderNumber} is required.`)
        }
      }
    }

    const scores = questionSet.questions.map((question) => {
      const answer = answers.find((item) => item.questionId === question.id)
      return {
        questionId: question.id,
        awardedPoints: gradeQuestion(question, answer),
        maxPoints: question.points,
        answer,
      }
    })

    const totalPoints = scores.reduce((sum, score) => sum + score.maxPoints, 0)
    const earnedPoints = scores.reduce((sum, score) => sum + score.awardedPoints, 0)

    const created = await this.submissionRepository.create({
      questionSet: { connect: { id: questionSetId } },
      student: { connect: { id: studentId } },
      totalPoints,
      earnedPoints,
      answers: {
        create: scores.map((score) => {
          const createPayload: {
            question: { connect: { id: string } }
            selectedChoice?: { connect: { id: string } }
            selectedBoolean: boolean | null
            answerText: string | null
            awardedPoints: number
          } = {
            question: { connect: { id: score.questionId } },
            selectedBoolean: score.answer?.selectedBoolean ?? null,
            answerText: score.answer?.answerText ?? null,
            awardedPoints: score.awardedPoints,
          }

          if (score.answer?.selectedChoiceId) {
            createPayload.selectedChoice = { connect: { id: score.answer.selectedChoiceId } }
          }

          return createPayload
        }),
      },
    })

    return mapResult(created as Submission & {
      questionSet: QuestionSet
      student: { fullName: string; studentId: string | null }
      answers: (StudentAnswer & { question: Question })[]
    })
  }

  async listAll(): Promise<QuizResultDTO[]> {
    const results = await this.submissionRepository.listAll()
    return results.map((item) =>
      mapResult(item as Submission & {
        questionSet: QuestionSet
        student: { fullName: string; studentId: string | null }
        answers: (StudentAnswer & { question: Question })[]
      }),
    )
  }

  async listByStudent(studentId: string): Promise<QuizResultDTO[]> {
    const student = await prisma.user.findUnique({ where: { id: studentId } })
    if (!student) {
      throw new HttpError(404, 'Student account not found.')
    }

    const results = await this.submissionRepository.listByStudent(studentId)
    return results.map((item) =>
      mapResult(item as Submission & {
        questionSet: QuestionSet
        student: { fullName: string; studentId: string | null }
        answers: (StudentAnswer & { question: Question })[]
      }),
    )
  }

  async remove(id: string): Promise<void> {
    const existing = await this.submissionRepository.findById(id)
    if (!existing) throw new HttpError(404, 'Result not found.')

    await this.submissionRepository.delete(id)
  }
}
