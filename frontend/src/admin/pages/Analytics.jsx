import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("/analytics");
      setStats(res.data);
    } catch {
      alert("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <p className="container">Loading analytics...</p>;
  if (!stats) return <p className="container">No analytics data</p>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Analytics</h2>
        <p>Hotel performance overview</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h4>Total Revenue</h4>
          <h3>₹ {stats.totalRevenue}</h3>
        </div>

        <div className="stat-card">
          <h4>Total Bookings</h4>
          <h3>{stats.totalBookings}</h3>
        </div>

        <div className="stat-card">
          <h4>Active Guests</h4>
          <h3>{stats.activeGuests}</h3>
        </div>

        <div className="stat-card">
          <h4>Cancelled</h4>
          <h3>{stats.cancelled}</h3>
        </div>
      </div>

      <div className="analytics-card">
        <h3>Booking Status Breakdown</h3>

        <div className="status-grid">
          <div className="status-item pending">
            Pending <span>{stats.pending}</span>
          </div>

          <div className="status-item confirmed">
            Confirmed <span>{stats.confirmed}</span>
          </div>

          <div className="status-item checkedin">
            Checked-In <span>{stats.checkedin}</span>
          </div>

          <div className="status-item checkedout">
            Checked-Out <span>{stats.checkedout}</span>
          </div>

          <div className="status-item cancelled">
            Cancelled <span>{stats.cancelled}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
