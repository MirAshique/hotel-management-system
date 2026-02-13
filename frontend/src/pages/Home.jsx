import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";

/* ========= CLOUDINARY IMAGE URLs ========= */
const hotelMain =
  "https://res.cloudinary.com/doihfukwc/image/upload/v1770986073/hotel-main_xq8kky.png";

const room1 =
  "https://res.cloudinary.com/doihfukwc/image/upload/v1770986061/room-1_q01e81.png";

const room2 =
  "https://res.cloudinary.com/doihfukwc/image/upload/v1770986080/room-2_ctfs3l.png";

const pool =
  "https://res.cloudinary.com/doihfukwc/image/upload/v1770986082/pool_couzqd.png";

const lobby =
  "https://res.cloudinary.com/doihfukwc/image/upload/v1770986069/lobby_ng6rus.png";

/* ========= ANIMATIONS ========= */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const Home = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    API.get("/settings").then((res) => {
      setSettings(res.data.settings);
    });
  }, []);

  return (
    <>
      {/* ================= HERO ================= */}
      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(
            rgba(15,23,42,0.6),
            rgba(15,23,42,0.6)
          ), url(${hotelMain})`,
        }}
      >
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <h1>{settings?.hotelName || "Luxury Hotel Experience"}</h1>

          <p className="hero-location">
            📍 {settings?.address || "Premium Destination"}
          </p>

          <p className="hero-subtitle">
            Discover premium rooms, world-class service, and seamless booking —
            designed for modern travelers.
          </p>

          <Link to="/rooms" className="btn hero-btn">
            Explore Rooms
          </Link>
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="container">
        <motion.div
          className="features-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {[
            ["🏨", "Premium Rooms", "Modern interiors and luxury comfort"],
            ["📅", "Easy Booking", "Real-time availability"],
            ["🔒", "Secure Payments", "Safe and protected"],
            ["⭐", "Trusted Service", "Loved by our guests"],
          ].map(([icon, title, text]) => (
            <motion.div key={title} className="feature-card" variants={fadeUp}>
              <h3>
                {icon} {title}
              </h3>
              <p>{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="home-gallery">
        <div className="container">
          <motion.h2
            className="section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            Experience Our Hotel
          </motion.h2>

          <motion.div
            className="gallery-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[hotelMain, room1, room2, pool, lobby].map((img, i) => (
              <motion.div
                key={i}
                className={i === 0 ? "gallery-main" : "gallery-item"}
                variants={fadeUp}
              >
                <img src={img} alt="Hotel gallery" />
              </motion.div>
            ))}
          </motion.div>

          {/* ================= TESTIMONIALS ================= */}
          <section className="testimonials">
            <div className="container">
              <h2 className="section-title">What Our Guests Say</h2>

              <div className="testimonial-grid">
                <div className="testimonial-card">
                  <span className="quote">“</span>
                  <p>
                    Amazing experience! The rooms were clean, modern, and the
                    service was excellent.
                  </p>
                  <h4>
                    <span className="avatar">👤</span> Ali Khan
                  </h4>
                </div>

                <div className="testimonial-card">
                  <span className="quote">“</span>
                  <p>
                    Booking was super easy and the staff was very professional.
                    Highly recommended!
                  </p>
                  <h4>
                    <span className="avatar">👤</span> Sarah Ahmed
                  </h4>
                </div>

                <div className="testimonial-card">
                  <span className="quote">“</span>
                  <p>
                    One of the best hotel stays I’ve had. Great location and
                    luxury feel.
                  </p>
                  <h4>
                    <span className="avatar">👤</span> John Williams
                  </h4>
                </div>
              </div>
            </div>
          </section>

          {/* ================= WHY CHOOSE US ================= */}
          <section className="home-why">
            <div className="container">
              <h2 className="section-title light">
                Why Choose Our Hotel
              </h2>

              <div className="stats">
                <div className="stat-card">
                  <span>😊</span>
                  <h3>500+</h3>
                  <p>Happy Guests</p>
                </div>

                <div className="stat-card">
                  <span>🛏️</span>
                  <h3>120+</h3>
                  <p>Luxury Rooms</p>
                </div>

                <div className="stat-card">
                  <span>⭐</span>
                  <h3>98%</h3>
                  <p>Positive Reviews</p>
                </div>

                <div className="stat-card">
                  <span>🕐</span>
                  <h3>24/7</h3>
                  <p>Support</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default Home;
