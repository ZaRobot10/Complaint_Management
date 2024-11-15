// server.js
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import connectDB from './config/db.js';
import cors from 'cors';
import complaintRoutes from './routes/complaint.js';
import fs from 'fs';
import path from 'path';

const uploadsDir = path.join(process.cwd(), 'uploads');

// Check if the uploads directory exists, and create it if it doesn't
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


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
