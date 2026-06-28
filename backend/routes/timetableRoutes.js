import express from "express";
import {
  getTimetable,
  createSlot,
  updateSlot,
  deleteSlot,
  getUpcomingSlots,
} from "../controllers/timetableController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/upcoming", getUpcomingSlots);
router.get("/", getTimetable);
router.post("/", createSlot);
router.put("/:id", updateSlot);
router.delete("/:id", deleteSlot);

export default router;
