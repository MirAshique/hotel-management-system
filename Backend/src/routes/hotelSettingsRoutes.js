import express from "express";
import {
  getHotelSettings,
  updateHotelSettings,
} from "../controllers/hotelSettingsController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getHotelSettings);
router.put("/", protect, authorizeRoles("admin"), updateHotelSettings);

export default router;
