import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${API_BASE}/dashboard`);
        if (!res.ok) throw new Error("Failed to load dashboard");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <section>
      <h2>Dashboard</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {summary && (
        <div className="cards">
          <div className="card">
            <h3>Properties</h3>
            <p>{summary.total_properties}</p>
          </div>
          <div className="card">
            <h3>Tenants</h3>
            <p>{summary.total_tenants}</p>
          </div>
          <div className="card">
            <h3>Total Payments</h3>
            <p>${summary.total_payments.toFixed(2)}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardPage;