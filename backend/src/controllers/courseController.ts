import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { courseService } from '../services/courseService.js'
import { createApiResponse } from '../utils/apiResponse.js'
import { HttpError } from '../utils/httpError.js'

function parseId(raw: unknown, label: string): number {
  const id = Number.parseInt(String(raw), 10)
  if (Number.isNaN(id)) {
    throw new HttpError(400, `Invalid ${label}`)
  }
  return id
}

export const courseController = {
  getCourse: async (_req: Request, res: Response) => {
    const data = await courseService.getCourse()
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Course retrieved successfully.', data))
  },

  getChapter: async (req: Request, res: Response) => {
    const chapterId = parseId(req.params.chapterId, 'chapter ID')
    const chapter = await courseService.getChapterById(chapterId)

    if (!chapter) {
      throw new HttpError(404, 'Chapter not found')
    }

    res.status(StatusCodes.OK).json(createApiResponse(true, 'Chapter retrieved successfully.', chapter))
  },

  createChapter: async (req: Request, res: Response) => {
    const data = await courseService.createChapter(req.body)
    res.status(StatusCodes.CREATED).json(createApiResponse(true, 'Chapter created.', data))
  },

  updateChapter: async (req: Request, res: Response) => {
    const chapterId = parseId(req.params.chapterId, 'chapter ID')
    const data = await courseService.updateChapter(chapterId, req.body)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Chapter updated.', data))
  },

  deleteChapter: async (req: Request, res: Response) => {
    const chapterId = parseId(req.params.chapterId, 'chapter ID')
    await courseService.deleteChapter(chapterId)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Chapter deleted.', null))
  },

  reorderChapters: async (req: Request, res: Response) => {
    await courseService.reorderChapters(req.body.orderedIds)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Chapters reordered.', null))
  },

  createPage: async (req: Request, res: Response) => {
    const chapterId = parseId(req.params.chapterId, 'chapter ID')
    const data = await courseService.createPage(chapterId, req.body)
    res.status(StatusCodes.CREATED).json(createApiResponse(true, 'Page created.', data))
  },

  updatePage: async (req: Request, res: Response) => {
    const pageId = parseId(req.params.pageId, 'page ID')
    const data = await courseService.updatePage(pageId, req.body)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Page updated.', data))
  },

  deletePage: async (req: Request, res: Response) => {
    const pageId = parseId(req.params.pageId, 'page ID')
    await courseService.deletePage(pageId)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Page deleted.', null))
  },

  reorderPages: async (req: Request, res: Response) => {
    const chapterId = parseId(req.params.chapterId, 'chapter ID')
    await courseService.reorderPages(chapterId, req.body.orderedIds)
    res.status(StatusCodes.OK).json(createApiResponse(true, 'Pages reordered.', null))
  },
}
