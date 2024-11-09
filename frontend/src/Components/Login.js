import './Login.css';  // Import the CSS file
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUserData }) => {  // Accept a function to set user data in parent component
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Clear any previous error

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        rollNumber,
        password,
      });

      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Set user data in parent component's state
      setUserData(user);

      navigate('/home');  // Redirect to protected home page
    } catch (error) {
      setError('Invalid credentials. Please try again.');
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="container">
      <h1>Complaint Management System</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Roll Number:</label>
          <input
            type="text"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}  {/* Display error if any */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
