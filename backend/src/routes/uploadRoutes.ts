import { Router } from 'express'

import { uploadController } from '../controllers/uploadController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'
import { uploadImage, uploadMedia } from '../middleware/uploadMiddleware.js'

export const uploadRoutes = Router()

uploadRoutes.post(
  '/image',
  authMiddleware,
  roleMiddleware('admin'),
  uploadImage.single('image'),
  uploadController.uploadImage,
)

uploadRoutes.post(
  '/media',
  authMiddleware,
  roleMiddleware('admin'),
  uploadMedia.single('media'),
  uploadController.uploadMedia,
)
