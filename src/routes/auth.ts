import express from "express";
import { register, login } from "../controllers/auth.controller";
import { validateRegister } from "../validators/register.dto";

const authRouter = express.Router();

authRouter.post("/login", validateRegister, login);
authRouter.post("/register", validateRegister, register);

export { authRouter };
