// controllers/complaintController.js
import Complaint from '../models/Complaint.js';

// Controller to fetch complaints by roll number
export const fetchComplaints = async (req, res) => {
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
};
