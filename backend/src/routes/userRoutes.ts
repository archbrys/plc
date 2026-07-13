import { Router } from 'express'

import { userController } from '../controllers/userController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'
import { validateBody, validateParams } from '../middleware/validate.js'
import { createUserSchema, updateUserSchema, userIdParamSchema } from '../validation/userSchemas.js'

export const userRoutes = Router()

userRoutes.get('/', authMiddleware, roleMiddleware('admin'), userController.list)
userRoutes.post('/', authMiddleware, roleMiddleware('admin'), validateBody(createUserSchema), userController.create)
userRoutes.put(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  validateParams(userIdParamSchema),
  validateBody(updateUserSchema),
  userController.update,
)
userRoutes.delete('/:id', authMiddleware, roleMiddleware('admin'), validateParams(userIdParamSchema), userController.remove)
