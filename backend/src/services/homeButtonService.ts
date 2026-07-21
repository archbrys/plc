import type { HomeButton } from '@prisma/client'

import { prisma } from '../config/prisma.js'
import { CourseRepository } from '../repositories/courseRepository.js'
import { HomeButtonRepository } from '../repositories/homeButtonRepository.js'
import { SubmissionRepository } from '../repositories/submissionRepository.js'
import { HttpError } from '../utils/httpError.js'

const repository = new HomeButtonRepository(prisma)
const courseRepository = new CourseRepository(prisma)
const submissionRepository = new SubmissionRepository(prisma)

export interface HomeButtonResponse {
  id: number
  label: string
  orderNumber: number
  targetType: 'CHAPTER' | 'ROUTE' | 'GROUP'
  chapterId: number | null
  route: string | null
  chapterGroup: string | null
  isActive: boolean
  requiredQuestionSetIds: string[]
  locked: boolean
}

export type UpsertHomeButtonInput =
  | {
      label: string
      orderNumber?: number
      targetType: 'CHAPTER'
      chapterId: number
      isActive?: boolean
      requiredQuestionSetIds?: string[]
    }
  | {
      label: string
      orderNumber?: number
      targetType: 'ROUTE'
      route: string
      isActive?: boolean
      requiredQuestionSetIds?: string[]
    }
  | {
      label: string
      orderNumber?: number
      targetType: 'GROUP'
      chapterGroup: string
      isActive?: boolean
      requiredQuestionSetIds?: string[]
    }

function mapButton(button: HomeButton, submittedQuestionSetIds?: Set<string>): HomeButtonResponse {
  const requiredQuestionSetIds: string[] = JSON.parse(button.requiredQuestionSetIds)
  const locked =
    submittedQuestionSetIds !== undefined &&
    requiredQuestionSetIds.length > 0 &&
    !requiredQuestionSetIds.every((id) => submittedQuestionSetIds.has(id))

  return {
    id: button.id,
    label: button.label,
    orderNumber: button.orderNumber,
    targetType: button.targetType as 'CHAPTER' | 'ROUTE' | 'GROUP',
    chapterId: button.chapterId,
    route: button.route,
    chapterGroup: button.chapterGroup,
    isActive: button.isActive,
    requiredQuestionSetIds,
    locked,
  }
}

async function assertValidTarget(input: UpsertHomeButtonInput): Promise<void> {
  if (input.targetType !== 'CHAPTER') return

  const chapter = await courseRepository.getChapterById(input.chapterId)
  if (!chapter) {
    throw new HttpError(404, 'Chapter not found')
  }
}

export const homeButtonService = {
  async listButtons(includeInactive: boolean, studentId?: string): Promise<HomeButtonResponse[]> {
    const buttons = includeInactive ? await repository.getAll() : await repository.getActive()
    const submittedQuestionSetIds = studentId
      ? new Set(await submissionRepository.listQuestionSetIdsByStudent(studentId))
      : undefined
    return buttons.map((button) => mapButton(button, submittedQuestionSetIds))
  },

  async createButton(input: UpsertHomeButtonInput): Promise<HomeButtonResponse> {
    await assertValidTarget(input)

    const maxOrderNumber = await repository.getMaxOrderNumber()
    const button = await repository.create({
      label: input.label,
      orderNumber: input.orderNumber ?? maxOrderNumber + 1,
      targetType: input.targetType,
      chapterId: input.targetType === 'CHAPTER' ? input.chapterId : null,
      route: input.targetType === 'ROUTE' ? input.route : null,
      chapterGroup: input.targetType === 'GROUP' ? input.chapterGroup : null,
      isActive: input.isActive ?? true,
      requiredQuestionSetIds: JSON.stringify(input.requiredQuestionSetIds ?? []),
    })
    return mapButton(button)
  },

  async updateButton(id: number, input: UpsertHomeButtonInput): Promise<HomeButtonResponse> {
    const existing = await repository.getById(id)
    if (!existing) {
      throw new HttpError(404, 'Home button not found')
    }

    await assertValidTarget(input)

    const button = await repository.update(id, {
      label: input.label,
      orderNumber: input.orderNumber ?? existing.orderNumber,
      targetType: input.targetType,
      chapterId: input.targetType === 'CHAPTER' ? input.chapterId : null,
      route: input.targetType === 'ROUTE' ? input.route : null,
      chapterGroup: input.targetType === 'GROUP' ? input.chapterGroup : null,
      isActive: input.isActive ?? existing.isActive,
      requiredQuestionSetIds: JSON.stringify(
        input.requiredQuestionSetIds ?? JSON.parse(existing.requiredQuestionSetIds),
      ),
    })
    return mapButton(button)
  },

  async deleteButton(id: number): Promise<void> {
    const existing = await repository.getById(id)
    if (!existing) {
      throw new HttpError(404, 'Home button not found')
    }
    await repository.delete(id)
  },

  async reorderButtons(orderedIds: number[]): Promise<void> {
    await repository.reorder(orderedIds)
  },
}
