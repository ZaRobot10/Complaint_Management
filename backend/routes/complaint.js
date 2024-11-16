import express from 'express';
import multer from 'multer';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
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

//STUDENT
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

//ADMIN
// Route to fetch all complaints
router.get('/allcomplaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching all complaints:', error);
    res.status(500).json({ message: 'Error fetching complaints.' });
  }
});

// Route to fetch all faculty users
router.get('/faculty', async (req, res) => {
  try {
    const facultyUsers = await User.find({ role: 'faculty' }, 'name'); // Fetch only the 'name' field
    res.status(200).json(facultyUsers);
  } catch (error) {
    console.error('Error fetching faculty users:', error);
    res.status(500).json({ message: 'Error fetching faculty users.' });
  }
});

// Route to assign a complaint
router.put('/assign/:id', async (req, res) => {
  const { id } = req.params;
  const { assignedTo } = req.body;

  try {
    const complaint = await Complaint.findByIdAndUpdate(id, { assignedTo }, { new: true });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    res.status(200).json({ message: 'Complaint assigned successfully.', complaint });
  } catch (error) {
    console.error('Error assigning complaint:', error);
    res.status(500).json({ message: 'Error assigning complaint.' });
  }
});


//FACULTY
// Route to fetch complaints assigned to a specific faculty member
router.get('/assigned/:facultyName', async (req, res) => {
  const { facultyName } = req.params;

  try {
    const complaints = await Complaint.find({ assignedTo: facultyName });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching assigned complaints:', error);
    res.status(500).json({ message: 'Error fetching assigned complaints.' });
  }
});

// Route to respond to a complaint and update its status
router.put('/respond/:id', async (req, res) => {
  const { id } = req.params;
  const { reply, status } = req.body;

  try {
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    if (reply) {
      complaint.reply.push(reply);
    }

    if (status) {
      complaint.status = status;
    }

    await complaint.save();
    res.status(200).json({ message: 'Response updated successfully.', complaint });
  } catch (error) {
    console.error('Error responding to complaint:', error);
    res.status(500).json({ message: 'Error responding to complaint.' });
  }
});

export default router;
