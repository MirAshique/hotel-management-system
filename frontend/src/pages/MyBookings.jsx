import React, { useEffect, useState } from "react";
import API from "../api/axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");

      // ✅ FIX 1: handle both response shapes
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.bookings || [];

      setBookings(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await API.put(`/bookings/${id}/cancel-my`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to cancel booking");
    }
  };

  if (loading) {
    return <p className="container">Loading your bookings...</p>;
  }

  if (error) {
    return (
      <p className="container" style={{ color: "red" }}>
        {error}
      </p>
    );
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: "20px" }}>My Bookings</h2>

      {bookings.length === 0 && (
        <p>You have not made any bookings yet.</p>
      )}

      {bookings.map((b) => (
        <div
          key={b._id}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "16px",
            background: "#fff",
          }}
        >
          {/* ✅ FIX 2: room may be ID or object */}
          <h3>
            Room:{" "}
            {typeof b.room === "object"
              ? b.room.title
              : "Room ID " + b.room}
          </h3>

          <p>
            <strong>Check-in:</strong>{" "}
            {new Date(b.checkIn).toLocaleDateString()}
          </p>

          <p>
            <strong>Check-out:</strong>{" "}
            {new Date(b.checkOut).toLocaleDateString()}
          </p>

          <p>
            <strong>Total Price:</strong> ${b.totalPrice}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {b.status}
            </span>
          </p>

          {(b.status === "pending" || b.status === "confirmed") && (
            <button
              className="btn danger small"
              onClick={() => cancelBooking(b._id)}
            >
              Cancel Booking
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
