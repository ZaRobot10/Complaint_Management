import React, { useState } from 'react';
import UserCard from './UserCard';

const Student = ({ user }) => {
  const [complaint, setComplaint] = useState('');
  const [complaints, setComplaints] = useState([]); // Placeholder for complaint history

  const handleComplaintSubmit = () => {
    if (complaint) {
      setComplaints([...complaints, { text: complaint, status: 'Submitted' }]);
      setComplaint('');
      alert('Complaint submitted successfully!');
    }
  };

  return (
    <div>
      <UserCard user={user} />

      <div style={{ marginTop: '1rem' }}>
        <h4>Submit a Complaint</h4>
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

      <div style={{ marginTop: '1rem' }}>
        <h4>Complaint History</h4>
        {complaints.length > 0 ? (
          complaints.map((c, index) => (
            <div key={index} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              <p><strong>Complaint:</strong> {c.text}</p>
              <p><strong>Status:</strong> {c.status}</p>
            </div>
          ))
        ) : (
          <p>No complaints submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Student;
