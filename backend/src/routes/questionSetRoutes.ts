import { Router } from 'express'

import { questionSetController } from '../controllers/questionSetController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'
import { validateBody, validateParams } from '../middleware/validate.js'
import {
  questionSetIdParamSchema,
  updateStatusSchema,
  upsertQuestionSetSchema,
} from '../validation/questionSetSchemas.js'

export const questionSetRoutes = Router()

questionSetRoutes.get('/public', authMiddleware, roleMiddleware('student'), questionSetController.listPublished)
questionSetRoutes.get('/', authMiddleware, roleMiddleware('admin'), questionSetController.listAll)
questionSetRoutes.get('/:id', authMiddleware, validateParams(questionSetIdParamSchema), questionSetController.getById)
questionSetRoutes.post('/', authMiddleware, roleMiddleware('admin'), validateBody(upsertQuestionSetSchema), questionSetController.upsert)
questionSetRoutes.put('/:id', authMiddleware, roleMiddleware('admin'), validateParams(questionSetIdParamSchema), validateBody(upsertQuestionSetSchema), questionSetController.upsert)
questionSetRoutes.patch('/:id/status', authMiddleware, roleMiddleware('admin'), validateParams(questionSetIdParamSchema), validateBody(updateStatusSchema), questionSetController.setStatus)
questionSetRoutes.delete('/:id', authMiddleware, roleMiddleware('admin'), validateParams(questionSetIdParamSchema), questionSetController.remove)
