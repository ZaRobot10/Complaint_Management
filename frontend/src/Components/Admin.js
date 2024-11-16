import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import axios from 'axios';

const Admin = ({ user }) => {
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [history, setHistory] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [facultyLoading, setFacultyLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/complaints/allcomplaints');
        setFilteredComplaints(response.data.filter((c) => c.status !== 'Resolved'));
        setHistory(response.data.filter((c) => c.status === 'Resolved'));
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/complaints/faculty');
        setFaculty(response.data);
      } catch (error) {
        console.error('Error fetching faculty:', error);
      } finally {
        setFacultyLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const assignComplaint = async (id, facultyName) => {
    if (!facultyName) {
      alert('Please select a faculty member before assigning.');
      return;
    }

    try {
      await axios.put(`http://localhost:5001/api/complaints/assign/${id}`, { assignedTo: facultyName });

      // Update the filteredComplaints list with the new assignment
      setFilteredComplaints((prevComplaints) =>
        prevComplaints.map((c) =>
          c._id === id ? { ...c, assignedTo: facultyName } : c
        )
      );

      alert('Complaint assigned successfully!');
      setSelectedFaculty(''); // Reset the selected faculty after assignment
    } catch (error) {
      console.error('Error assigning complaint:', error);
    }
  };

  return (
    <div>
      {/* History Toggle Button */}
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
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
        <UserCard user={user} />

        <h4 style={{ textAlign: 'center' }}>
          {showHistory ? 'Complaint History' : 'Assign Complaints'}
        </h4>

        <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
          {(showHistory ? history : filteredComplaints).map((c) => (
            <div key={c._id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              <p><strong>Name:</strong> {c.name}</p>
              <p><strong>Roll Number:</strong> {c.rollNumber}</p>
              <p><strong>Category:</strong> {c.category}</p>
              <p><strong>Complaint:</strong> {c.description}</p>
              <p><strong>Status:</strong> {c.status}</p>
              <p><strong>Assigned To:</strong> {c.assignedTo}</p>
              <p><strong>Time Submitted:</strong> {new Date(c.timeSubmitted).toLocaleString()}</p>
              {c.reply.length > 0 && (
                <div>
                  <strong>Replies:</strong>
                  <ul>
                    {c.reply.map((reply, index) => (
                      <li key={index}>{reply}</li>
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
              {!showHistory && (
                <div>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    style={{ padding: '5px', marginBottom: '10px', width: '100%' }}
                    disabled={facultyLoading}
                  >
                    <option value="">Select Faculty</option>
                    {faculty.map((f, index) => (
                      <option key={index} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => assignComplaint(c._id, selectedFaculty)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    Assign
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {loading && <p>Loading complaints...</p>}
        {!loading && (showHistory ? history.length === 0 : filteredComplaints.length === 0) && (
          <p>No complaints to display.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
