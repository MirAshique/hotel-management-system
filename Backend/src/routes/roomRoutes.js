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

/* ================= PUBLIC ROUTES ================= */
router.get("/", getRooms);
router.get("/:id", getRoomById);

/* ================= ADMIN CRUD ROUTES ================= */
router.post("/", protect, authorizeRoles("admin"), createRoom);
router.put("/:id", protect, authorizeRoles("admin"), updateRoom);
router.delete("/:id", protect, authorizeRoles("admin"), deleteRoom);

/* ================= IMAGE UPLOAD ROUTE ================= */
router.post(
  "/:id/images",
  protect,
  authorizeRoles("admin"),
  upload.array("images", 5), // max 5 images
  uploadRoomImages
);

export default router;
