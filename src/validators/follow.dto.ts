import { Request, Response, NextFunction } from 'express'
import { check, param } from 'express-validator'
import { validateResult } from '../helpers/validate.helper'

export const validateFollow = [
    param('userId')
        .exists()
        .custom(v => {
            let value = Number(v)
            if (Number.isNaN(value)) {
                throw new Error('userId is not a number')
            }
            return true
        }),
    param('followId')
        .exists()
        .custom(v => {
            let value = Number(v)
            if (Number.isNaN(value)) {
                throw new Error('followId is not a number')
            }
            return true
        }),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next)
    }
]