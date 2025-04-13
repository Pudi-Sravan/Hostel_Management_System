import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import ManagerDashboard from './Components/ManagerDashboard';
import StudentDashboard from './Components/StudentDashboard';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');

  // Check if user is authenticated and set role
  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
    const storedRole = localStorage.getItem('role');
    if (storedIsAuthenticated === 'true' && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
  }, []);

  return (
    <Router>  {/* This wraps the entire application in Router */}
      <div>
        <h1>Welcome to the Hostel Management System</h1>

        {/* Conditional rendering for navigation based on authentication */}
        {!isAuthenticated ? (
          <nav>
            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
          </nav>
        ) : (
          <nav>
            <Link to="/manager-dashboard">Manager Dashboard</Link> |{' '}
            <Link to="/student-dashboard">Student Dashboard</Link>
          </nav>
        )}

        <Routes>
          {/* Define routes for different pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/manager-dashboard" element={isAuthenticated && role === 'manager' ? <ManagerDashboard /> : <LoginPage />} />
          <Route path="/student-dashboard" element={isAuthenticated && role === 'student' ? <StudentDashboard /> : <LoginPage />} />
          {/* You can also add a 404 or default route */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router> 
  );
};

export default App;
