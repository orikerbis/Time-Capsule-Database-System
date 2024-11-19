'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import './page.css';

// Declare SharedUser type
type SharedUser = { username: string; };

const SharedUsersForm = () => {
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([{ username: "" }]);
  const [error, setError] = useState("");
  const [capsuleId, setCapsuleId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const capsuleIdFromUrl = searchParams.get('capsuleId');
    if (capsuleIdFromUrl) {
      setCapsuleId(capsuleIdFromUrl);
    } else {
      setError("Capsule ID is missing.");
    }

    // Clear temporary variables except username
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const storedUsername = JSON.parse(storedUser).username;
      // Ensure only username is kept in state and clear other fields
      setSharedUsers([{ username: storedUsername }]);
    }
  }, [searchParams]);

  const handleSharedUserChange = (index: number, value: string) => {
    const newSharedUsers = [...sharedUsers];
    newSharedUsers[index].username = value;
    setSharedUsers(newSharedUsers);
  };

  const addSharedUser = () => {
    setSharedUsers([...sharedUsers, { username: "" }]);
  };

  const validateAndSubmit = async () => {
    if (sharedUsers.some(user => !user.username)) {
      setError("Please fill all shared user details.");
      return;
    }
    setError("");

    try {
      const response = await fetch("/api/addSharedUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shared_users: sharedUsers, capsule_id: capsuleId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Shared users data submitted successfully!");
        router.push('/newhome/dashboardPage');
      } else {
        setError(data.error || "Failed to submit shared users.");
      }
    } catch (error) {
      console.error("Error submitting shared users:", error);
      setError("An error occurred while submitting shared users.");
    }
  };

  return (
    <div className="form-container">
      <h2>Share Capsule</h2>
      {sharedUsers.map((user, index) => (
        <div key={index}>
          <label>
            Username:
            <input
              type="text"
              value={user.username}
              onChange={(e) => handleSharedUserChange(index, e.target.value)}
              required
            />
          </label>
        </div>
      ))}
      <button type="button" onClick={addSharedUser}>Add Shared User</button>
      {error && <p className="error">{error}</p>}
      <button type="button" onClick={validateAndSubmit}>Submit</button>
    </div>
  );
};

export default SharedUsersForm;
