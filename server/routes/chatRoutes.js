import express from "express";
import {
  getUserChats,
  createChat,
  deleteChat,
} from "../controllers/chatController.js";
import { authenticateUser } from "../middlewares/auth.js";

const chatRouter = express.Router();

// Apply authentication middleware to all chat routes
chatRouter.use(authenticateUser);
chatRouter.get("/", getUserChats);
chatRouter.post("/", createChat);
chatRouter.post("/delete", deleteChat);

export default chatRouter;
