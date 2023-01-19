import express from "express";
import {
  getUsers,
  getUser,
  follow,
  updateProfile,
  likePost,
  likeComment,
} from "../controllers/user.controller";
import { validateFollow } from "../validators/follow.dto";
import { validateProfile } from "../validators/profile.dto";
import { verifyToken } from "../middlewares/authorization";
import { validateLike } from "../validators/like.dto";

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
userRouter.post("/like/post/:id", verifyToken, validateLike, likePost);
userRouter.post("/like/comment/:id", verifyToken, validateLike, likeComment);

export { userRouter };
