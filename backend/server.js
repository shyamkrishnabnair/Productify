// server.js
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config(); // Load env variables

const app = express();

// // Middleware (optional: body parser etc.)
// app.use(express.json()); // To parse JSON payloads

// Sample route
app.get("/products", (req, res) => {
    res.json({ message: "List of products will go here" });
});

// Print Mongo URI (for debugging only - remove in production!)
// console.log("Mongo URI:", process.env.MONGO_URI);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});
