import User from "../models/User.js";
import { sendTelegramMessage } from "../services/telegramService.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, profileImage, theme, telegramChatId, notifyTimetable, notifyTaskReminder } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (theme) user.theme = theme;
    if (telegramChatId !== undefined) user.telegramChatId = telegramChatId.trim();
    if (notifyTimetable !== undefined) user.notifyTimetable = notifyTimetable;
    if (notifyTaskReminder !== undefined) user.notifyTaskReminder = notifyTaskReminder;

    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (error) {
    res.status(500).json({ message: "Could not update profile", error: error.message });
  }
};

export const testTelegram = async (req, res) => {
  try {
    const user = req.user;
    if (!user.telegramChatId) {
      return res.status(400).json({ message: "Add your Telegram Chat ID first" });
    }
    const result = await sendTelegramMessage(
      user.telegramChatId,
      `👋 Hi ${user.name}, FlowDesk reminders are connected! You'll get a nudge 10 minutes before scheduled activities and hourly pings for pending tasks.`
    );
    if (result?.skipped) {
      return res.status(400).json({ message: "Telegram bot is not configured on the server" });
    }
    if (result?.ok === false) {
      return res.status(400).json({ message: result.description || "Could not reach Telegram. Check your Chat ID." });
    }
    res.json({ message: "Test message sent — check Telegram!" });
  } catch (error) {
    res.status(500).json({ message: "Could not send test message", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not change password", error: error.message });
  }
};
