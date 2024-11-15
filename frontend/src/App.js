import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Components/Login';
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  const [userData, setUserData] = useState(null); // Store user data in state

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Pass setUserData to Login so it can set the user data upon successful login */}
          <Route path="/" element={<Login setUserData={setUserData} />} />
          <Route path="/login" element={<Login setUserData={setUserData} />} />

          {/* Pass setUserData to ProtectedRoute for token verification */}
          <Route
            path="/home"
            element={
              <ProtectedRoute setUserData={setUserData}>
                <Home userData={userData} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
