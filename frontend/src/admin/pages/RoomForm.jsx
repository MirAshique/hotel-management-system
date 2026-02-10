import { useState } from "react";
import API from "../../api/axios";

const RoomForm = ({ room, onClose, onSaved }) => {
  const [name, setName] = useState(room?.name || "");
  const [price, setPrice] = useState(room?.price || "");
  const [description, setDescription] = useState(room?.description || "");
  const [images, setImages] = useState([]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      let roomId = room?._id;

      // CREATE
      if (!room) {
        const res = await API.post("/rooms", {
          name,
          price,
          description,
        });
        roomId = res.data._id;
      }

      // UPLOAD IMAGES
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));

        await API.post(`/rooms/${roomId}/images`, formData);
      }

      onSaved();
      onClose();
    } catch (err) {
      alert("Save failed");
    }
  };

  return (
    <div className="modal">
      <form className="modal-card" onSubmit={submitHandler}>
        <h3>{room ? "Edit Room" : "Add Room"}</h3>

        <input
          placeholder="Room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price per night"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <input
          type="file"
          multiple
          onChange={(e) => setImages([...e.target.files])}
        />

        <div className="modal-actions">
          <button className="btn">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
