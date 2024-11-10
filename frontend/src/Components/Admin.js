import React, { useState } from 'react';
import UserCard from './UserCard';

const Admin = ({ user }) => {
  const [complaints, setComplaints] = useState([
    { id: 1, text: 'Library books missing', assignedTo: 'Unassigned' },
  ]);
  const [faculty, setFaculty] = useState(['Dr. Smith', 'Prof. Johnson']); // Placeholder for faculty list

  const assignComplaint = (id, facultyName) => {
    setComplaints(
      complaints.map((c) =>
        c.id === id ? { ...c, assignedTo: facultyName } : c
      )
    );
  };

  return (
    <div>
      <UserCard user={user} />

      <h4>Assign Complaints</h4>
      {complaints.length > 0 ? (
        complaints.map((c) => (
          <div key={c.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <p><strong>Complaint:</strong> {c.text}</p>
            <p><strong>Assigned to:</strong> {c.assignedTo}</p>
            <select
              onChange={(e) => assignComplaint(c.id, e.target.value)}
              style={{ padding: '5px', marginTop: '5px' }}
            >
              <option value="">Select Faculty</option>
              {faculty.map((f, index) => (
                <option key={index} value={f}>{f}</option>
              ))}
            </select>
          </div>
        ))
      ) : (
        <p>No complaints to assign.</p>
      )}
    </div>
  );
};

export default Admin;
