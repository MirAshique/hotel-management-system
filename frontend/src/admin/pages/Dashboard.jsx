import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    revenue: 0,
  });

  const fetchData = async () => {
  try {
    const res = await API.get("/bookings");
    const data = res.data.bookings || res.data;

    setBookings(data);
  } catch (err) {
    console.error("Failed to load bookings", err.response?.data);
  }
};


  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, action) => {
  try {
    await API.put(`/bookings/${id}/${action}`);
    fetchData();
  } catch (err) {
    console.error("Action failed:", err.response?.data);
    alert(
      err.response?.data?.message ||
        "Action failed. You may not have permission."
    );
  }
};


  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Hotel performance overview</p>
      </div>

      {/* STATS */}
      <div className="dashboard-stats">
        <div className="stat">
          <h4>Total Bookings</h4>
          <h2>{stats.total}</h2>
        </div>
        <div className="stat">
          <h4>Active Bookings</h4>
          <h2>{stats.active}</h2>
        </div>
        <div className="stat">
          <h4>Total Revenue</h4>
          <h2>₹ {stats.revenue}</h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="dashboard-card">
        <h3>Recent Bookings</h3>

        <table>
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Dates</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>
                  <strong>{b.user?.name}</strong>
                  <br />
                  <small>{b.user?.email}</small>
                </td>
                <td>{b.room?.name}</td>
                <td>
                  {new Date(b.checkIn).toLocaleDateString()} –{" "}
                  {new Date(b.checkOut).toLocaleDateString()}
                </td>
                <td>₹ {b.totalPrice}</td>
                <td>
                  <span className={`pill ${b.status}`}>
                    {b.status}
                  </span>
                </td>
                <td>
                  {b.status !== "cancelled" && (
                    <button
                      className="danger"
                      onClick={() => updateStatus(b._id, "cancel")}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
