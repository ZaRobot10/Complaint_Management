// models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], required: true }
}, {
  collection: 'User_data'  // Specify the collection name here
});

export default mongoose.model('User', userSchema);
