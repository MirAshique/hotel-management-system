import express from "express";
import { getAdminAnalytics } from "../controllers/analyticsController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getAdminAnalytics);

export default router;
