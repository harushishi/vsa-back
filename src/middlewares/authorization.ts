import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { msgs } from "../utils/messages";

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const secret = process.env.JWT_SECRET || "";

  if (!authHeader) {
    return res.status(401).send({ message: "missing token" });
  }

  const token = parseToken(authHeader);

  if (!token) {
    return res.status(401).send({ message: "invalid token" });
  }

  jwt.verify(token, secret, (err, authData) => {
    if (err) {
      return res.status(403).send(msgs.forbidden);
    }

    return next();
  });
}

function parseToken(token: string) {
  if (!token.startsWith("Bearer ")) {
    return;
  }

  const [_, parsedToken] = token.split(" ");

  return parsedToken;
}

export { verifyToken };
