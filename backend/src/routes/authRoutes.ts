import { Router } from 'express'

import { authController } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { validateBody } from '../middleware/validate.js'
import { loginSchema } from '../validation/authSchemas.js'

export const authRoutes = Router()

authRoutes.post('/login', validateBody(loginSchema), authController.login)
authRoutes.post('/logout', authMiddleware, authController.logout)
authRoutes.get('/me', authMiddleware, authController.me)
