import express from "express";
import {
  commentPost,
  createPost,
  deletePost,
  deleteComment,
  getPostById,
  getPostsFromFollows,
  getPosts,
} from "../controllers/post.controller";
import { verifyToken } from "../middlewares/authorization";

const postRouter = express.Router();

postRouter.get("/get/all", getPosts);
postRouter.get("/get/id/:postId", getPostById);
postRouter.get("/get/following", verifyToken, getPostsFromFollows);
postRouter.post("/create/", verifyToken, createPost);
postRouter.post("/delete/:postId", verifyToken, deletePost);
postRouter.post("/comment/:postId", verifyToken, commentPost);
postRouter.post("/comment/delete/:commentId", verifyToken, deleteComment);

export { postRouter };
