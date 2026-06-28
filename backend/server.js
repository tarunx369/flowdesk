import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { startScheduler } from "./services/notificationScheduler.js";
import reminderRoutes from "./routes/reminderRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use("/api/reminders", reminderRoutes);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "FlowDesk API" }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/profile", profileRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FlowDesk API running on port ${PORT}`);
  startScheduler();
});
