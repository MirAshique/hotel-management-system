import React, { useEffect, useState } from "react";
import API from "../api/axios";
import RoomCard from "../components/RoomCard";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get("/rooms");
        setRooms(res.data.rooms || []);
      } catch (err) {
        setError("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="container room-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="room-card skeleton"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="container" style={{ color: "red" }}>
        {error}
      </p>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="container">
      <div className="rooms-header">
        <h2>Available Rooms</h2>
        <p>Select the perfect room for your stay</p>
      </div>

      <div className="room-grid">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}

        {rooms.length === 0 && (
          <p>No rooms available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Rooms;
