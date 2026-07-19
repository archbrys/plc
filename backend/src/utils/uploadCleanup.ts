import fs from 'node:fs/promises'
import path from 'node:path'

import { UPLOADS_DIR } from '../middleware/uploadMiddleware.js'
import { logger } from './logger.js'

export async function deleteUploadedFile(url: string | undefined): Promise<void> {
  if (!url || !url.startsWith('/uploads/')) return

  const filename = url.slice('/uploads/'.length)
  if (!filename || filename.includes('/') || filename.includes('..')) return

  const filePath = path.join(UPLOADS_DIR, filename)
  try {
    await fs.unlink(filePath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      logger.warn('Failed to delete orphaned upload', error)
    }
  }
}

export function extractLocalMediaUrl(config: unknown): string | undefined {
  if (!config || typeof config !== 'object') return undefined
  const url = (config as { url?: unknown }).url
  return typeof url === 'string' ? url : undefined
}
