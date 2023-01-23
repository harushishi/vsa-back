import { Request, Response } from "express";
import { CommentService } from "@services";
import { err_codes, msgs } from "@utils/messages";

const CommentServiceInstance = new CommentService();

const commentPost = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  const payload = req.body;
  const token = req.headers["authorization"] || "";

  try {
    await CommentServiceInstance.commentPost(postId, payload, token);
    res.status(200).send();
  } catch (error: any) {
    switch (error.message) {
      case msgs.user_not_found:
        res.status(404).send(msgs.user_not_found);
        break;
      case msgs.post_not_found:
        res.status(404).send(msgs.post_not_found);
        break;
      default:
        res.status(500).send(error.message);
    }
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const commentId = Number(req.params.commentId);
  const token = req.headers["authorization"] || "";

  try {
    await CommentServiceInstance.deleteComment(commentId, token);
    res.status(200).send();
  } catch (error: any) {
    switch (error.message) {
      case msgs.user_not_found:
        res.status(404).send(msgs.user_not_found);
        break;
      case msgs.post_not_found:
        res.status(404).send(msgs.post_not_found);
        break;
      case msgs.forbidden:
        res.status(403).send(msgs.forbidden);
        break;
      default:
        res.status(500).send(error.message);
    }
  }
};

export { commentPost, deleteComment };
