'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter
import "./page.css";

const TimeCapsulePage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize the router
  const capsuleName = searchParams?.get("capsuleName");

  const [releaseDate, setReleaseDate] = useState("");
  const [releaseTime, setReleaseTime] = useState("");
  const [status, setStatus] = useState("");
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [capsuleContents, setCapsuleContents] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [showContents, setShowContents] = useState(false);

  useEffect(() => {
    // Retrieve the logged-in user's username from localStorage
    const storedUser = localStorage.getItem("user");
    const storedUsername = storedUser ? JSON.parse(storedUser).username : null;
    setUsername(storedUsername);

    if (!capsuleName) return;

    // Fetch the time capsule details
    const fetchCapsuleDetails = async () => {
      try {
        const response = await fetch(`/api/capsuleInfo?capsuleName=${capsuleName}`);
        const capsule = await response.json();

        if (capsule.message) {
          setError(capsule.message);
        } else {
          setReleaseDate(capsule.release_date || "");
          setReleaseTime(capsule.release_time || "");
          setStatus(capsule.status || "");
          setSharedWith(capsule.sharedWith || []);
        }
      } catch (err) {
        setError("Error fetching capsule details");
      }
    };

    fetchCapsuleDetails();
  }, [capsuleName]);

  const openCapsule = async () => {
    if (status !== "delivered") {
      setError("This capsule has not been delivered yet.");
      return;
    }

    if (!sharedWith.includes(username || "")) {
      setError("This capsule is not shared with you.");
      return;
    }

    try {
      // Fetch capsule contents
      const response = await fetch(`/api/capsuleContents?capsuleName=${capsuleName}`);
      const contents = await response.json();

      if (contents.message) {
        setError(contents.message);
      } else {
        setCapsuleContents(contents);
        setShowContents(true); // Show the popup dialog
      }
    } catch (err) {
      setError("Error fetching capsule contents.");
    }
  };

  const closeDialog = () => {
    setShowContents(false);
  };

  const navigateToDashboard = () => {
    router.push("/newhome/dashboardPage"); // Navigate to the dashboard page
  };

  return (
    <div className="timecapsule-container">
      <main className="timecapsule-main">
        <h1>{capsuleName || "Time Capsule"}</h1>
        <div className="capsule-content">
          <img src={`/assets/capsule.png`} alt="Capsule" className="capsule-image" />
          <p>Status: <strong>{status || "Loading..."}</strong></p>
          <p>Release Date: <strong>{releaseDate || "Loading..."}</strong></p>
          <p>Release Time: <strong>{releaseTime || "Loading..."}</strong></p>
          <p>Shared With: <strong>{sharedWith.join(", ") || "No users"}</strong></p>
          {error && <p className="error-text">{error}</p>}

          <button className="open-button" onClick={openCapsule}>Open Capsule</button>
          <button className="back-button" onClick={navigateToDashboard}>Back</button>
        </div>

        {/* Capsule Contents Popup */}
        {showContents && (
          <div className="dialog-box">
            <div className="dialog-content">
              <h2>Capsule Content</h2>
              {capsuleContents.map((content, index) => (
                <div key={index}>
                  {content.content_type === "text" ? (
                    <p>{content.content_data}</p>
                  ) : (
                    <img src={`data:image/png;base64,${content.content_data}`} alt="Capsule Content" />
                  )}
                </div>
              ))}
              <button onClick={closeDialog}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TimeCapsulePage;
