import prisma from "../../client";
import { IComment, IPost, ITokenDecoded } from "../utils/types";
import { msgs } from "../utils/messages";
import jwt_decode from "jwt-decode";

export class PostService {
  constructor() {}

  async createPost(payload: IPost, token: string) {
    const { userId }: ITokenDecoded = jwt_decode(token);
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

  async deletePost(postId: number, token: string) {
    const { userId }: ITokenDecoded = jwt_decode(token);
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

      // verify that token's userId matches post's authorId
      if (userId !== post.authorId) {
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

  async commentPost(postId: number, payload: IComment, token: string) {
    const { userId }: ITokenDecoded = jwt_decode(token);
    const { text, imageUrl } = payload;
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

      await prisma.comment.create({
        data: {
          text: text,
          imageUrl: imageUrl,
          authorId: userId,
          postId: postId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(commentId: number, token: string) {
    const { userId }: ITokenDecoded = jwt_decode(token);
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error(msgs.user_not_found);
      }

      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });

      if (!comment) {
        throw new Error(msgs.comment_not_found);
      }

      // verify that token's userId matches comments's authorId
      if (userId !== comment.authorId) {
        throw new Error(msgs.forbidden);
      }

      await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
