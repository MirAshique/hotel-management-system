import express from "express";
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  uploadRoomImages,
} from "../controllers/roomController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getRooms);
router.get("/:id", getRoomById);

// Admin CRUD routes
router.post("/", protect, authorizeRoles("admin"), createRoom);
router.put("/:id", protect, authorizeRoles("admin"), updateRoom);
router.delete("/:id", protect, authorizeRoles("admin"), deleteRoom);

// ✅ IMAGE UPLOAD ROUTE (THIS WAS MISSING / BROKEN)
router.post(
  "/:id/images",
  protect,
  authorizeRoles("admin"),
  upload.array("images", 5),
  uploadRoomImages
);

export default router;
