import { Request, Response, NextFunction } from 'express'
import { check } from 'express-validator'
import { validateResult } from '../helpers/validate.helper'

export const validateRegister = [
    check('email')
        .exists()
        .not()
        .isEmpty()
        .isEmail(),
    check('password')
        .exists()
        .not()
        .isEmpty(),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next)
    }
]
