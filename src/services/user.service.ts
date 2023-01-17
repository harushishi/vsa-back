import prisma from "../../client";
import fs from "fs";
import util from "util";
import { BucketService } from "../../s3";
import { IUserProfile } from "../utils/types";
import { msgs } from "../utils/err_handling";

export class UserService {
  unlinkFile: (path: fs.PathLike) => Promise<void>;
  S3: BucketService;

  constructor() {
    this.unlinkFile = util.promisify(fs.unlink);
    this.S3 = new BucketService();
  }

  async updateProfile(userId: number, payload: IUserProfile) {
    const { username, name, pfp, biography, siteUrl, location } = payload;

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

  async follow(userId: number, followId: number) {
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

  //private methods

  private async checkUsername(username: string, userId: any) {
    try {
      const userProfile = await prisma.profile.findFirst({
        where: {
          NOT: {
            userId: Number(userId),
          },
          username: username,
        },
      });

      return userProfile !== null;
    } catch (error) {
      throw error;
    }
  }
}
