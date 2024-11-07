'use client';

import React, { useState } from 'react';
import './login.css';

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false); // State to toggle between login and register
  const [formData, setFormData] = useState({
    fullName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleToggle = () => {
    setShowLogin(!showLogin); // Switch between login and register
  };

  return (
    <div className="auth-container">
      {!showLogin ? (
        <div className="form-container">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter Full Name..."
              required
              value={formData.fullName}
              onChange={handleChange}
            />

            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter Last Name..."
              required
              value={formData.lastName}
              onChange={handleChange}
            />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email..."
              required
              value={formData.email}
              onChange={handleChange}
            />

            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password..."
              required
              value={formData.password}
              onChange={handleChange}
            />

            <label>Username:</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username..."
              required
              value={formData.username}
              onChange={handleChange}
            />

            <button type="submit" className="form-button">
              Register
            </button>
          </form>
          <p>
            Already have an account?{' '}
            <button className="toggle-button" onClick={handleToggle}>
              Login
            </button>
          </p>
        </div>
      ) : (
        <div className="form-container">
          <h2>Login</h2>
          <form>
            <label>Username:</label>
            <input type="text" placeholder="Enter Username..." required />

            <label>Password:</label>
            <input type="password" placeholder="Enter Password..." required />

            <button type="submit" className="form-button">Login</button>
          </form>
          <p>
            New User?{' '}
            <button className="toggle-button" onClick={handleToggle}>
              Register
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
