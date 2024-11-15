import express from 'express';
import multer from 'multer';
import Complaint from '../models/Complaint.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Define the path to save images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Submit Complaint Route with image upload
router.post('/submit',upload.single('image'), async (req, res) => {
  const { name, rollNumber, category, description } = req.body;
  const image = req.file ? req.file.filename : null;  // save filename only

  try {
    const newComplaint = new Complaint({
      name,
      rollNumber,
      category,
      description,
      status: 'Pending',  // Default status
      assignedTo: 'Not Assigned',  // Default assigned to
      timeSubmitted: Date.now(),  // Current time
      reply: [],// Empty array for replies
      image  // Store image path in the database
    });

    await newComplaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully', complaint: newComplaint });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting complaint', error });
  }
});

// Route to serve uploaded images
router.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(process.cwd(), 'uploads', req.params.filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.sendFile(filePath);
  });
});

// Route to fetch complaints by roll number
router.get('/fetch/:rollNumber', async (req, res) => {
  const { rollNumber } = req.params;

  try {
    // Find complaints by roll number
    const complaints = await Complaint.find({ rollNumber });

    if (complaints.length === 0) {
      return res.status(404).json({ message: 'No complaints found for this roll number.' });
    }

    // Send the complaints as response
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Error fetching complaints.' });
  }
});

export default router;
