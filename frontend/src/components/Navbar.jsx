import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? "solid" : "glass"}`}>
      <nav className="navbar">
        {/* BRAND */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏨</span>
          <span className="brand-text">Hotel</span>
        </Link>

        {/* LINKS */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/rooms" className="nav-link">
            Rooms
          </Link>

          {user && (
            <Link to="/my-bookings" className="nav-link">
              My Bookings
            </Link>
          )}

          {/* ✅ ADMIN PANEL LINK (CLEAN & PROFESSIONAL) */}
          {user?.role === "admin" && (
            <Link to="/admin" className="nav-link admin-link">
              Admin Panel
            </Link>
          )}

          {/* AUTH */}
          {user ? (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/register" className="register-btn">
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
