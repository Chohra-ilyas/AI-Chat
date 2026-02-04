import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRoute from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import { handleStripeWebhook } from "./controllers/webhooks.js";

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
await connectDB(process.env.MONGODB_URI);

// Stripe webhook endpoint
app.post("api/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  await handleStripeWebhook(req, res);
})

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
