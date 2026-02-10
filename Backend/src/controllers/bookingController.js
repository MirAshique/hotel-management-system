import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import HotelSettings from "../models/HotelSettings.js";
import mongoose from "mongoose";
import sendEmail from "../utils/sendEmail.js";
import {
  bookingCreatedEmail,
  bookingCancelledEmail,
  adminNotificationEmail,
} from "../emails/templates.js";

/* =====================================================
   CREATE BOOKING (CUSTOMER)
===================================================== */
export const createBooking = async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;

  if (!roomId || !checkIn || !checkOut) {
    res.status(400);
    throw new Error("Missing fields");
  }

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    res.status(400);
    throw new Error("Invalid room ID");
  }

  const room = await Room.findById(roomId);
  if (!room || !room.isActive) {
    res.status(404);
    throw new Error("Room not available");
  }

  const settings = await HotelSettings.findOne();

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    res.status(400);
    throw new Error("Invalid booking dates");
  }

  const totalNights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );

  const booking = await Booking.create({
    user: req.user._id,
    room: roomId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalNights,
    totalPrice: totalNights * room.pricePerNight,
    status: "pending",
  });

  // 📧 CUSTOMER EMAIL
  await sendEmail({
    to: req.user.email,
    subject: `Booking Created | ${settings?.hotelName || "Hotel"}`,
    html: bookingCreatedEmail(
      room.title,
      checkIn,
      checkOut,
      settings
    ),
  });

  // 📧 ADMIN EMAIL
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking | ${settings?.hotelName || "Hotel"}`,
    html: adminNotificationEmail(
      `New booking for <strong>${room.title}</strong>`,
      settings
    ),
  });

  res.status(201).json({ success: true, booking });
};

/* =====================================================
   CUSTOMER: MY BOOKINGS
===================================================== */
export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("room", "title images pricePerNight")
    .sort({ createdAt: -1 });

  res.json({ success: true, bookings });
};

/* =====================================================
   CUSTOMER: CANCEL OWN BOOKING
===================================================== */
export const cancelMyBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("room")
    .populate("user");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  if (!["pending", "confirmed"].includes(booking.status)) {
    res.status(400);
    throw new Error("Booking cannot be cancelled");
  }

  booking.status = "cancelled";
  await booking.save();

  const settings = await HotelSettings.findOne();

  await sendEmail({
    to: booking.user.email,
    subject: `Booking Cancelled | ${settings?.hotelName || "Hotel"}`,
    html: bookingCancelledEmail(
      booking.room.title,
      settings
    ),
  });

  res.json({ success: true, booking });
};

/* =====================================================
   ADMIN: ALL BOOKINGS
===================================================== */
export const getAllBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "name email")
    .populate("room", "title pricePerNight")
    .sort({ createdAt: -1 });

  res.json({ success: true, bookings });
};

/* =====================================================
   ADMIN: CONFIRM BOOKING
===================================================== */
export const confirmBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("room")
    .populate("user");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.status = "confirmed";
  await booking.save();

  const settings = await HotelSettings.findOne();

  await sendEmail({
    to: booking.user.email,
    subject: `Booking Confirmed | ${settings?.hotelName || "Hotel"}`,
    html: adminNotificationEmail(
      `Your booking for <strong>${booking.room.title}</strong> has been confirmed.`,
      settings
    ),
  });

  res.json({ success: true, booking });
};

/* =====================================================
   ADMIN: CANCEL BOOKING
===================================================== */
export const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("room")
    .populate("user");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.status = "cancelled";
  await booking.save();

  const settings = await HotelSettings.findOne();

  await sendEmail({
    to: booking.user.email,
    subject: `Booking Cancelled | ${settings?.hotelName || "Hotel"}`,
    html: bookingCancelledEmail(
      booking.room.title,
      settings
    ),
  });

  res.json({ success: true, booking });
};

/* =====================================================
   ADMIN: CHECK-IN
===================================================== */
export const checkInBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("room")
    .populate("user");

  booking.status = "checked-in";
  await booking.save();

  res.json({ success: true, booking });
};

/* =====================================================
   ADMIN: CHECK-OUT
===================================================== */
export const checkOutBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("room")
    .populate("user");

  booking.status = "checked-out";
  await booking.save();

  res.json({ success: true, booking });
};
