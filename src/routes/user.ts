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
//no deberia ser post, puedo cambiar el :followId por userId
userRouter.post(
  "/follow/:followId",
  verifyToken,
  validateFollow,
  UserController.follow
);
// modificar el endpoint para que solo cree el perfil.
// hacer otro con update aparte
userRouter.post(
  "/profile",
  verifyToken,
  validateProfile,
  UserController.updateProfile
);
// pasar este endpoint y el de like comment al controller de post.
// ya que, que el usuario tenga un nuevo like guardado es un side-effect del like al post.
userRouter.post(
  "/like/:id",
  verifyToken,
  validateLike,
  UserController.likePost
);
userRouter.post(
  "/like/comment/:id",
  verifyToken,
  validateLike,
  UserController.likeComment
);
// esto tampoco deberia ser post por que el usuario ya arranca con una foto.
userRouter.post(
  "/upload/pfp",
  verifyToken,
  upload.single("image"),
  UserController.updatePfp
);

export { userRouter };
