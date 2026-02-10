import React from "react";
import { Link } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501117716987-c8e1ecb2100b";

const RoomCard = ({ room }) => {
  const imageUrl =
    room.images && room.images.length > 0
      ? room.images[0].url
      : FALLBACK_IMAGE;

  return (
    <div className="room-card">
      {/* IMAGE */}
      <div className="room-card-image">
        <img src={imageUrl} alt={room.title} />
        <span className="room-price-badge">
          ${room.pricePerNight} / night
        </span>
      </div>

      {/* CONTENT */}
      <div className="room-card-body">
        <h3>{room.title}</h3>

        <p className="room-card-desc">
          {room.description?.slice(0, 90)}...
        </p>

        <div className="room-card-footer">
          <span className="room-capacity">
            👤 {room.capacity} Guests
          </span>

          <Link to={`/rooms/${room._id}`} className="btn small">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
