// pages/login.tsx

"use client";

import React, { useState } from "react";
import "./page.css"; // Update path to login.css as needed

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(false); // State to toggle between login and register
  const [formData, setFormData] = useState({
    fullName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    lastName: "",
    email: "",
  });

  const resetForm = () => {
    setFormData({
      fullName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
    });
  };


  const validateInput = (name: string, value: string) => {
    switch (name) {
      case "fullName":
      case "lastName":
        // Only allow alphabets (spaces are allowed for full name)
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          return "Name must contain only alphabets.";
        }
        return ""; // No error
      case "email":
        // Standard email format validation
        if (
          !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
        ) {
          return "Enter a valid email address.";
        }
        return ""; // No error
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setErrors({ ...errors, [name]: error });
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = {
      fullName: validateInput("fullName", formData.fullName),
      lastName: validateInput("lastName", formData.lastName),
      email: validateInput("email", formData.email),
    };
    setErrors(validationErrors);

    if (Object.values(validationErrors).some((err) => err)) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.setItem('user', JSON.stringify({ username: formData.username }));
        window.location.href = "newhome/profile";
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      resetForm(); // Clear form after submission
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.setItem('user', JSON.stringify({
          username: data.user.username,
          isAdmin: data.user.isAdmin, // Store the isAdmin flag in localStorage
        }));
  
        // Redirect based on user role (admin or regular user)
        if (data.user.isAdmin) {
          window.location.href = "/adminPage"; // Admin page
        } else {
          window.location.href = "/newhome/profile"; // Regular user profile page
        }
      } else {
        alert(data.error); // Stay on the same page
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Something went wrong. Please try again.");
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
            {errors.fullName && <p className="error-message">{errors.fullName}</p>}

            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter Last Name..."
              required
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className="error-message">{errors.lastName}</p>}

            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email..."
              required
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}

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
            Already have an account?{" "}
            <button className="toggle-button" onClick={handleToggle}>
              Login
            </button>
          </p>
        </div>
      ) : (
        <div className="form-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
    <label>Username:</label>
    <input
      type="text"
      name="username"
      placeholder="Enter Username..."
      required
      value={formData.username} // Bind to state
      onChange={handleChange}   // Handle changes
    />

    <label>Password:</label>
    <input
      type="password"
      name="password"
      placeholder="Enter Password..."
      required
      value={formData.password} // Bind to state
      onChange={handleChange}   // Handle changes
    />

    <button type="submit" className="form-button">
      Login
    </button>
  </form>
          <p>
            New User?{" "}
            <button className="toggle-button" onClick={handleToggle}>
              Register
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
