import prisma from "../../client";
import { IComment, IPost, ITokenDecoded } from "../utils/types";
import { msgs } from "../utils/messages";
import jwt_decode from "jwt-decode";

export class PostService {
  constructor() {}

  async getPosts() {
    try {
      const result = await prisma.post.findMany({});
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPostById(postId: number) {
    try {
      const result = await prisma.post.findUniqueOrThrow({
        where: {
          id: postId,
        },
        include: {
          commentaries: {
            select: {
              id: true,
              text: true,
              imageUrl: true,
              postId: true,
              authorId: true,
              likedBy: { select: { id: true } },
            },
          },
          likedBy: { select: { id: true } },
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPostsFromFollows(token: string) {
    const { userId }: ITokenDecoded = jwt_decode(token);

    try {
      const result = await prisma.follow.findMany({
        where: {
          followingId: userId,
        },
        select: {
          followed: {
            select: {
              posts: {
                where: {
                  visibility: Number(0),
                },
                take: 10,
                orderBy: { createdAt: "desc" },
                include: {
                  commentaries: {
                    include: { likedBy: { select: { id: true } } },
                  },
                  likedBy: { select: { id: true } },
                },
              },
            },
          },
        },
      });

      let allPosts: any[] = [];

      result.forEach((item) => {
        item.followed.posts.forEach((post) => {
          allPosts.push(post);
        });
      });

      allPosts = allPosts.sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });

      return allPosts;
    } catch (error) {
      throw error;
    }
  }

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
