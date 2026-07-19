import type { CourseChapter, ChapterPage } from '@prisma/client'

import { prisma } from '../config/prisma.js'
import { CourseRepository } from '../repositories/courseRepository.js'
import { HomeButtonRepository } from '../repositories/homeButtonRepository.js'
import { deleteUploadedFile, extractLocalMediaUrl } from '../utils/uploadCleanup.js'
import { HttpError } from '../utils/httpError.js'

const repository = new CourseRepository(prisma)
const homeButtonRepository = new HomeButtonRepository(prisma)

export interface ChapterPageResponse {
  id: number
  type: string
  orderNumber: number
  config: unknown
}

export interface CourseChapterResponse {
  id: number
  title: string
  orderNumber: number
  pages: ChapterPageResponse[]
}

export interface CourseResponse {
  chapters: CourseChapterResponse[]
}

function mapPage(page: ChapterPage): ChapterPageResponse {
  return {
    id: page.id,
    type: page.type,
    orderNumber: page.orderNumber,
    config: JSON.parse(page.config),
  }
}

function mapChapter(chapter: CourseChapter & { pages: ChapterPage[] }): CourseChapterResponse {
  return {
    id: chapter.id,
    title: chapter.title,
    orderNumber: chapter.orderNumber,
    pages: chapter.pages.map(mapPage),
  }
}

export interface UpsertPageInput {
  type: string
  orderNumber?: number
  config: unknown
}

export const courseService = {
  async getCourse(): Promise<CourseResponse> {
    // For now, we'll get the first course. In the future, you might want to support multiple courses.
    const course = await repository.getCourseWithChapters()

    if (!course) {
      throw new HttpError(404, 'No course found')
    }

    return { chapters: course.chapters.map(mapChapter) }
  },

  async getChapterById(chapterId: number): Promise<CourseChapterResponse | null> {
    const chapter = await repository.getChapterById(chapterId)
    return chapter ? mapChapter(chapter) : null
  },

  async createChapter(payload: { title: string; orderNumber?: number }): Promise<CourseChapterResponse> {
    const course = await repository.getCourseWithChapters()
    if (!course) {
      throw new HttpError(404, 'No course found')
    }

    const orderNumber = payload.orderNumber ?? course.chapters.length + 1
    const chapter = await repository.createChapter(course.id, { title: payload.title, orderNumber })
    return mapChapter(chapter)
  },

  async updateChapter(
    chapterId: number,
    payload: { title?: string; orderNumber?: number },
  ): Promise<CourseChapterResponse> {
    const existing = await repository.getChapterById(chapterId)
    if (!existing) {
      throw new HttpError(404, 'Chapter not found')
    }

    const updated = await repository.updateChapter(chapterId, payload)
    return mapChapter(updated)
  },

  async deleteChapter(chapterId: number): Promise<void> {
    const existing = await repository.getChapterById(chapterId)
    if (!existing) {
      throw new HttpError(404, 'Chapter not found')
    }

    const linkedButtons = await homeButtonRepository.findByChapterId(chapterId)
    if (linkedButtons.length > 0) {
      const names = linkedButtons.map((button) => `"${button.label}"`).join(', ')
      throw new HttpError(
        409,
        `Cannot delete this chapter — it is linked from the ${names} home button. Unlink it first.`,
      )
    }

    await repository.deleteChapter(chapterId)
  },

  async reorderChapters(orderedIds: number[]): Promise<void> {
    await repository.reorderChapters(orderedIds)
  },

  async createPage(chapterId: number, payload: UpsertPageInput): Promise<ChapterPageResponse> {
    const chapter = await repository.getChapterById(chapterId)
    if (!chapter) {
      throw new HttpError(404, 'Chapter not found')
    }

    const orderNumber = payload.orderNumber ?? chapter.pages.length + 1
    const page = await repository.createPage(chapterId, {
      type: payload.type,
      orderNumber,
      config: JSON.stringify(payload.config),
    })

    return mapPage(page)
  },

  async updatePage(pageId: number, payload: UpsertPageInput): Promise<ChapterPageResponse> {
    const existing = await repository.getPageById(pageId)
    if (!existing) {
      throw new HttpError(404, 'Page not found')
    }

    const updated = await repository.updatePage(pageId, {
      type: payload.type,
      orderNumber: payload.orderNumber ?? existing.orderNumber,
      config: JSON.stringify(payload.config),
    })

    if (existing.type === 'media') {
      const oldUrl = extractLocalMediaUrl(JSON.parse(existing.config))
      const newUrl = payload.type === 'media' ? extractLocalMediaUrl(payload.config) : undefined
      if (oldUrl && oldUrl !== newUrl) {
        await deleteUploadedFile(oldUrl)
      }
    }

    return mapPage(updated)
  },

  async deletePage(pageId: number): Promise<void> {
    const existing = await repository.getPageById(pageId)
    if (!existing) {
      throw new HttpError(404, 'Page not found')
    }

    await repository.deletePage(pageId)

    if (existing.type === 'media') {
      await deleteUploadedFile(extractLocalMediaUrl(JSON.parse(existing.config)))
    }
  },

  async reorderPages(chapterId: number, orderedIds: number[]): Promise<void> {
    const chapter = await repository.getChapterById(chapterId)
    if (!chapter) {
      throw new HttpError(404, 'Chapter not found')
    }

    await repository.reorderPages(orderedIds)
  },
}
