'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Import the router for navigation
import axios from "axios";
import './page.css';

const CreateCapsuleForm = () => {
  const [capsuleName, setCapsuleName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [releaseTime, setReleaseTime] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter(); // Use Next.js router for redirection

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem('user');
      const storedUsername = storedUser ? JSON.parse(storedUser).username : null;
      setUsername(storedUsername); // Update state with the retrieved username

      if (!storedUsername) {
        setError("User is not logged in. Please log in to continue.");
      }
    }
  }, []);

  const validateForm = () => {
    if (!capsuleName || !releaseDate || !releaseTime) {
      setError("All fields are required.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      setError("User is not logged in. Please log in to continue.");
      return;
    }

    // Validate the form
    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("capsule_name", capsuleName);
        formData.append("release_date", releaseDate);
        formData.append("release_time", releaseTime);

        // Single API call to create the capsule
        const response = await axios.post("/api/time-capsule", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Time Capsule Created", response.data);
        const { capsule_name } = response.data;
        alert("Time Capsule Created!"); // Display the success message

        // Redirect to the addContents page
        router.push(`/newhome/addContents?capsuleName=${encodeURIComponent(capsule_name)}`);
      } catch (error) {
        console.error("Error submitting form", error);
        setError("An error occurred while submitting the form.");
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Create Capsule</h2>
        <label>
          Capsule Name:
          <input
            type="text"
            value={capsuleName}
            onChange={(e) => setCapsuleName(e.target.value)}
            required
          />
        </label>
        <label>
          Release Date:
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />
        </label>
        <label>
          Release Time:
          <input
            type="time"
            value={releaseTime}
            onChange={(e) => setReleaseTime(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Create Capsule</button>
      </form>
    </div>
  );
};

export default CreateCapsuleForm;
