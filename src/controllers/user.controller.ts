import e, { Request, Response } from "express";
import { UserService } from "@services";
import { err_codes, msgs } from "@utils/messages";

const UserServiceInstance = new UserService();

const updatePfp = async (req: Request, res: Response) => {
  const token = req.headers["authorization"] || "";
  const file = req.file;

  try {
    await UserServiceInstance.updatePfp(file, token);
    res.status(200).send();
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

const createProfile = async (req: Request, res: Response) => {
  const token = req.headers["authorization"] || "";
  const payload = req.body;

  try {
    await UserServiceInstance.createProfile(payload, token);
    res.status(200).send();
  } catch (error: any) {
    if (error.message === msgs.has_profile) {
      res.status(401).send(msgs.has_profile);
    } else if (error.message === msgs.username_taken) {
      res.status(401).send(msgs.username_taken);
    } else {
      res.status(500).send(error.message);
    }
  }
};

const updateProfile = async (req: Request, res: Response) => {
  const token = req.headers["authorization"] || "";
  const payload = req.body;

  try {
    await UserServiceInstance.updateProfile(payload, token);
    res.status(200).send();
  } catch (error: any) {
    if (error.message === err_codes.not_found) {
      res.status(404).send(error.message);
    } else if (error.message === msgs.username_taken) {
      res.status(401).send(msgs.username_taken);
    } else {
      res.status(500).send(error.message);
    }
  }
};

const like = async (req: Request, res: Response) => {
  const token = req.headers["authorization"] || "";
  const id = Number(req.params.id);
  const target = req.params.target;

  try {
    if (target === "post") {
      await UserServiceInstance.likePost(id, token);
      res.status(200).send();
    } else if (target === "comment") {
      await UserServiceInstance.likeComment(id, token);
      res.status(200).send();
    }
  } catch (error: any) {
    switch (error.message) {
      case msgs.user_not_found:
        res.status(404).send(msgs.user_not_found);
        break;
      case msgs.post_not_found:
        res.status(404).send(msgs.post_not_found);
        break;
      case msgs.comment_not_found:
        res.status(404).send(msgs.comment_not_found);
        break;
      default:
        res.status(500).send(error.message);
    }
  }
};

const follow = async (req: Request, res: Response) => {
  const token = req.headers["authorization"] || "";
  const followId = Number(req.params.followId);

  try {
    if (await UserServiceInstance.follow(followId, token)) {
      res.status(200).send(msgs.followed);
    } else {
      res.status(200).send(msgs.unfollowed);
    }
  } catch (error: any) {
    if (error.code === err_codes.not_found) {
      res.status(404).send(msgs.user_not_found);
    } else {
      res.status(500).send(error);
    }
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserServiceInstance.getUsers();
    res.status(200).send(users);
  } catch (error: any) {
    if (error.message === "No users found") {
      res.status(404).send(error.message);
    } else {
      res.status(500).send(msgs.internal);
    }
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    const user = await UserServiceInstance.getUser(userId);
    res.status(200).send(user);
  } catch (error: any) {
    if (error.code === err_codes.not_found) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send(msgs.internal);
    }
  }
};

export {
  getUsers,
  getUser,
  follow,
  createProfile,
  like,
  updatePfp,
  updateProfile,
};
