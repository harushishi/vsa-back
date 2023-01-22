import prisma from "../../client";
import { TComment, TPost, TTokenDecoded } from "../utils/types";
import { msgs } from "../utils/messages";
import jwt_decode from "jwt-decode";

export class PostService {
  constructor() {}

  async getPostById(postId: number) {
    try {
      const posts = await prisma.post.findUniqueOrThrow({
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
      return posts;
    } catch (error) {
      throw error;
    }
  }

  async getPosts(
    page: number | undefined = 1,
    limit: number | undefined = 5,
    url: string
  ) {
    try {
      const startIndex = (page - 1) * limit;
      const paginatedPosts = await this.paginatePosts(page, limit, url);

      console.log(page, limit);

      const posts = await prisma.post.findMany({
        skip: startIndex,
        take: limit,
      });

      paginatedPosts.posts = posts;
      return paginatedPosts;
    } catch (error) {
      throw error;
    }
  }

  async getPostsFromFollows(
    page: number | undefined = 1,
    limit: number | undefined = 5,
    url: string,
    token: string
  ) {
    const { userId }: TTokenDecoded = jwt_decode(token);

    try {
      const startIndex = (page - 1) * limit;
      const paginatedPosts = await this.paginatePosts(page, limit, url);

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

  async createPost(payload: TPost, token: string) {
    const { userId }: TTokenDecoded = jwt_decode(token);
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
    const { userId }: TTokenDecoded = jwt_decode(token);
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

  async commentPost(postId: number, payload: TComment, token: string) {
    const { userId }: TTokenDecoded = jwt_decode(token);
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
    const { userId }: TTokenDecoded = jwt_decode(token);
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

  // private methods

  async paginatePosts(page: number, limit: number, url: string) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results: any = {};

    if (endIndex < (await prisma.post.count())) {
      results.info = {
        next: `${process.env.BASE_URL}/post${
          !url.indexOf("page=")
            ? `?page=${page}&limit=${limit}`
            : `?page=${page + 1}&limit=${limit}`
        }`,
        limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        prev: `${process.env.BASE_URL}/post?page=${page}&limit=${limit}`,
        limit,
      };
    }

    return results;
  }
}
