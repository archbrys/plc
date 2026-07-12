import { Router } from 'express'

import { courseController } from '../controllers/courseController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'
import { validateBody, validateParams } from '../middleware/validate.js'
import {
  chapterIdParamSchema,
  pageIdParamSchema,
  reorderSchema,
  upsertChapterSchema,
  upsertPageSchema,
} from '../validation/courseSchemas.js'

export const courseRoutes = Router()

// GET /api/course - Get the full course with all chapters and pages
courseRoutes.get('/', authMiddleware, courseController.getCourse)

// GET /api/course/chapters/:chapterId - Get a specific chapter
courseRoutes.get('/chapters/:chapterId', authMiddleware, courseController.getChapter)

courseRoutes.post(
  '/chapters',
  authMiddleware,
  roleMiddleware('admin'),
  validateBody(upsertChapterSchema),
  courseController.createChapter,
)

courseRoutes.put(
  '/chapters/:chapterId',
  authMiddleware,
  roleMiddleware('admin'),
  validateParams(chapterIdParamSchema),
  validateBody(upsertChapterSchema),
  courseController.updateChapter,
)

courseRoutes.delete(
  '/chapters/:chapterId',
  authMiddleware,
  roleMiddleware('admin'),
  validateParams(chapterIdParamSchema),
  courseController.deleteChapter,
)

courseRoutes.patch(
  '/chapters/reorder',
  authMiddleware,
  roleMiddleware('admin'),
  validateBody(reorderSchema),
  courseController.reorderChapters,
)

courseRoutes.post(
  '/chapters/:chapterId/pages',
  authMiddleware,
  roleMiddleware('admin'),
  validateParams(chapterIdParamSchema),
  validateBody(upsertPageSchema),
  courseController.createPage,
)

courseRoutes.put(
  '/pages/:pageId',
  authMiddleware,
  roleMiddleware('admin'),
  validateParams(pageIdParamSchema),
  validateBody(upsertPageSchema),
  courseController.updatePage,
)

courseRoutes.delete(
  '/pages/:pageId',
  authMiddleware,
  roleMiddleware('admin'),
  validateParams(pageIdParamSchema),
  courseController.deletePage,
)

courseRoutes.patch(
  '/chapters/:chapterId/pages/reorder',
  authMiddleware,
  roleMiddleware('admin'),
  validateParams(chapterIdParamSchema),
  validateBody(reorderSchema),
  courseController.reorderPages,
)
