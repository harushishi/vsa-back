import prisma from "../../client";
import { IPost, ITokenDecoded } from "../utils/types";
import { msgs } from "../utils/err_handling";
import { parseToken } from "../utils/utils";
import jwt_decode from "jwt-decode";

export class PostService {
  constructor() {}

  async create(userId: number, payload: IPost) {
    const { text, imageUrl, videoUrl, tags } = payload;

    if (!text && !imageUrl && !videoUrl) {
      throw new Error(msgs.empty_post);
    }

    try {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      await prisma.post.create({
        data: {
          text: text,
          imageUrl: imageUrl,
          videoUrl: videoUrl,
          tags: tags,
          authorId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(userId: number, postId: number, token: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error(msgs.user_not_found);
      }

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new Error(msgs.post_not_found);
      }

      //verify that token's userId matches post's authorId
      const tokenObj: ITokenDecoded = jwt_decode(token);

      if (tokenObj.id !== post.authorId) {
        throw new Error(msgs.forbidden);
      }

      await prisma.post.delete({
        where: {
          id: postId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
