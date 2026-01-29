import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import 'dotenv/config';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection (example using mongoose)
await connectDB(process.env.MONGODB_URI);

// Routes
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});