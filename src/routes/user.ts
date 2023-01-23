import express from "express";
import { UserController } from "@controllers";
import { validateFollow } from "../validators/follow.dto";
import { validateProfile } from "../validators/profile.dto";
import { verifyToken } from "../middlewares/authorization";
import { validateLike } from "../validators/like.dto";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const userRouter = express.Router();

userRouter.get("/", UserController.getUsers);
userRouter.get("/:id", UserController.getUser);
userRouter.patch(
  "/follow/:followId",
  verifyToken,
  validateFollow,
  UserController.follow
);
userRouter.post(
  "/profile",
  verifyToken,
  validateProfile,
  UserController.createProfile
);
userRouter.patch(
  "/profile",
  verifyToken,
  validateProfile,
  UserController.updateProfile
);
userRouter.patch(
  "/like/:target/:id",
  verifyToken,
  validateLike,
  UserController.like
);
userRouter.patch(
  "/pfp",
  verifyToken,
  upload.single("image"),
  UserController.updatePfp
);

export { userRouter };
