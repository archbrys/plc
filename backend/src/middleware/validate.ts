import type { NextFunction, Request, Response } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import type { ZodType } from 'zod'

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.body = schema.parse(req.body)
    next()
  }
}

export function validateParams<T extends ParamsDictionary>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    ;(req as Request & { params: T }).params = schema.parse(req.params)
    next()
  }
}
