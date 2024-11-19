'use client'
import React, { useEffect, useState } from "react";
import "./page.css";

const ScheduledCapsulesPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [receivedCapsules, setReceivedCapsules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if (typeof window === "undefined") return;

        const storedUser = localStorage.getItem("user");
        const username = storedUser ? JSON.parse(storedUser).username : null;

        if (!username) {
          setError("No logged-in user found.");
          setLoading(false);
          return;
        }

        // Fetch the audit logs directly with the username
        const logsResponse = await fetch(`/api/audit-logs?username=${username}`);
        if (!logsResponse.ok) {
          setError("Failed to fetch logs.");
          setLoading(false);
          return;
        }

        const data = await logsResponse.json();
        setLogs(data.logs);
        setReceivedCapsules(data.receivedCapsules);
      } catch (error) {
        console.error("Error fetching logs:", error);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="scheduled-container">
      <main className="scheduled-main">
        <h1>Capsules History</h1>
        <p>Total Entries: <strong>{logs.length + receivedCapsules.length}</strong></p>
        <div className="capsules-columns">
          {/* Created Capsules */}
          <div className="column">
            <h2>Created Capsules</h2>
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

          {/* Received Capsules */}
          <div className="column">
            <h2>Received Capsules</h2>
            {receivedCapsules.map((capsule) => (
              <div key={capsule.received_id} className="capsule-item">
                <img
                  src={`/assets/capsule.png`}
                  className="capsule-image"
                />
                <div className="capsule-info">
                  <p>
                    Capsule Name: <strong>{capsule.capsule_name}</strong>
                  </p>
                  <p>
                    Shared By: <strong>{capsule.shared_by_username}</strong>
                  </p>
                  <p>
                    Received At: <strong>{new Date(capsule.received_at).toLocaleString()}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScheduledCapsulesPage;
