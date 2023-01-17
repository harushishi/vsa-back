import express from "express";
import { createPost, deletePost } from "../controllers/post.controller";

const postRouter = express.Router();

postRouter.post("/create/:userId", createPost);
postRouter.post("/delete/:userId/:postId", deletePost);

export { postRouter };
