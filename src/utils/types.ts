type IRegisterUser = {
  email: string;
  password: string;
};

type IUserLogged = {
  email: string;
  id: number;
  password?: string;
  token?: string;
};

type IUserProfile = {
  username: string;
  name: string;
  pfp: string;
  biography: string;
  siteUrl: string;
  location: string;
};

type IPost = {
  text?: string;
  tags?: string;
  imageUrl?: string;
  videoUrl?: string;
};

type IComment = {
  text?: string;
  imageUrl?: string;
};

type ITokenDecoded = {
  id: number;
  iat: number;
  exp: number;
};

export {
  IRegisterUser,
  IUserLogged,
  IUserProfile,
  IPost,
  IComment,
  ITokenDecoded,
};
