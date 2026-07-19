import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import multer from 'multer'

export const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads')

fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif'])

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, UPLOADS_DIR)
  },
  filename: (_req, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase()
    callback(null, `${crypto.randomUUID()}${ext}`)
  },
})

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
const MAX_MEDIA_SIZE_BYTES = 300 * 1024 * 1024

export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      callback(new Error('Only PNG, JPEG, WEBP, or GIF images are allowed.'))
      return
    }
    callback(null, true)
  },
})

const ALLOWED_MEDIA_MIME_TYPES = new Set(['video/mp4', 'video/webm', 'application/pdf'])

export const uploadMedia = multer({
  storage,
  limits: { fileSize: MAX_MEDIA_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MEDIA_MIME_TYPES.has(file.mimetype)) {
      callback(new Error('Only MP4, WEBM, or PDF files are allowed.'))
      return
    }
    callback(null, true)
  },
})
