import { Request, Response, NextFunction } from "express";
import { body, check, param } from "express-validator";
import { validateResult } from "../helpers/validate.helper";

export const validateProfile = [
  check("username").exists().not().isEmpty(),
  check("name").exists().not().isEmpty(),
  check("pfp").exists().not().isEmpty(),
  check("biography").exists().not().isEmpty(),
  check("siteUrl").exists().not().isEmpty(),
  check("location").exists().not().isEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];
