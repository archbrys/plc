import { Router } from 'express'

import { courseController } from '../controllers/courseController.js'

export const courseRoutes = Router()

// GET /api/course - Get the full course with all chapters and pages
courseRoutes.get('/', courseController.getCourse)

// GET /api/course/chapters/:chapterId - Get a specific chapter
courseRoutes.get('/chapters/:chapterId', courseController.getChapter)
