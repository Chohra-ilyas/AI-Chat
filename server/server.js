import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import messageRoute from './routes/messageRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection (example using mongoose)
await connectDB(process.env.MONGODB_URI);

// Routes
app.use('/api/users', userRouter);
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});