import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserDashboard from './Userdashboard';

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
      {/* Role-based View */}
      <UserDashboard user={userData} />

      {/* Logout Button at the top-right */}
      <button 
        onClick={handleLogout} 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'red', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          cursor: 'pointer', 
          fontSize: '16px',
          zIndex: 1000, // Ensure it's above other content
          width: 'auto', // Ensure the button doesn't stretch to fill the space
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
