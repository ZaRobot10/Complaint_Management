import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import axios from 'axios';

const Student = ({ user }) => {
  const [complaint, setComplaint] = useState('');
  const [category, setCategory] = useState('General');
  const [complaints, setComplaints] = useState([]);
  const [viewMode, setViewMode] = useState('submit');
  const [image, setImage] = useState(null);  // New state for image file

  useEffect(() => {
    if (viewMode === 'view') {
      fetchComplaints();
    }
  }, [viewMode]);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/complaints/fetch/${user.rollNumber}`);
      setComplaints(response.data);
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
      if (image) formData.append('image', image);  // Append image file if selected

      try {
        const response = await axios.post('http://localhost:5001/api/complaints/submit', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.status === 201) {
          alert('Complaint submitted successfully!');
          setComplaints([...complaints, response.data.complaint]);
          setComplaint('');
          setCategory('General');
          setImage(null);  // Reset image after submission
        }
      } catch (error) {
        console.error('Error submitting complaint:', error);
      }
    }
  };

  return (
    <div>
      <UserCard user={user} />

      {/* Toggle between submit and view modes */}
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
            <option value="Hygiene">Hygiene</option>
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

          {/* Image upload input */}
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ marginBottom: '10px' }}
          />

          <button onClick={handleComplaintSubmit} style={{ padding: '10px 20px' }}>
            Submit Complaint
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <h4>Complaint History</h4>
          <div style={{
           maxHeight: '400px',  // Adjust this value based on your layout
           overflowY: 'auto',   // Enables scrolling
          }}>
          {complaints.length > 0 ? (
            complaints.map((c, index) => (
              <div key={index} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <p><strong>Category:</strong> {c.category}</p>
                <p><strong>Complaint:</strong> {c.description}</p>
                <p><strong>Status:</strong> {c.status}</p>
                <p><strong>Assigned To:</strong> {c.assignedTo}</p>
                <p><strong>Time Submitted:</strong> {new Date(c.timeSubmitted).toLocaleString()}</p>
                {c.image && (
                  <img
                  src={`http://localhost:5001/api/complaints/uploads/${c.image}`}
                  alt="Complaint attachment"
                  style={{ maxWidth: '100%', marginTop: '10px' }}
                />
                )}
              </div>
            ))
          ) : (
            <p>No complaints submitted yet.</p>
          )}
           </div>
        </div>
      )}
    </div>
  );
};

export default Student;
