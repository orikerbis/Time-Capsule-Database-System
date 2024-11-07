import React, { useState } from 'react';
import './Login.css';

export default function Login() {
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here
    setError(true); // Set this to false when login is successful
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error-message">Incorrect Password. Try again</div>}
      <form onSubmit={handleLogin}>
        <label>Username:</label>
        <input type="text" placeholder="Enter Username..." required />
        
        <label>Password:</label>
        <input type="password" placeholder="Enter Password..." required />

        <button type="submit" className="login-button">Login</button>
      </form>
      <p>
        New User? <a href="/register" className="register-link">Register</a>
      </p>
    </div>
  );
}
