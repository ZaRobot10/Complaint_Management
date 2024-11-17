import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import axios from 'axios';

const Student = ({ user }) => {
  const [complaint, setComplaint] = useState('');
  const [category, setCategory] = useState('General');
  const [complaints, setComplaints] = useState([]);
  const [viewMode, setViewMode] = useState('submit');
  const [image, setImage] = useState(null); // New state for image file/
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    if (viewMode === 'view') {
      fetchComplaints();
    }
  }, [viewMode]);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/complaints/fetch/${user.rollNumber}`);
  
      if (response.data && response.data.length > 0) {
        // Sort complaints by timeSubmitted in descending order
        const sortedComplaints = response.data.sort((a, b) => new Date(b.timeSubmitted) - new Date(a.timeSubmitted));
        setComplaints(sortedComplaints);
      } else {
        setComplaints([]); // Set to empty if no complaints are returned
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };
  

  const handleComplaintSubmit = async () => {
    if (complaint) {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('rollNumber', user.rollNumber);
      formData.append('category', category);
      formData.append('description', complaint);
      if (image) formData.append('image', image); // Append image file if selected

      try {
        const response = await axios.post('http://localhost:5001/api/complaints/submit', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 201) {
          alert('Complaint submitted successfully!');
          setComplaints([...complaints, response.data.complaint]);
          setComplaint('');
          setCategory('General');
          setImage(null); // Reset image after submission
        }
      } catch (error) {
        console.error('Error submitting complaint:', error);
      }
    }
  };

  return (
    <div>
      {/* Top-Left Toggle Button */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
        }}
      >
        <button
          onClick={() => setViewMode(viewMode === 'submit' ? 'view' : 'submit')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {viewMode === 'submit' ? 'View Complaint History' : 'Submit Complaint'}
        </button>
      </div>

      <div style={{ marginTop: '60px' }}>
        <UserCard user={user} />

        <h4 style={{ textAlign: 'center', display: 'inline-block', marginRight: '10px' }}>
    {viewMode === 'submit' ? 'Submit a Complaint' : 'Complaint History'}
  </h4>

  {viewMode !== 'submit' && (
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      style={{
        padding: '8px',
        marginLeft: '10px',
        fontSize: '14px',
        display: 'inline-block',
      }}
    >
      <option value="All">All</option>
      <option value="Active">Active</option>
      <option value="Resolved">Resolved</option>
    </select>
  )}

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
          {viewMode === 'submit' ? (
            <div>
              {/* Complaint Category Dropdown */}
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '10px 0',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                }}
              >
                <option value="Academic">Academic</option>
                <option value="Facility">Facility</option>
                <option value="Hygiene">Hygiene</option>
                <option value="Financial Aid & Fees">Financial Aid & Fees</option>
                <option value="Inappropriate Conduct">Inappropriate Conduct</option>
                <option value="Other">Other</option>
              </select>

              {/* Complaint Textarea */}
              <textarea
                placeholder="Describe your complaint here..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                rows="4"
                style={{
                  width: '100%',
                  padding: '10px',
                  margin: '10px 0',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                }}
              />

              {/* Image Upload */}
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                style={{
                  margin: '10px 0',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  width: '100%',
                }}
              />

              {/* Submit Button */}
              <button
                onClick={handleComplaintSubmit}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007BFF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Submit Complaint
              </button>
            </div>
          ) : complaints.length > 0 ? (
            complaints
          .filter((complaint) => {
            if (filterStatus === 'All') return true;
            if (filterStatus === 'Active') return complaint.status !== 'Resolved';
            if (filterStatus === 'Resolved') return complaint.status === 'Resolved';
            return true;
          })
          .map((c, index) => (
              <div key={index} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <p>
                  <strong>Category:</strong> {c.category}
                </p>
                <p>
                  <strong>Complaint:</strong> {c.description}
                </p>
                <p>
                  <strong>Status:</strong> {c.status}
                </p>
                <p>
                  <strong>Assigned To:</strong> {c.assignedTo || 'Unassigned'}
                </p>
                <p>
                  <strong>Time Submitted:</strong> {new Date(c.timeSubmitted).toLocaleString()}
                </p>
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

              </div>
            ))
          ) : (
            <p>No complaints submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Student;
