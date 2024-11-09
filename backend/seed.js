// seed.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Atlas connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Add dummy users
const seedUsers = async () => {
  await connectDB();

  // Define dummy data
  const users = [
    {
      name: 'Ekankaar Khera',
      rollNumber: '2022UCM2343',
      password: await bcrypt.hash('123', 10),  // Hash the password
      role: 'student',
    },
    {
      name: 'Radacharan',
      rollNumber: '2022UCM2365',
      password: await bcrypt.hash('123', 10),  // Hash the password
      role: 'student',
    },
  ];

  try {
    await User.insertMany(users);
    console.log('Dummy users added to database');
  } catch (error) {
    console.error('Error adding users:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedUsers();