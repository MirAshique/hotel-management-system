import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/RoomDetails.css";

const FALLBACK_IMAGE = "https://via.placeholder.com/900x500";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [settings, setSettings] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomRes = await API.get(`/rooms/${id}`);
        const settingsRes = await API.get("/settings");

        setRoom(roomRes.data.room);
        setSettings(settingsRes.data.settings);
      } catch (err) {
        console.error("Failed to load room or settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const totalPrice = nights * (room?.pricePerNight || 0);

  const handleBooking = async () => {
    setError("");

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      setError("Check-out date must be after check-in.");
      return;
    }

    try {
      setBookingLoading(true);

      await API.post("/bookings", {
        roomId: room._id,
        checkIn,
        checkOut,
      });

      navigate("/my-bookings");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Booking failed. Please try different dates."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <p className="container">Loading room details...</p>;
  if (!room) return <p className="container">Room not found.</p>;

  const images =
    room.images && room.images.length > 0
      ? room.images
      : [{ url: FALLBACK_IMAGE }];

  return (
    <div className="room-details">
      {/* IMAGE GALLERY */}
      <div className="room-slider">
        <div className="room-main-image">
          <img src={images[activeImage].url} alt={room.title} />
        </div>

        <div className="room-thumbnails">
          {images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt="room thumbnail"
              className={index === activeImage ? "active" : ""}
              onClick={() => setActiveImage(index)}
            />
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="room-details-content">
        <div className="room-info">
          <h2>{room.title}</h2>
          <p>{room.description}</p>

          <div className="room-price">
            ${room.pricePerNight} <span>/ night</span>
          </div>
        </div>

        {/* BOOKING CARD */}
        <div className="booking-card">
          <h3>Book This Room</h3>

          {error && (
            <div className="booking-error">{error}</div>
          )}

          <label>Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />

          <label>Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn}
          />

          {nights > 0 && (
            <div className="price-summary">
              <p>Nights: <strong>{nights}</strong></p>
              <p>Total: <strong>${totalPrice}</strong></p>
            </div>
          )}

          <button
            className="btn"
            onClick={handleBooking}
            disabled={bookingLoading}
          >
            {bookingLoading ? "Booking..." : "Confirm Booking"}
          </button>
        </div>

        {/* CANCELLATION POLICY */}
        {settings?.cancellationPolicy && (
          <div className="cancellation-policy">
            <h4>Cancellation Policy</h4>
            <p>{settings.cancellationPolicy}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
