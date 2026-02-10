import React, { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    pricePerNight: "",
    capacity: "",
    roomType: "",
    description: "",
  });

  // store selected images per room
  const [selectedImages, setSelectedImages] = useState({});

  const lastRoomRef = useRef(null);

  /* ================= FETCH ROOMS ================= */
  const fetchRooms = async () => {
    try {
      const res = await axios.get("/rooms");
      setRooms(res.data.rooms || res.data || []);
    } catch (error) {
      console.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  /* ================= CREATE ROOM ================= */
  const createRoom = async () => {
    if (
      !form.title ||
      !form.pricePerNight ||
      !form.capacity ||
      !form.roomType ||
      !form.description
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setCreating(true);

      await axios.post("/rooms", {
        title: form.title,
        description: form.description,
        pricePerNight: Number(form.pricePerNight),
        capacity: Number(form.capacity),
        roomType: form.roomType.toLowerCase(),
      });

      setForm({
        title: "",
        pricePerNight: "",
        capacity: "",
        roomType: "",
        description: "",
      });

      await fetchRooms();

      setTimeout(() => {
        lastRoomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (error) {
      alert("Room creation failed");
    } finally {
      setCreating(false);
    }
  };

  /* ================= DELETE ROOM ================= */
  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      await axios.delete(`/rooms/${id}`);
      fetchRooms();
    } catch {
      alert("Delete failed");
    }
  };

  /* ================= HANDLE FILE SELECT ================= */
  const handleFileChange = (roomId, files) => {
    setSelectedImages((prev) => ({
      ...prev,
      [roomId]: files,
    }));
  };

  /* ================= UPLOAD IMAGES ================= */
  const uploadImages = async (roomId) => {
    const files = selectedImages[roomId];
    if (!files || files.length === 0) {
      alert("Please select images first");
      return;
    }

    const formData = new FormData();
    for (let file of files) {
      formData.append("images", file);
    }

    try {
      setUploadingId(roomId);

      await axios.post(`/rooms/${roomId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSelectedImages((prev) => {
        const copy = { ...prev };
        delete copy[roomId];
        return copy;
      });

      fetchRooms();
    } catch {
      alert("Image upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) return <p className="container">Loading rooms...</p>;

  return (
    <div className="admin-page">
      {/* ================= HEADER ================= */}
      <div className="admin-header">
        <h2>Room Management</h2>
        <p>Add, edit, or remove hotel rooms</p>
      </div>

      {/* ================= CREATE ROOM ================= */}
      <div className="admin-card">
        <h3>Create New Room</h3>
        <p className="muted">📸 Images can be uploaded after creating the room</p>

        <div className="form-grid">
          <input
            placeholder="Room Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="number"
            placeholder="Price per night"
            value={form.pricePerNight}
            onChange={(e) =>
              setForm({ ...form, pricePerNight: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: e.target.value })
            }
          />

          <input
            placeholder="Room Type (single, double, deluxe, suite)"
            value={form.roomType}
            onChange={(e) =>
              setForm({ ...form, roomType: e.target.value.toLowerCase() })
            }
          />

          <textarea
            placeholder="Room description (required)"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <button className="btn" onClick={createRoom} disabled={creating}>
          {creating ? "Creating..." : "+ Create Room"}
        </button>
      </div>

      {/* ================= ROOMS TABLE ================= */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Images</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room, index) => (
            <tr
              key={room._id}
              ref={index === rooms.length - 1 ? lastRoomRef : null}
            >
              <td>
                <strong>{room.title}</strong>
                <div className="muted">{room.roomType}</div>
              </td>

              <td>₹ {room.pricePerNight}</td>
              <td>{room.capacity}</td>

              <td>
                <span className="badge success">Active</span>
              </td>

              <td>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    handleFileChange(room._id, e.target.files)
                  }
                />

                <div style={{ marginTop: 6 }}>
                  <small>{room.images?.length || 0} photos</small>
                </div>

                <button
                  className="btn small"
                  style={{ marginTop: 6 }}
                  onClick={() => uploadImages(room._id)}
                  disabled={uploadingId === room._id}
                >
                  {uploadingId === room._id ? "Uploading..." : "Upload"}
                </button>
              </td>

              <td>
                <button
                  className="btn small danger"
                  onClick={() => deleteRoom(room._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {rooms.length === 0 && (
            <tr>
              <td colSpan="6">No rooms found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRooms;
