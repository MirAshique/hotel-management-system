import asyncHandler from "express-async-handler";
import Room from "../models/Room.js";
import cloudinary from "../config/cloudinary.js";

/* ================= CREATE ROOM ================= */
export const createRoom = asyncHandler(async (req, res) => {
  const {
  title,
  description,
  pricePerNight,
  capacity,
  roomType,
  amenities = [],
} = req.body;

// normalize roomType
const normalizedRoomType = roomType.toLowerCase();

  if (!title || !description || !pricePerNight || !capacity || !roomType) {
    res.status(400);
    throw new Error("All required fields must be provided");
  }

  const room = await Room.create({
  title,
  description,
  pricePerNight,
  capacity,
  roomType: normalizedRoomType,
  amenities,
  images: [],
  isActive: true,
});


  res.status(201).json({
    success: true,
    room,
  });
});

/* ================= GET ROOMS ================= */
export const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ isActive: true }).sort({ createdAt: -1 });

  res.json({
    success: true,
    rooms,
  });
});

/* ================= GET ROOM ================= */
export const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room || !room.isActive) {
    res.status(404);
    throw new Error("Room not found");
  }

  res.json({ success: true, room });
});

/* ================= UPDATE ROOM ================= */
export const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  Object.assign(room, req.body);
  const updatedRoom = await room.save();

  res.json({ success: true, room: updatedRoom });
});

/* ================= DELETE ROOM ================= */
export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  room.isActive = false;
  await room.save();

  res.json({ success: true, message: "Room removed" });
});

/* ================= UPLOAD IMAGES ================= */
export const uploadRoomImages = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("No images uploaded");
  }

  for (const file of req.files) {
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      { folder: "hotel_rooms" }
    );

    room.images.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  await room.save();
  res.json({ success: true, images: room.images });
});
