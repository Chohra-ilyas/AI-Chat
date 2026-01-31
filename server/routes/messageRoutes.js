import express from "express";
import { textMessageController } from "../controllers/messageController.js";
import { authenticateUser } from "../middlewares/auth.js";

const messageRoute = express.Router();

messageRoute.use(authenticateUser);
messageRoute.post("/text", textMessageController);

export default messageRoute;