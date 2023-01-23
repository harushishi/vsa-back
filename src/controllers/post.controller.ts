import { Request, Response } from "express";
import { PostService } from "@services";
import { err_codes, msgs } from "@utils/messages";

const PostServiceInstance = new PostService();

const getPosts = async (req: Request, res: Response) => {
  try {
    const page =
      typeof req.query.page === "string" ? +req.query.page : undefined;
    const limit =
      typeof req.query.limit === "string" ? +req.query.limit : undefined;
    const url = req.url;
    const posts = await PostServiceInstance.getPosts(page, limit, url);
    res.status(200).send(posts);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

const getPostById = async (req: Request, res: Response) => {
  const postId = Number(req.params.id);

  try {
    const post = await PostServiceInstance.getPostById(postId);
    res.status(200).send(post);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

const getPostsByFilter = async (req: Request, res: Response) => {
  const token = req.headers["authorization"] || "";
  const filter = req.params.filter;
  const page = typeof req.query.page === "string" ? +req.query.page : undefined;
  const limit =
    typeof req.query.limit === "string" ? +req.query.limit : undefined;
  const url = req.url;
  try {
    if (filter === "following") {
      const posts = await PostServiceInstance.getPostsFromFollows(
        page,
        limit,
        url,
        token
      );
      res.status(200).send(posts);
    } else {
      res.status(404).send(msgs.unknown_filter);
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

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
  const postId = Number(req.params.id);
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

export { createPost, deletePost, getPostById, getPostsByFilter, getPosts };
