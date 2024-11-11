import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Submitted' },
  assignedTo: { type: String, default: 'Not Assigned' },
  timeSubmitted: { type: Date, default: Date.now },
  reply: { type: [String], default: [] },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
