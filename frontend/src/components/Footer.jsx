import React, { useEffect, useState } from "react";
import "../styles/Footer.css";
import API from "../api/axios";

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/settings");
        setSettings(res.data.settings);
      } catch (err) {
        console.error("Failed to load hotel settings");
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* BRAND */}
        <div>
          <h3>🏨 {settings?.hotelName || "Hotel"}</h3>
          <p>
            Luxury hotel booking platform offering premium rooms, seamless
            reservations, and world-class service.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/rooms">Rooms</a></li>
            <li><a href="/my-bookings">My Bookings</a></li>
            <li><a href="/login">Login</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4>Contact</h4>
          <ul>
            <li>Email: {settings?.email || "—"}</li>
            <li>Phone: {settings?.phone || "—"}</li>
            <li>Location: {settings?.address || "—"}</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h4>Newsletter</h4>
          <p>Get offers & updates straight to your inbox.</p>

          <form
            className="footer-newsletter"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()}{" "}
        {settings?.hotelName || "Hotel Management System"}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
