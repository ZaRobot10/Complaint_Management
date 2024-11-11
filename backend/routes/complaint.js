import express from 'express';
import Complaint from '../models/Complaint.js';
import { fetchComplaints } from '../controllers/ComplaintController.js';

const router = express.Router();

// Submit Complaint Route
router.post('/submit', async (req, res) => {
  const { name, rollNumber, category, description } = req.body;

  try {
    const newComplaint = new Complaint({
      name,
      rollNumber,
      category,
      description,
      status: 'Pending',  // Default status
      assignedTo: 'Not Assigned',  // Default assigned to
      timeSubmitted: Date.now(),  // Current time
      reply: []  // Empty array for replies
    });

    await newComplaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully', complaint: newComplaint });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting complaint', error });
  }
});

// Route to fetch complaints by roll number
router.get('/fetch/:rollNumber', fetchComplaints);

export default router;
