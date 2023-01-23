import express from "express";
import { CommentController } from "@controllers";
import { verifyToken } from "../middlewares/authorization";

const commentRouter = express.Router();

commentRouter.post("/:postId", verifyToken, CommentController.commentPost);
commentRouter.delete(
  "/:commentId",
  verifyToken,
  CommentController.deleteComment
);

export { commentRouter };
