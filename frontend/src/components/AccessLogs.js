import React, { useState, useEffect } from "react";
import axios from "axios";

function AccessLogs() {
  const [logs, setLogs] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [view, setView] = useState("logs");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsRes, statsRes] = await Promise.all([
        axios.get("/access"),
        axios.get("/access/statistics"),
      ]);
      setLogs(logsRes.data);
      setStatistics(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching access data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          background: "linear-gradient(to right, #dbeafe, #eff6ff)",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1e3a8a",
          fontSize: "1.2rem",
          fontWeight: "500",
        }}
      >
        Loading access logs...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(to right, #dbeafe, #eff6ff)",
        minHeight: "100vh",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          width: "90%",
          maxWidth: "1100px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          padding: "30px 40px",
          animation: "fadeIn 0.4s ease-in-out",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "25px" }}>
          <button
            onClick={() => setView("logs")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginRight: "10px",
              background: view === "logs" ? "#2563eb" : "#e0e7ff",
              color: view === "logs" ? "white" : "#1e3a8a",
              fontWeight: "500",
              transition: "0.3s",
            }}
          >
            Access Logs
          </button>
          <button
            onClick={() => setView("statistics")}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: view === "statistics" ? "#2563eb" : "#e0e7ff",
              color: view === "statistics" ? "white" : "#1e3a8a",
              fontWeight: "500",
              transition: "0.3s",
            }}
          >
            Statistics
          </button>
        </div>

        {view === "logs" ? (
          <div className="logs-view">
            <h3
              style={{
                textAlign: "center",
                color: "#1e3a8a",
                marginBottom: "20px",
              }}
            >
              Recent Access Logs
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.95rem",
                }}
              >
                <thead>
                  <tr style={{ background: "#f1f5f9", color: "#1e3a8a" }}>
                    <th style={thStyle}>Date & Time</th>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Item</th>
                    <th style={thStyle}>Access Type</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr
                      key={index}
                      style={{
                        background: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                      }}
                    >
                      <td style={tdStyle}>
                        {new Date(log.access_date).toLocaleString()}
                      </td>
                      <td style={tdStyle}>
                        {log.username || log.accessor_name || "Unknown"}
                      </td>
                      <td style={tdStyle}>{log.email || "N/A"}</td>
                      <td style={tdStyle}>
                        {log.item_title || `Item #${log.item_id}`}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            background:
                              log.access_type === "download"
                                ? "#22c55e"
                                : "#3b82f6",
                            color: "white",
                            fontSize: "0.85rem",
                            textTransform: "capitalize",
                          }}
                        >
                          {log.access_type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: "15px", color: "#475569", textAlign: "center" }}>
              Showing {logs.length} recent access logs
            </p>
          </div>
        ) : (
          <div className="statistics-view">
            <h3
              style={{
                textAlign: "center",
                color: "#1e3a8a",
                marginBottom: "20px",
              }}
            >
              Access Statistics
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.95rem",
                }}
              >
                <thead>
                  <tr style={{ background: "#f1f5f9", color: "#1e3a8a" }}>
                    <th style={thStyle}>Item</th>
                    <th style={thStyle}>Total Accesses</th>
                    <th style={thStyle}>Unique Users</th>
                    <th style={thStyle}>Views</th>
                    <th style={thStyle}>Downloads</th>
                    <th style={thStyle}>Last Accessed</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.map((stat, index) => (
                    <tr
                      key={index}
                      style={{
                        background: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                      }}
                    >
                      <td style={tdStyle}>{stat.title}</td>
                      <td style={tdStyle}>{stat.total_accesses}</td>
                      <td style={tdStyle}>{stat.unique_users}</td>
                      <td style={tdStyle}>{stat.view_count}</td>
                      <td style={tdStyle}>{stat.download_count}</td>
                      <td style={tdStyle}>
                        {stat.last_accessed
                          ? new Date(stat.last_accessed).toLocaleDateString()
                          : "Never"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: "15px", color: "#475569", textAlign: "center" }}>
              Tracking {statistics.length} items with access data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  padding: "10px",
  borderBottom: "2px solid #e2e8f0",
  textAlign: "left",
  fontWeight: "600",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #e2e8f0",
  color: "#334155",
};

export default AccessLogs;
