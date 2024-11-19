'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For navigation
import "./page.css";

const AdminDashboardPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize the router for navigation

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if (typeof window === "undefined") return;

        // Fetch audit logs data from your API (all logs for the admin)
        const logsResponse = await fetch(`/api/adminData`);
        if (!logsResponse.ok) {
          setError("Failed to fetch logs.");
          setLoading(false);
          return;
        }

        const data = await logsResponse.json();
        setLogs(data.logs); // Assuming the API returns logs under a 'logs' field
      } catch (error) {
        console.error("Error fetching logs:", error);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleSignOut = () => {
    // Clear any stored data (e.g., username, auth tokens)
    localStorage.clear();
    sessionStorage.clear();

    // Navigate back to the login page
    router.push("/login"); // Change to the correct route of your login page
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="scheduled-container">
      <main className="scheduled-main">
        <h1>Admin Audit Logs</h1>
        <p>
          Total Audit Log Entries: <strong>{logs.length}</strong>
        </p>
        <div className="capsules-columns">
          {/* Display Audit Logs */}
          <div className="column">
            <h2>Audit Logs</h2>
            {logs.map((log) => (
              <div key={log.log_id} className="capsule-item">
                <img
                  src={`/assets/capsule.png`}
                  className="capsule-image"
                />
                <div className="capsule-info">
                  <p>
                    Capsule Name: <strong>{log.capsule_name}</strong>
                  </p>
                  <p>
                    Action: <strong>{log.action_type}</strong>
                  </p>
                  <p>
                    Timestamp: <strong>{new Date(log.timestamp).toLocaleString()}</strong>
                  </p>
                  {log.shared_usernames && (
                    <p>
                      Shared With: <strong>{log.shared_usernames}</strong>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Sign Out Button */}
        <button onClick={handleSignOut} className="sign-out-button">
          Sign Out
        </button>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
