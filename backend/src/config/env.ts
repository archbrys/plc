import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config } from 'dotenv'
import { z } from 'zod'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '../../../.env') })

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  SESSION_SECRET: z.string().min(12),
  FRONTEND_DEV_ORIGIN: z.string().url().default('http://localhost:5173'),
})

export const env = envSchema.parse(process.env)
