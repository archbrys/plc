import { Router } from 'express'

import { resultController } from '../controllers/resultController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'
import { validateBody } from '../middleware/validate.js'
import { submitResultSchema } from '../validation/resultSchemas.js'

export const resultRoutes = Router()

resultRoutes.post('/submit', authMiddleware, roleMiddleware('student'), validateBody(submitResultSchema), resultController.submit)
resultRoutes.get('/', authMiddleware, roleMiddleware('admin'), resultController.listAll)
resultRoutes.get('/me', authMiddleware, roleMiddleware('student'), resultController.listMine)
