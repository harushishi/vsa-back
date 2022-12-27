import express from 'express';
import { getUsers, getUser, follow } from '../controllers/user.controller';
import { validateFollow } from '../validators/follow.dto';

const userRouter = express.Router()

userRouter.get("/all", getUsers)
userRouter.get("/:id", getUser)
userRouter.post("/follow/:userId/:followId", validateFollow, follow)

export { userRouter }