import express from 'express';
import { getUsers, getUser, follow, updateProfile } from '../controllers/user.controller';
import { validateFollow } from '../validators/follow.dto';
import { validateProfile } from '../validators/profile.dto';

const userRouter = express.Router()

userRouter.get("/all", getUsers)
userRouter.get("/:id", getUser)
userRouter.post("/follow/:userId/:followId", validateFollow, follow)
userRouter.post("/profile/update/:userId", validateProfile, updateProfile)

export { userRouter }