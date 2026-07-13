import {
  QuestionSetStatus,
  QuestionType,
  type Choice,
  type Question,
  type QuestionSet,
} from '@prisma/client'

import type { QuestionSetDTO } from '../types/domain.js'
import { HttpError } from '../utils/httpError.js'
import { prisma } from '../config/prisma.js'
import { QuestionSetRepository } from '../repositories/questionSetRepository.js'

function mapQuestionType(type: QuestionType): 'multiple_choice' | 'true_false' | 'short_answer' {
  if (type === QuestionType.MULTIPLE_CHOICE) return 'multiple_choice'
  if (type === QuestionType.TRUE_FALSE) return 'true_false'
  return 'short_answer'
}

function mapStatus(status: QuestionSetStatus): 'draft' | 'published' | 'archived' {
  if (status === QuestionSetStatus.DRAFT) return 'draft'
  if (status === QuestionSetStatus.PUBLISHED) return 'published'
  return 'archived'
}

function mapQuestionSet(
  set: QuestionSet & { questions: (Question & { choices: Choice[] })[] },
): QuestionSetDTO {
  return {
    id: set.id,
    title: set.title,
    description: set.description,
    status: mapStatus(set.status),
    questions: set.questions.map((question) => ({
      id: question.id,
      questionSetId: question.questionSetId,
      questionText: question.questionText,
      questionType: mapQuestionType(question.questionType),
      orderNumber: question.orderNumber,
      points: question.points,
      required: question.required,
      choices: question.choices.map((choice) => ({
        id: choice.id,
        questionId: choice.questionId,
        choiceText: choice.choiceText,
        isCorrect: choice.isCorrect,
        orderNumber: choice.orderNumber,
      })),
    })),
  }
}

function parseStatus(status: string): QuestionSetStatus {
  if (status === 'draft') return QuestionSetStatus.DRAFT
  if (status === 'published') return QuestionSetStatus.PUBLISHED
  if (status === 'archived') return QuestionSetStatus.ARCHIVED
  throw new HttpError(400, 'Invalid question set status.')
}

function parseType(type: string): QuestionType {
  if (type === 'multiple_choice') return QuestionType.MULTIPLE_CHOICE
  if (type === 'true_false') return QuestionType.TRUE_FALSE
  if (type === 'short_answer') return QuestionType.SHORT_ANSWER
  throw new HttpError(400, 'Invalid question type.')
}

function validateForPublish(set: QuestionSetDTO): void {
  const errors: string[] = []

  if (!set.title.trim()) errors.push('Title is required.')
  if (set.questions.length === 0) errors.push('At least one question is required.')

  set.questions.forEach((question, index) => {
    if (!question.questionText.trim()) {
      errors.push(`Question ${index + 1} text is required.`)
    }

    if (question.questionType === 'multiple_choice') {
      if (question.choices.length < 2) {
        errors.push(`Question ${index + 1} requires at least two choices.`)
      }
      if (!question.choices.some((choice) => choice.isCorrect)) {
        errors.push(`Question ${index + 1} requires a correct choice.`)
      }
    }

    if (question.questionType === 'true_false') {
      if (question.choices.length !== 2) {
        errors.push(`Question ${index + 1} must include exactly True/False choices.`)
      }
    }
  })

  if (errors.length > 0) {
    throw new HttpError(400, errors.join(' '))
  }
}

const PROTECTED_TITLE = 'PLC Fundamentals'

export interface UpsertQuestionSetInput {
  id?: string
  title: string
  description: string
  status: 'draft' | 'published' | 'archived'
  questions: Array<{
    questionText: string
    questionType: 'multiple_choice' | 'true_false' | 'short_answer'
    points: number
    required: boolean
    choices: Array<{
      choiceText: string
      isCorrect: boolean
    }>
  }>
}

export class QuestionSetService {
  constructor(private readonly repository: QuestionSetRepository) {}

  async listAll(): Promise<QuestionSetDTO[]> {
    const sets = await this.repository.list()
    return sets.map((set) => mapQuestionSet(set as QuestionSet & { questions: (Question & { choices: Choice[] })[] }))
  }

  async listPublished(): Promise<QuestionSetDTO[]> {
    const sets = await this.repository.list(QuestionSetStatus.PUBLISHED)
    return sets.map((set) => mapQuestionSet(set as QuestionSet & { questions: (Question & { choices: Choice[] })[] }))
  }

  async getById(id: string): Promise<QuestionSetDTO> {
    const set = await this.repository.getById(id)
    if (!set) throw new HttpError(404, 'Question set not found.')
    return mapQuestionSet(set as QuestionSet & { questions: (Question & { choices: Choice[] })[] })
  }

  async upsert(payload: UpsertQuestionSetInput): Promise<QuestionSetDTO> {
    const normalized: QuestionSetDTO = {
      id: payload.id ?? '',
      title: payload.title,
      description: payload.description,
      status: payload.status,
      questions: payload.questions.map((question, index) => ({
        id: '',
        questionSetId: '',
        questionText: question.questionText,
        questionType: question.questionType,
        orderNumber: index + 1,
        points: question.points,
        required: question.required,
        choices: question.choices.map((choice, choiceIndex) => ({
          id: '',
          questionId: '',
          choiceText: choice.choiceText,
          isCorrect: choice.isCorrect,
          orderNumber: choiceIndex + 1,
        })),
      })),
    }

    if (normalized.status === 'published') {
      validateForPublish(normalized)
    }

    const status = parseStatus(payload.status)

    if (!payload.id) {
      const created = await this.repository.create({
        title: payload.title,
        description: payload.description,
        status,
        questions: {
          create: payload.questions.map((question, index) => ({
            questionText: question.questionText,
            questionType: parseType(question.questionType),
            orderNumber: index + 1,
            points: question.points,
            required: question.required,
            choices: {
              create: question.choices.map((choice, choiceIndex) => ({
                choiceText: choice.choiceText,
                isCorrect: choice.isCorrect,
                orderNumber: choiceIndex + 1,
              })),
            },
          })),
        },
      })

      return mapQuestionSet(created as QuestionSet & { questions: (Question & { choices: Choice[] })[] })
    }

    const updateId = payload.id
    if (!updateId) {
      throw new HttpError(400, 'Question set ID is required for update.')
    }

    await prisma.$transaction(async (tx) => {
      await tx.choice.deleteMany({ where: { question: { questionSetId: updateId } } })
      await tx.question.deleteMany({ where: { questionSetId: updateId } })

      await tx.questionSet.update({
        where: { id: updateId },
        data: {
          title: payload.title,
          description: payload.description,
          status,
          questions: {
            create: payload.questions.map((question, index) => ({
              questionText: question.questionText,
              questionType: parseType(question.questionType),
              orderNumber: index + 1,
              points: question.points,
              required: question.required,
              choices: {
                create: question.choices.map((choice, choiceIndex) => ({
                  choiceText: choice.choiceText,
                  isCorrect: choice.isCorrect,
                  orderNumber: choiceIndex + 1,
                })),
              },
            })),
          },
        },
      })
    })

    const updated = await this.repository.getById(updateId)
    if (!updated) throw new HttpError(404, 'Question set not found after update.')
    return mapQuestionSet(updated as QuestionSet & { questions: (Question & { choices: Choice[] })[] })
  }

  async setStatus(id: string, status: 'draft' | 'published' | 'archived'): Promise<QuestionSetDTO> {
    const existing = await this.getById(id)
    const next = { ...existing, status }

    if (status === 'published') {
      validateForPublish(next)
    }

    const updated = await this.repository.update(id, { status: parseStatus(status) })
    if (!updated) throw new HttpError(404, 'Question set not found.')
    return mapQuestionSet(updated as QuestionSet & { questions: (Question & { choices: Choice[] })[] })
  }

  async remove(id: string): Promise<void> {
    const existing = await this.repository.getById(id)
    if (!existing) throw new HttpError(404, 'Question set not found.')

    if (existing.title.trim().toLowerCase() === PROTECTED_TITLE.toLowerCase()) {
      throw new HttpError(400, `"${PROTECTED_TITLE}" cannot be deleted.`)
    }

    await this.repository.delete(id)
  }
}
