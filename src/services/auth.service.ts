import prisma from "../../client";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { TRegisterUser, TUserLogged } from "../utils/types";
import { msgs } from "../utils/messages";

export class AuthService {
  constructor() {}

  async login(user: TRegisterUser) {
    try {
      const secret = process.env.JWT_SECRET ?? "";
      let foundUser: TUserLogged = await prisma.user.findUniqueOrThrow({
        where: {
          email: user.email,
        },
      });

      if (await argon2.verify(foundUser.password!, user.password)) {
        delete foundUser.password;
        foundUser.token = jwt.sign({ userId: foundUser.id }, secret, {
          expiresIn: "30000s",
        });
      } else {
        throw new Error(msgs.inv_credentials);
      }

      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  async register(user: TRegisterUser) {
    try {
      const hash = await argon2.hash(user.password);

      await prisma.user.create({
        data: {
          email: user.email,
          password: hash,
        },
      });

      return;
    } catch (error) {
      throw error;
    }
  }
}
