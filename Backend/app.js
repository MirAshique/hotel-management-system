import express from "express";
import cors from "cors";
import notFound from "./src/middleware/notFoundMiddleware.js";
import errorHandler from "./src/middleware/errorMiddleware.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import roomRoutes from "./src/routes/roomRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import hotelSettingsRoutes from "./src/routes/hotelSettingsRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import adminAuthRoutes from "./src/routes/adminAuthRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/settings", hotelSettingsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminAuthRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Hotel Management API is running");
});

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

export default app;
