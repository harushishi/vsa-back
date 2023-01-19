import prisma from "../../client";
import fs from "fs";
import util from "util";
import { BucketService } from "../../s3";
import { ITokenDecoded, IUserProfile } from "../utils/types";
import { msgs } from "../utils/messages";
import jwt_decode from "jwt-decode";

export class UserService {
  unlinkFile: (path: fs.PathLike) => Promise<void>;
  S3: BucketService;

  constructor() {
    this.unlinkFile = util.promisify(fs.unlink);
    this.S3 = new BucketService();
  }

  async likeComment(commentId: number, token: string) {
    const { userId }: ITokenDecoded = jwt_decode(token);

    if (!(await this.userExists(userId))) {
      throw new Error(msgs.user_not_found);
    }

    if (!(await this.commentExists(commentId))) {
      throw new Error(msgs.comment_not_found);
    }

    const isLiked = await prisma.user.findUniqueOrThrow({
      where: {
        id: Number(userId),
      },
      select: {
        likedComments: {
          where: {
            id: Number(commentId),
          },
        },
      },
    });

    if (isLiked.likedComments.length > 0) {
      await this.dislike(userId, commentId, "comment");
    } else {
      await this.like(userId, commentId, "comment");
    }
  }

  async likePost(postId: number, token: string) {
    const { userId }: ITokenDecoded = jwt_decode(token);

    if (!(await this.userExists(userId))) {
      throw new Error(msgs.user_not_found);
    }

    if (!(await this.postExists(postId))) throw new Error(msgs.post_not_found);

    const isLiked = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        likedPosts: {
          where: {
            id: Number(postId),
          },
        },
      },
    });

    if (isLiked.likedPosts.length > 0) {
      await this.dislike(userId, postId, "post");
    } else {
      await this.like(userId, postId, "post");
    }
  }

  async updateProfile(payload: IUserProfile, token: string) {
    const { username, name, pfp, biography, siteUrl, location } = payload;
    const { userId }: ITokenDecoded = jwt_decode(token);

    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      const profile = await prisma.profile.findUnique({
        where: {
          userId: userId,
        },
      });

      if (await this.checkUsername(username, userId)) {
        throw new Error(msgs.username_taken);
      }

      if (!profile) {
        const newProfile = await prisma.profile.create({
          data: {
            userId: Number(userId),
            name: name,
            username: username,
            pfp: "11c3a07db76d29cdf6238c9eef528ccfrs",
            biography: biography,
            location: location,
            siteUrl: siteUrl,
          },
        });
        return newProfile;
      }

      const updatedProfile = await prisma.profile.update({
        where: {
          id: Number(profile.id),
        },
        data: {
          userId: Number(userId),
          name: name,
          username: username,
          biography: biography,
          location: location,
          siteUrl: siteUrl,
        },
      });

      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  async follow(followId: number, token: string) {
    const { userId }: ITokenDecoded = jwt_decode(token);
    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      const userToFollow = await prisma.user.findUniqueOrThrow({
        where: {
          id: followId,
        },
      });

      //miro que el usuario no lo este siguiendo ya
      const isFollowing = await prisma.follow.findFirst({
        where: {
          followingId: userId,
          followedId: followId,
        },
      });
      //si no encuentra el follow, lo sigue.
      if (!isFollowing) {
        await prisma.follow.create({
          data: {
            followingId: userId,
            followedId: followId,
          },
        });
        return true;
      }
      //si ya lo sigue, cancela el follow
      await prisma.follow.delete({
        where: {
          id: isFollowing.id,
        },
      });

      return false;
    } catch (error: any) {
      throw error;
    }
  }

  async getUsers() {
    try {
      const result = await prisma.user.findMany({});

      if (!result.length) {
        throw new Error("No users found");
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getUser(userId: number) {
    try {
      const result = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      return result;
    } catch (error: any) {
      throw error;
    }
  }

  //    private methods     //

  private async checkUsername(username: string, userId: number) {
    try {
      const userProfile = await prisma.profile.findFirst({
        where: {
          NOT: {
            userId: userId,
          },
          username: username,
        },
      });

      return userProfile !== null;
    } catch (error) {
      throw error;
    }
  }

  async userExists(userId: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (user == null) return false;

      return true;
    } catch (error) {
      throw error;
    }
  }

  async postExists(postId: number) {
    try {
      const post = await prisma.post.findFirst({
        where: {
          id: postId,
        },
      });

      if (post == null) return false;

      return true;
    } catch (error) {
      throw error;
    }
  }

  async commentExists(commentId: number) {
    try {
      const comment = await prisma.comment.findFirst({
        where: {
          id: Number(commentId),
        },
      });

      if (comment == null) return false;

      return true;
    } catch (error) {
      throw error;
    }
  }

  async like(userId: number, id: number, flag: string) {
    if (flag === "post") {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          likedPosts: {
            connect: [{ id: id }],
          },
        },
        select: {
          id: true,
        },
      });
    }
    if (flag === "comment") {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          likedComments: {
            connect: [{ id: id }],
          },
        },
        select: {
          id: true,
        },
      });
    }
  }

  async dislike(userId: number, id: number, flag: string) {
    if (flag === "post") {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          likedPosts: {
            disconnect: [{ id: id }],
          },
        },
        select: {
          id: true,
        },
      });
    }
    if (flag === "comment") {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          likedComments: {
            disconnect: [{ id: id }],
          },
        },
        select: {
          id: true,
        },
      });
    }
  }
}
