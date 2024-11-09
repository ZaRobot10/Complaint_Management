// routes/auth.js

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { rollNumber, password } = req.body;

  try {
    const user = await User.findOne({ rollNumber });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Sign the token and return additional user info (name, rollNumber, role)
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,  // Add name here
        rollNumber: user.rollNumber,  // Add rollNumber here
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond with the token and additional user details
    res.json({
      token,
      user: {
        name: user.name,
        rollNumber: user.rollNumber,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Verify token route
router.post('/verify-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is valid
    const user = User.findById(decoded.id); // You can query the user by ID to ensure the user exists

    // Respond with valid status if token is correctly verified
    res.json({ valid: true });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ valid: false, message: 'Invalid or expired token' });
  }
});



export default router;
