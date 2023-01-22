import express from "express";
import { AuthController } from "@controllers";
import { validateRegister } from "../validators/register.dto";

const authRouter = express.Router();
const { register, login } = AuthController;

authRouter.post("/login", validateRegister, login);
authRouter.post("/register", validateRegister, register);

export { authRouter };
