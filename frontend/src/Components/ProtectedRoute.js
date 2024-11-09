import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ children, setUserData}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // State to hold auth status
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // If there is no token, redirect to login
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    // Decode the token to get the expiration time (exp) and check if it's expired
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // current time in seconds

    if (decodedToken.exp < currentTime) {
      // If token is expired, remove it from localStorage and redirect to login
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      return;
    }

    // If token is not expired, verify the token's authenticity with the server
    const verifyToken = async () => {
      try {
        const response = await axios.post('http://localhost:5001/api/auth/verify-token', { token });
        if (response.data.valid) {
          setIsAuthenticated(true); // Token is valid
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false); // Token is invalid
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false); // On error, consider the token invalid
      }
    };

    verifyToken(); // Call the backend to verify the token

    console.log('Token is valid');
    // Extract user data from decoded token
    const user = {
      name: decodedToken.name,
      rollNumber: decodedToken.rollNumber,
      role: decodedToken.role
    };
    
    // Set user data in state
    setUserData(user);
  }, [token]);

  // If we're still checking authentication, show a loading state
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // If token is invalid or expired, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  
  // If token is valid, render the protected route
  return children;
};

export default ProtectedRoute;
