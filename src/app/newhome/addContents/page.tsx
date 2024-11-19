'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation'; 
import './page.css';

const AddContentsPage = () => {
  const [files, setFiles] = useState<File[]>([]); // Store files
  const [error, setError] = useState("");
  const [username, setUsername] = useState<string | null>(null); 
  const router = useRouter(); 
  const searchParams = useSearchParams();

  const capsuleName = searchParams.get('capsuleName') || '';

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser  = localStorage.getItem('user');
      const storedUsername = storedUser  ? JSON.parse(storedUser ).username : null;
      setUsername(storedUsername); 

      if (!storedUsername) {
        setError("User  is not logged in. Please log in to continue.");
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(file => file.type.startsWith('image/')); // Filter for image files
      setFiles(validFiles); // Update state with valid image files
      if (validFiles.length === 0) {
        setError("Please upload at least one image file.");
      } else {
        setError(""); // Clear error if valid files are selected
      }
    }
  };

  const validateForm = () => {
    if (files.length === 0) {
      setError("Please upload at least one image file.");
      return false;
    }
    if (!capsuleName) {
      setError("Capsule name is required.");
      return false;
    }
    if (!username) {
      setError("User  is not logged in.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append("capsule_name", capsuleName);
        formData.append("username", username || "");
  
        // Append only one image file
        if (files.length > 0) {
          formData.append("content", files[0]); // Only append the first image file
        }
  
        const response = await fetch("/api/addContents", {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          const capsuleId = data.capsule_id;
          alert("Image content added successfully to the Time Capsule!");
          router.push(`/newhome/addSharedUsers?capsuleId=${capsuleId}`);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to save content. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting content", error);
        setError("An error occurred while saving the content.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Page 2: Add Contents</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Upload Images:
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {files.length > 0 && (
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </label>

        {error && <p className="error">{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddContentsPage;