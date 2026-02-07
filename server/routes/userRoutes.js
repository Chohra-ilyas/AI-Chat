import express from "express";
import {
  getPublishedImages,
  getUserData,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { authenticateUser } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/published-images", getPublishedImages);
userRouter.get("/me", authenticateUser, getUserData);

export default userRouter;
