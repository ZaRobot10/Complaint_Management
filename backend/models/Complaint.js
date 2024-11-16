import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Ongoing', 'Resolved'], default: 'Pending', required: true},
  assignedTo: { type: String, default: 'Not Assigned' },
  timeSubmitted: { type: Date, default: Date.now },
  reply: { type: [String], default: [] },
  image: { type: String }  //field for storing image url or path
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
