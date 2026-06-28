import express from "express";
import { updateProfile, changePassword, testTelegram } from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.put("/", updateProfile);
router.put("/change-password", changePassword);
router.post("/test-telegram", testTelegram);

export default router;
