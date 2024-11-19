'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13+
import "./page.css";

const DashboardPage: React.FC = () => {
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [filteredCapsules, setFilteredCapsules] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search input
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchTimeCapsules = async () => {
      try {
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user");
          const username = storedUser ? JSON.parse(storedUser).username : null;

          if (!username) {
            setError("No logged-in user found.");
            setLoading(false);
            return;
          }

          const response = await fetch(`/api/getTimeCapsules?username=${username}`);
          if (!response.ok) throw new Error("Failed to fetch time capsules.");
          const data = await response.json();

          setTimeCapsules(data.capsules);
          setFilteredCapsules(data.capsules); // Initialize the filtered list
          setTotalCount(data.totalCount);
        }
      } catch (error: any) {
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeCapsules();
  }, []);

  // Filter time capsules based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCapsules(timeCapsules); // Show all capsules when the search is empty
    } else {
      setFilteredCapsules(
        timeCapsules.filter((capsule: any) =>
          capsule.capsule_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, timeCapsules]);

  const handleCreateCapsuleClick = () => {
    router.push('/newhome/createCapsuleForm'); // Navigate to the form page
  };

  const handleCapsuleClick = (capsuleName: string) => {
    // Redirect to timecapsulePage and pass capsule name as query parameter
    router.push(`/newhome/timeCapsulePage?capsuleName=${capsuleName}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <h1>Dashboard</h1>

        {/* Search bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search time capsules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update the search query
            className="search-input"
          />
        </div>

        <div className="button-grid">
          {filteredCapsules.length > 0 ? (
            filteredCapsules.map((capsule: any) => (
              <button
                key={capsule.capsule_id}
                className="image-button"
                onClick={() => handleCapsuleClick(capsule.capsule_name)} // Handle click and pass capsule name
              >
                <Image src="/assets/capsule.png" alt={capsule.capsule_name} width={150} height={150} />
                <span>{capsule.capsule_name}</span>
                <div>
                  {/* Display 'received' status for received capsules */}
                  Status: {capsule.receiver_username ? "received" : capsule.status}
                </div>
              </button>
            ))
          ) : (
            <p>No time capsules found</p>
          )}
        </div>
      </main>
      <div className="bottom-container">
        <div>Total Capsules Fetched: {totalCount}</div>
        <button className="create-button" onClick={handleCreateCapsuleClick}>
          Create time capsule
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
