import { Router } from 'express'

import { authRoutes } from './authRoutes.js'
import { courseRoutes } from './courseRoutes.js'
import { questionSetRoutes } from './questionSetRoutes.js'
import { resultRoutes } from './resultRoutes.js'

export const apiRouter = Router()

apiRouter.use('/auth', authRoutes)
apiRouter.use('/course', courseRoutes)
apiRouter.use('/question-sets', questionSetRoutes)
apiRouter.use('/results', resultRoutes)
