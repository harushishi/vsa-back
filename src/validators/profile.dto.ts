import { Request, Response, NextFunction } from 'express'
import { body, check, param } from 'express-validator'
import { validateResult } from '../helpers/validate.helper'

export const validateProfile = [
    check('username')
        .exists()
        .not()
        .isEmpty(),
    check('name')
        .exists()
        .not()
        .isEmpty(),
    check('pfp')
        .exists()
        .not()
        .isEmpty(),
    check('biography')
        .exists()
        .not()
        .isEmpty(),
    check('siteUrl')
        .exists()
        .not()
        .isEmpty(),
    check('location')
        .exists()
        .not()
        .isEmpty(),
    param('userId')
        .exists()
        .custom(v => {
            let value = Number(v)
            if (Number.isNaN(value)) {
                throw new Error('userId is not a number')
            }
            return true
        }),
    (req: Request, res: Response, next: NextFunction) => {
        validateResult(req, res, next)
    }
]
