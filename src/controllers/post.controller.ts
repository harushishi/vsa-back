import e, { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { err_codes, msgs } from "../utils/messages";

const PostServiceInstance = new PostService();

const createPost = async (req: Request, res: Response) => {
  const token = req.headers["authorization"] || "";
  const payload = req.body;

  try {
    await PostServiceInstance.createPost(payload, token);
    res.status(200).send();
  } catch (error: any) {
    if (error.code === err_codes.not_found) {
      res.status(404).send(msgs.user_not_found);
    } else if (error.message === msgs.empty_post) {
      res.status(400).send(msgs.empty_post);
    } else {
      res.status(500).send(error);
    }
  }
};

const deletePost = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  const token = req.headers["authorization"] || "";

  try {
    await PostServiceInstance.deletePost(postId, token);
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

const commentPost = async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  const payload = req.body;
  const token = req.headers["authorization"] || "";

  try {
    await PostServiceInstance.commentPost(postId, payload, token);
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
    await PostServiceInstance.deleteComment(commentId, token);
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

export { createPost, deletePost, commentPost, deleteComment };
