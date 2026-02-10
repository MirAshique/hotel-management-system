import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "checkedin", label: "Checked-In" },
  { key: "checkedout", label: "Checked-Out" },
  { key: "cancelled", label: "Cancelled" },
];

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = async () => {
    try {
      const res = await axios.get("/bookings");
      setBookings(res.data.bookings || res.data || []);
    } catch {
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ================= ACTION HANDLER ================= */
  const updateStatus = async (id, action) => {
    try {
      await axios.put(`/bookings/${id}/${action}`);
      fetchBookings();
    } catch {
      alert("Action failed");
    }
  };

  /* ================= FILTER BOOKINGS ================= */
  const filteredBookings =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  if (loading) return <p className="container">Loading bookings...</p>;

  return (
    <div className="admin-page">
      {/* ================= HEADER ================= */}
      <div className="admin-header">
        <h2>Bookings</h2>
        <p>Manage all hotel reservations</p>
      </div>

      {/* ================= TABS ================= */}
      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Dates</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b._id}>
                <td>
                  <strong>{b.user?.name}</strong>
                  <div className="muted">{b.user?.email}</div>
                </td>

                <td>{b.room?.title}</td>

                <td>
                  {new Date(b.checkIn).toLocaleDateString()} –{" "}
                  {new Date(b.checkOut).toLocaleDateString()}
                </td>

                <td>₹ {b.totalPrice}</td>

                <td>
                  <span className={`badge ${b.status}`}>
                    {b.status}
                  </span>
                </td>

                <td className="admin-actions">
                  {b.status === "pending" && (
                    <button
                      className="btn small"
                      onClick={() => updateStatus(b._id, "confirm")}
                    >
                      Confirm
                    </button>
                  )}

                  {b.status === "confirmed" && (
                    <button
                      className="btn small"
                      onClick={() => updateStatus(b._id, "checkin")}
                    >
                      Check-In
                    </button>
                  )}

                  {b.status === "checkedin" && (
                    <button
                      className="btn small"
                      onClick={() => updateStatus(b._id, "checkout")}
                    >
                      Check-Out
                    </button>
                  )}

                  {b.status !== "cancelled" &&
                    b.status !== "checkedout" && (
                      <button
                        className="btn small danger"
                        onClick={() => updateStatus(b._id, "cancel")}
                      >
                        Cancel
                      </button>
                    )}
                </td>
              </tr>
            ))}

            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan="6">No bookings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
