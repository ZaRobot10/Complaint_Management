import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ userData }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome {userData?.name}</h1>
      <p>Roll Number: {userData?.rollNumber}</p>
      <p>Role: {userData?.role}</p>

      {/* Logout Button */}
      <button 
        onClick={handleLogout} 
        style={{
          backgroundColor: 'red', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          cursor: 'pointer', 
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
