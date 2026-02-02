import express from "express";

const creditRouter = express.Router();

import { getAllPlans, purchasePlan } from "../controllers/creditController.js";
import { authenticateUser } from "../middlewares/auth.js";

creditRouter.use(authenticateUser);
creditRouter.get("/plans", getAllPlans);
creditRouter.post("/purchase", purchasePlan);

export default creditRouter;
