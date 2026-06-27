import path from 'node:path'

import cors from 'cors'
import express from 'express'
import session from 'express-session'

import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { loggingMiddleware } from './middleware/loggingMiddleware.js'
import { apiRouter } from './routes/index.js'
import { createApiResponse } from './utils/apiResponse.js'

const app = express()
const frontendDistPath = path.resolve(process.cwd(), '../frontend/dist')

app.set('trust proxy', 1)
app.use(loggingMiddleware)
app.use(express.json({ limit: '1mb' }))
app.use(
  cors({
    origin: env.NODE_ENV === 'production' ? true : env.FRONTEND_DEV_ORIGIN,
    credentials: true,
  }),
)
app.use(
  session({
    name: 'plc_mc_sid',
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: 12 * 60 * 60 * 1000,
    },
  }),
)

app.get('/api/health', (_req, res) => {
  res.json(createApiResponse(true, 'Server is healthy.', { uptime: process.uptime() }))
})

app.use('/api', apiRouter)

app.use(express.static(frontendDistPath))
app.use((_req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'))
})

app.use(errorHandler)

export { app }
