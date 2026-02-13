import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? "solid" : "glass"}`}>
      <nav className="navbar">

        {/* BRAND */}
        <Link to="/" className="navbar-brand">
          <span className="brand-crown">♛</span>
          <span className="brand-text">Crown Palace</span>
        </Link>

        {/* HAMBURGER */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* LINKS */}
        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>

          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/rooms" className="nav-link" onClick={() => setMenuOpen(false)}>
            Rooms
          </Link>

          {user && (
            <Link to="/my-bookings" className="nav-link" onClick={() => setMenuOpen(false)}>
              My Bookings
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className="nav-link admin-link" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          )}

          {user ? (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="register-btn" onClick={() => setMenuOpen(false)}>
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
