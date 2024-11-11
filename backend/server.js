// index.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import connectDB from './config/db.js';
import cors from 'cors';
import complaintRoutes from './routes/complaint.js';



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;

// Database connection
connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);  // Add complaints routes here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
