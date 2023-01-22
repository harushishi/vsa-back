import express from "express";
import { PostController } from "@controllers";
import { verifyToken } from "../middlewares/authorization";

const postRouter = express.Router();

//controlar como quedaron las nuevas rutas.
postRouter.get("/", PostController.getPosts);
postRouter.get("/:postId", PostController.getPostById);
postRouter.get("/following", verifyToken, PostController.getPostsFromFollows);
postRouter.post("/", verifyToken, PostController.createPost);
postRouter.delete("/:postId", verifyToken, PostController.deletePost);
//podria separar los comentarios en un service/controller aparte.
postRouter.post("/comment/:postId", verifyToken, PostController.commentPost);
postRouter.delete(
  "/comment/delete/:commentId",
  verifyToken,
  PostController.deleteComment
);

export { postRouter };
