import express from "express";
import {
  createBooking,
  getAllBookings,
  confirmBooking,
  cancelBooking,
  checkInBooking,
  checkOutBooking,
  getMyBookings,
  cancelMyBooking,
} from "../controllers/bookingController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * ================= CUSTOMER =================
 */

// Create booking
router.post("/", protect, createBooking);

// Get my bookings
router.get("/my", protect, getMyBookings);

// Cancel my booking
router.put("/:id/cancel-my", protect, cancelMyBooking);

/**
 * ================= ADMIN ====================
 */

router.get("/", protect, authorizeRoles("admin"), getAllBookings);
router.put("/:id/confirm", protect, authorizeRoles("admin"), confirmBooking);
router.put("/:id/cancel", protect, authorizeRoles("admin"), cancelBooking);
router.put("/:id/checkin", protect, authorizeRoles("admin"), checkInBooking);
router.put("/:id/checkout", protect, authorizeRoles("admin"), checkOutBooking);

export default router;
