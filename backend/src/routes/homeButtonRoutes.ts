import { Router } from 'express'

import { homeButtonController } from '../controllers/homeButtonController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'
import { validateBody, validateParams } from '../middleware/validate.js'
import { reorderSchema } from '../validation/courseSchemas.js'
import { homeButtonIdParamSchema, upsertHomeButtonSchema } from '../validation/homeButtonSchemas.js'

export const homeButtonRoutes = Router()

homeButtonRoutes.get('/', authMiddleware, homeButtonController.list)

homeButtonRoutes.post(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  validateBody(upsertHomeButtonSchema),
  homeButtonController.create,
)

homeButtonRoutes.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  validateParams(homeButtonIdParamSchema),
  validateBody(upsertHomeButtonSchema),
  homeButtonController.update,
)

homeButtonRoutes.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  validateParams(homeButtonIdParamSchema),
  homeButtonController.remove,
)

homeButtonRoutes.patch(
  '/reorder',
  authMiddleware,
  roleMiddleware('admin'),
  validateBody(reorderSchema),
  homeButtonController.reorder,
)
