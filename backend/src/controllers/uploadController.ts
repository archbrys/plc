import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { createApiResponse } from '../utils/apiResponse.js'
import { HttpError } from '../utils/httpError.js'

export const uploadController = {
  uploadImage: (req: Request, res: Response) => {
    if (!req.file) {
      throw new HttpError(400, 'No image file provided.')
    }

    res
      .status(StatusCodes.CREATED)
      .json(createApiResponse(true, 'Image uploaded.', { url: `/uploads/${req.file.filename}` }))
  },
}
