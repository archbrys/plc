import { app } from './app.js'
import { env } from './config/env.js'
import { logger } from './utils/logger.js'

const server = app.listen(env.PORT, '0.0.0.0', () => {
  logger.info(`Server running at http://raspberrypi.local:${env.PORT}`)
})

function shutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down...`)
  server.close(() => process.exit(0))
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
