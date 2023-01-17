import e, { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { err_codes, msgs } from "../utils/err_handling";

const PostServiceInstance = new PostService();

const createPost = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const payload = req.body;

  try {
    await PostServiceInstance.create(userId, payload);
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
  const userId = Number(req.params.userId);
  const postId = Number(req.params.postId);
  const token = req.headers["authorization"] || "";

  try {
    await PostServiceInstance.delete(userId, postId, token);
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

export { createPost, deletePost };
