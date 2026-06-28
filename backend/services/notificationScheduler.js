import cron from "node-cron";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Timetable from "../models/Timetable.js";
import { sendTelegramMessage } from "./telegramService.js";

const pad = (n) => String(n).padStart(2, "0");

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const minutesFromMidnight = (date) => date.getHours() * 60 + date.getMinutes();

const timeStringToMinutes = (time24) => {
  const [h, m] = time24.split(":").map(Number);
  return h * 60 + m;
};

const formatTime12h = (time24) => {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${pad(m)} ${period}`;
};

// Runs every minute: notify 10 minutes before a scheduled timetable activity starts.
export const checkTimetableReminders = async () => {
  const date = todayKey();
  const nowMinutes = minutesFromMidnight(new Date());

  const slots = await Timetable.find({ date, reminderSent: false }).populate(
    "userId",
    "telegramChatId notifyTimetable"
  );

  for (const slot of slots) {
    const user = slot.userId;
    if (!user || !user.telegramChatId || !user.notifyTimetable) continue;

    const slotMinutes = timeStringToMinutes(slot.startTime);
    const diff = slotMinutes - nowMinutes;

    // Fire once the activity is 10 minutes (or less, down to 0) away.
    if (diff <= 10 && diff >= 0) {
      const timeRange = slot.endTime
        ? `${formatTime12h(slot.startTime)} - ${formatTime12h(slot.endTime)}`
        : formatTime12h(slot.startTime);
      await sendTelegramMessage(
        user.telegramChatId,
        `⏰ <b>Reminder</b>\n${slot.activity} starts in ${diff} minutes.\nTime: ${timeRange}`
      );
      slot.reminderSent = true;
      await slot.save();
    }
  }
};

// Runs every hour: nudge with today's schedule + how many tasks are still pending.
export const checkTaskReminders = async () => {
  const date = todayKey();
  const oneHourAgo = new Date(Date.now() - 55 * 60 * 1000);

  const pendingTasks = await Task.find({ date, completed: false }).populate(
    "userId",
    "name telegramChatId notifyTaskReminder"
  );

  const byUser = new Map();
  for (const task of pendingTasks) {
    const user = task.userId;
    if (!user || !user.telegramChatId || !user.notifyTaskReminder) continue;
    if (task.lastReminderAt && task.lastReminderAt > oneHourAgo) continue;

    const key = user._id.toString();
    if (!byUser.has(key)) byUser.set(key, { user, tasks: [] });
    byUser.get(key).tasks.push(task);
  }

  for (const { user, tasks } of byUser.values()) {
    const slots = await Timetable.find({ userId: user._id, date }).sort({ startTime: 1 });
    const scheduleLines = slots.map((s) => `- ${s.activity}`).join("\n");

    const message =
      `🔔 Hello ${user.name}!\n` +
      `Today's Schedule\n` +
      (scheduleLines || "No activities scheduled.") +
      `\nYou have ${tasks.length} task${tasks.length === 1 ? "" : "s"} today.\n` +
      `Have a productive day! 🚀`;

    await sendTelegramMessage(user.telegramChatId, message);
    await Task.updateMany(
      { _id: { $in: tasks.map((t) => t._id) } },
      { $set: { lastReminderAt: new Date() } }
    );
  }
};

// Resets reminderSent flags at midnight so tomorrow's slots can notify again.
const resetDailyFlags = async () => {
  await Timetable.updateMany({}, { $set: { reminderSent: false } });
};

export const startScheduler = () => {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.log("TELEGRAM_BOT_TOKEN not set — Telegram reminders are disabled.");
    return;
  }

  // Every minute: timetable "10 minutes before" reminders.
  cron.schedule("* * * * *", () => {
    checkTimetableReminders().catch((e) => console.error("Timetable reminder error:", e.message));
  });

  // Every hour on the hour: pending task digest.
  cron.schedule("0 * * * *", () => {
    checkTaskReminders().catch((e) => console.error("Task reminder error:", e.message));
  });

  // Midnight: reset timetable reminder flags for the new day.
  cron.schedule("0 0 * * *", () => {
    resetDailyFlags().catch((e) => console.error("Reset flags error:", e.message));
  });

  console.log("Telegram reminder scheduler started.");
};
