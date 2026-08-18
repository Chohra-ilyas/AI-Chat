import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";

import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRoute from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import { handleStripeWebhook } from "./controllers/webhooks.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

// Initialize Express app
const app = express();

// Database connection
await connectDB(process.env.MONGODB_URI);

// Stripe webhook (must be before express.json())
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRoute);
app.use("/api/credits", creditRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
