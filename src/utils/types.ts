import { Post } from "@prisma/client";

type TPaginatedPosts = {
  page: number;
  limit: number;
  posts: Post[];
};

type TUploadedFile = {
  path: string;
};

type TRegisterUser = {
  email: string;
  password: string;
};

type TUserLogged = {
  email: string;
  id: number;
  password?: string;
  token?: string;
};

type TUserProfile = {
  username: string;
  name: string;
  pfp: string;
  biography: string;
  siteUrl: string;
  location: string;
};

type TPost = {
  text?: string;
  tags?: string;
  imageUrl?: string;
  videoUrl?: string;
};

type TComment = {
  text?: string;
  imageUrl?: string;
};

type TTokenDecoded = {
  userId: number;
  iat: number;
  exp: number;
};

export {
  TRegisterUser,
  TUserLogged,
  TUserProfile,
  TPost,
  TComment,
  TTokenDecoded,
  TUploadedFile,
  TPaginatedPosts,
};
