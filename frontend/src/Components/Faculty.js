import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import axios from 'axios';

const Faculty = ({ user }) => {
  const [complaints, setComplaints] = useState([]);
  const [responses, setResponses] = useState({}); // Store responses temporarily
  const [showHistory, setShowHistory] = useState(false); // Toggle complaint history view
  const [history, setHistory] = useState([]); // Store resolved complaints

  useEffect(() => {
    const fetchAssignedComplaints = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/complaints/assigned/${user.name}`);
        setComplaints(response.data.filter((c) => c.status !== 'Resolved')); // Exclude resolved complaints
        setHistory(response.data.filter((c) => c.status === 'Resolved')); // Store resolved complaints
      } catch (error) {
        console.error('Error fetching assigned complaints:', error);
      }
    };

    fetchAssignedComplaints();
  }, [user.name]);

  const handleReplyChange = (id, value) => {
    setResponses({
      ...responses,
      [id]: { ...(responses[id] || {}), reply: value },
    });
  };

  const handleStatusChange = (id, value) => {
    setResponses({
      ...responses,
      [id]: { ...(responses[id] || {}), status: value },
    });
  };

  const handleSubmit = async (id) => {
    const { reply = '', status } = responses[id] || {};
    try {
      await axios.put(`http://localhost:5001/api/complaints/respond/${id}`, { reply, status });
      
      const updatedComplaint = complaints.find((c) => c._id === id);
  
      if (status === 'Resolved') {
        // Update the complaint with the latest reply and status before moving to history
        const resolvedComplaint = {
          ...updatedComplaint,
          reply: reply ? [...updatedComplaint.reply, reply] : updatedComplaint.reply,
          status,
        };
  
        setHistory((prev) => [...prev, resolvedComplaint]); // Add to history
        setComplaints((prev) => prev.filter((c) => c._id !== id)); // Remove from complaints
      } else {
        setComplaints((prev) =>
          prev.map((c) =>
            c._id === id
              ? {
                  ...c,
                  reply: reply ? [...c.reply, reply] : c.reply,
                  status: status || c.status,
                }
              : c
          )
        );
      }
  
      alert('Response submitted successfully!');
      setResponses((prev) => ({ ...prev, [id]: {} })); // Clear input for this complaint
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };  

  return (
    <div>
      {/* Complaint History Button Positioned Top-Left */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
        }}
      >
        <button
          onClick={() => setShowHistory(!showHistory)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {showHistory ? 'Back to Active Complaints' : 'View Complaint History'}
        </button>
      </div>

      <div style={{ marginTop: '60px' }}>
        {/* User Card */}
        <UserCard user={user} />

        <h4 style={{ textAlign: 'center' }}>{showHistory ? 'Complaint History' : 'Complaints to Address'}</h4>

        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '5px',
            marginTop: '20px',
          }}
        >
          {showHistory ? (
            history.length > 0 ? (
              history.map((c) => (
                <div key={c._id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  <p><strong>Complaint:</strong> {c.description}</p>
                  <p><strong>Status:</strong> {c.status}</p>
                  {c.reply.length > 0 && (
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                  <strong style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Replies:</strong>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '0' }}>
                    {c.reply.map((r, i) => (
                      <li key={i} style={{ marginBottom: '5px', color: '#555' }}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
                  {c.image && (
                    <p>
                      <strong>Attachment:</strong>{' '}
                      <a
                        href={`http://localhost:5001/api/complaints/uploads/${c.image}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#007BFF', textDecoration: 'underline' }}
                      >
                        View Attachment
                      </a>
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>No resolved complaints.</p>
            )
          ) : complaints.length > 0 ? (
            complaints.map((c) => (
              <div key={c._id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <p><strong>Complaint:</strong> {c.description}</p>
                <p><strong>Status:</strong> {c.status}</p>
                {c.image && (
                  <p>
                    <strong>Attachment:</strong>{' '}
                    <a
                      href={`http://localhost:5001/api/complaints/uploads/${c.image}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#007BFF', textDecoration: 'underline' }}
                    >
                      View Attachment
                    </a>
                  </p>
                )}
                {c.reply.length > 0 && (
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                  <strong style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Replies:</strong>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '0' }}>
                    {c.reply.map((r, i) => (
                      <li key={i} style={{ marginBottom: '5px', color: '#555' }}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
                <textarea
                  placeholder="Write your reply here..."
                  rows="3"
                  style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                  value={responses[c._id]?.reply || ''}
                  onChange={(e) => handleReplyChange(c._id, e.target.value)}
                />
                <select
                  value={responses[c._id]?.status || c.status}
                  onChange={(e) => handleStatusChange(c._id, e.target.value)}
                  style={{ padding: '5px', marginBottom: '10px' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <button
                  onClick={() => handleSubmit(c._id)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Submit
                </button>
              </div>
            ))
          ) : (
            <p>No complaints assigned to you.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Faculty;
