import type { HomeButton } from '@prisma/client'

import { prisma } from '../config/prisma.js'
import { CourseRepository } from '../repositories/courseRepository.js'
import { HomeButtonRepository } from '../repositories/homeButtonRepository.js'
import { HttpError } from '../utils/httpError.js'

const repository = new HomeButtonRepository(prisma)
const courseRepository = new CourseRepository(prisma)

export interface HomeButtonResponse {
  id: number
  label: string
  orderNumber: number
  targetType: 'CHAPTER' | 'ROUTE'
  chapterId: number | null
  route: string | null
  isActive: boolean
}

export type UpsertHomeButtonInput =
  | { label: string; orderNumber?: number; targetType: 'CHAPTER'; chapterId: number; isActive?: boolean }
  | { label: string; orderNumber?: number; targetType: 'ROUTE'; route: string; isActive?: boolean }

function mapButton(button: HomeButton): HomeButtonResponse {
  return {
    id: button.id,
    label: button.label,
    orderNumber: button.orderNumber,
    targetType: button.targetType as 'CHAPTER' | 'ROUTE',
    chapterId: button.chapterId,
    route: button.route,
    isActive: button.isActive,
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
  async listButtons(includeInactive: boolean): Promise<HomeButtonResponse[]> {
    const buttons = includeInactive ? await repository.getAll() : await repository.getActive()
    return buttons.map(mapButton)
  },

  async createButton(input: UpsertHomeButtonInput): Promise<HomeButtonResponse> {
    await assertValidTarget(input)

    const count = await repository.getCount()
    const button = await repository.create({
      label: input.label,
      orderNumber: input.orderNumber ?? count + 1,
      targetType: input.targetType,
      chapterId: input.targetType === 'CHAPTER' ? input.chapterId : null,
      route: input.targetType === 'ROUTE' ? input.route : null,
      isActive: input.isActive ?? true,
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
      isActive: input.isActive ?? existing.isActive,
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
