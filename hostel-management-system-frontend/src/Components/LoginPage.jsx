import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Login response data:', data);

        if (data.user) {
          // Store the user data in localStorage
          localStorage.setItem('role', data.user.role); // Store user role
          localStorage.setItem('user', JSON.stringify(data.user)); // Store user info
          localStorage.setItem('isAuthenticated', 'true'); // Set authentication status

          // Redirect based on role
          if (data.user.role === 'manager') {
            navigate('/manager-dashboard');
          } else if (data.user.role === 'student') {
            navigate('/student-dashboard');
          }
        } else {
          alert('Invalid credentials');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('There was an error logging in. Please try again.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
