import React, { useState } from 'react';
import UserCard from './UserCard';
import axios from 'axios';

const Student = ({ user }) => {
  const [complaint, setComplaint] = useState('');
  const [category, setCategory] = useState('Academic'); // Default category
  const [complaints, setComplaints] = useState([]); // Placeholder for complaint history
  const [viewMode, setViewMode] = useState('submit'); // State to toggle between views


  const handleComplaintSubmit = async () => {
    if (complaint) {
      try {
        // Send complaint data to backend
        const response = await axios.post('http://localhost:5001/api/complaints/submit', {
          name: user.name,
          rollNumber: user.rollNumber,
          category,  // Send the correct category state
          description: complaint
        });

        if (response.status === 201) {
          alert('Complaint submitted successfully!');
          setComplaints([...complaints, response.data.complaint]); // Add to the complaints list
          setComplaint('');
        }
      } catch (error) {
        console.error('Error submitting complaint:', error);
      }
    }
  };


  return (
    <div>
      <UserCard user={user} />

      {/* Top-left buttons */}
      <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          gap: '10px'
        }}>
        <button
          onClick={() => setViewMode('submit')}
          style={{
            padding: '10px 20px',
            backgroundColor: viewMode === 'submit' ? '#4CAF50' : '#ccc',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Submit Complaint
        </button>
        <button
          onClick={() => setViewMode('view')}
          style={{
            padding: '10px 20px',
            backgroundColor: viewMode === 'view' ? '#4CAF50' : '#ccc',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          View Complaints
        </button>
      </div>

      {viewMode === 'submit' ? (
        <div style={{ marginTop: '2rem' }}>
          <h4>Submit a Complaint</h4>

          {/* Dropdown for selecting complaint category */}
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ margin: '10px', padding: '8px', width: '100%' }}
          >
            <option value="Academic">Academic</option>
            <option value="Facility">Facility</option>
            <option value="hygiene">Hygiene</option>
            <option value="Financial Aid & Fees">Financial Aid & Fees</option>
            <option value="Inappropriate Conduct">Inappropriate Conduct</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            placeholder="Describe your complaint here..."
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <button onClick={handleComplaintSubmit} style={{ padding: '10px 20px' }}>
            Submit Complaint
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <h4>Complaint History</h4>
          {complaints.length > 0 ? (
            complaints.map((c, index) => (
              <div key={index} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <p><strong>Category:</strong> {c.category}</p>
                <p><strong>Complaint:</strong> {c.text}</p>
                <p><strong>Status:</strong> {c.status}</p>
              </div>
            ))
          ) : (
            <p>No complaints submitted yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Student;
