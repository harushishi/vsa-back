import prisma from "./client";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./src/routes/user";
import { authRouter } from "./src/routes/auth";
import { postRouter } from "./src/routes/post";

dotenv.config();

const app: Express = express();
const PORT = process.env.APP_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("API live");
});

app.listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`);
});
