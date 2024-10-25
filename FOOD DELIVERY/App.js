import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home'; // Import Home component

const Apps = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} /> {/* Route for Home page */}
          <Route path="/" element={<Login />} /> {/* Default route to Login */}
        </Routes>
      </div>
    </Router>
  );
};

export default Apps;
