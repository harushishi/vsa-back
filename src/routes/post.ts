import express from "express";
import { PostController } from "@controllers";
import { verifyToken } from "../middlewares/authorization";

const postRouter = express.Router();

postRouter.get("/", PostController.getPosts);
postRouter.get("/:id", PostController.getPostById);
//podria usarlo tambien para agregar por trending, user, etc
postRouter.get("/by/:filter", verifyToken, PostController.getPostsByFilter);
postRouter.post("/", verifyToken, PostController.createPost);
postRouter.delete("/:id", verifyToken, PostController.deletePost);

export { postRouter };
