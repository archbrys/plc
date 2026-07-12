import type { Request, Response, NextFunction } from 'express'

import { courseService } from '../services/courseService.js'
import { successResponse } from '../utils/apiResponse.js'
import { HttpError } from '../utils/httpError.js'

export const courseController = {
  async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await courseService.getCourse()
      res.json(successResponse(course, 'Course retrieved successfully'))
    } catch (error) {
      next(error)
    }
  },

  async getChapter(req: Request, res: Response, next: NextFunction) {
    try {
      const chapterId = parseInt(req.params.chapterId, 10)

      if (isNaN(chapterId)) {
        throw new HttpError(400, 'Invalid chapter ID')
      }

      const chapter = await courseService.getChapterById(chapterId)

      if (!chapter) {
        throw new HttpError(404, 'Chapter not found')
      }

      res.json(successResponse(chapter, 'Chapter retrieved successfully'))
    } catch (error) {
      next(error)
    }
  },
}
