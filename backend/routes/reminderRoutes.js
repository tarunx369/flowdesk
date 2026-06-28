import express from "express";
import { checkTimetableReminders, checkTaskReminders } from "../services/notificationScheduler.js";

const router = express.Router();

router.get("/check", async (req, res) => {
  if (req.query.key !== process.env.CRON_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await checkTimetableReminders();
    await checkTaskReminders();
    res.json({ status: "ok", checkedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ message: "Reminder check failed", error: error.message });
  }
});

export default router;