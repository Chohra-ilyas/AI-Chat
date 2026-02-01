import express from "express";
import {
  imageMessageController,
  textMessageController,
} from "../controllers/messageController.js";
import { authenticateUser } from "../middlewares/auth.js";

const messageRoute = express.Router();

messageRoute.use(authenticateUser);
messageRoute.post("/text", textMessageController);
messageRoute.post("/image", imageMessageController);

export default messageRoute;
