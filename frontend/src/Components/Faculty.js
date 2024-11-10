import React, { useState } from 'react';
import UserCard from './UserCard';

const Faculty = ({ user }) => {
  const [complaints, setComplaints] = useState([
    { id: 1, text: 'Network issue in lab', reply: '' },
  ]);

  const handleReply = (id, reply) => {
    setComplaints(
      complaints.map((c) =>
        c.id === id ? { ...c, reply } : c
      )
    );
  };

  return (
    <div>
      <UserCard user={user} />

      <h4>Complaints to Address</h4>
      {complaints.length > 0 ? (
        complaints.map((c) => (
          <div key={c.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <p><strong>Complaint:</strong> {c.text}</p>
            <textarea
              placeholder="Write your reply here..."
              value={c.reply}
              onChange={(e) => handleReply(c.id, e.target.value)}
              rows="3"
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
          </div>
        ))
      ) : (
        <p>No complaints to address.</p>
      )}
    </div>
  );
};

export default Faculty;
