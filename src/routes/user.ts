import express from "express";
import {
  getUsers,
  getUser,
  follow,
  updateProfile,
} from "../controllers/user.controller";
import { validateFollow } from "../validators/follow.dto";
import { validateProfile } from "../validators/profile.dto";
import { verifyToken } from "../middlewares/authorization";

const userRouter = express.Router();

userRouter.get("/all", getUsers);
userRouter.get("/:id", getUser);
userRouter.post("/follow/:followId", verifyToken, validateFollow, follow);
userRouter.post(
  "/profile/update/",
  verifyToken,
  validateProfile,
  updateProfile
);

export { userRouter };
