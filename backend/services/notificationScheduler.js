import cron from "node-cron";
import Task from "../models/Task.js";
import Timetable from "../models/Timetable.js";
import { sendTelegramMessage } from "./telegramService.js";

const pad = (n) => String(n).padStart(2, "0");

// Get current IST time
const getISTDate = () => {
  const now = new Date();
  return new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );
};

const todayKey = () => {
  const d = getISTDate();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const minutesFromMidnight = (date) => {
  return date.getHours() * 60 + date.getMinutes();
};

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

// ================= TIMETABLE REMINDERS =================

export const checkTimetableReminders = async () => {
  const date = todayKey();
  const now = getISTDate();
  const nowMinutes = minutesFromMidnight(now);

  const slots = await Timetable.find({
    date,
    reminderSent: false,
  }).populate("userId", "telegramChatId notifyTimetable");

  for (const slot of slots) {
    const user = slot.userId;

    if (!user) continue;
    if (!user.telegramChatId) continue;
    if (!user.notifyTimetable) continue;

    const slotMinutes = timeStringToMinutes(slot.startTime);

    const diff = slotMinutes - nowMinutes;

    // Send only between 10 minutes and 0 minutes before class
    if (diff >= 0 && diff <= 10) {
      const timeRange = slot.endTime
        ? `${formatTime12h(slot.startTime)} - ${formatTime12h(slot.endTime)}`
        : formatTime12h(slot.startTime);

      await sendTelegramMessage(
        user.telegramChatId,
        `⏰ <b>Reminder</b>\n\n` +
          `${slot.activity} starts in <b>${diff}</b> minute${
            diff === 1 ? "" : "s"
          }.\n\n` +
          `🕒 ${timeRange}`
      );

      slot.reminderSent = true;
      await slot.save();

      console.log(
        `Reminder sent for ${slot.activity} (${slot.startTime}) to ${user.telegramChatId}`
      );
    }
  }
};

// ================= TASK REMINDERS =================

export const checkTaskReminders = async () => {
  const date = todayKey();

  const oneHourAgo = new Date(Date.now() - 55 * 60 * 1000);

  const pendingTasks = await Task.find({
    date,
    completed: false,
  }).populate("userId", "name telegramChatId notifyTaskReminder");

  const grouped = new Map();

  for (const task of pendingTasks) {
    const user = task.userId;

    if (!user) continue;
    if (!user.telegramChatId) continue;
    if (!user.notifyTaskReminder) continue;

    if (task.lastReminderAt && task.lastReminderAt > oneHourAgo) continue;

    const id = user._id.toString();

    if (!grouped.has(id)) {
      grouped.set(id, {
        user,
        tasks: [],
      });
    }

    grouped.get(id).tasks.push(task);
  }

  for (const { user, tasks } of grouped.values()) {
    const slots = await Timetable.find({
      userId: user._id,
      date,
    }).sort({
      startTime: 1,
    });

    const schedule =
      slots.length === 0
        ? "No activities scheduled."
        : slots.map((s) => `• ${s.activity}`).join("\n");

    const message =
      `📋 <b>FlowDesk Reminder</b>\n\n` +
      `Hello ${user.name} 👋\n\n` +
      `Today's Schedule:\n${schedule}\n\n` +
      `Pending Tasks: <b>${tasks.length}</b>\n\n` +
      `Stay productive! 🚀`;

    await sendTelegramMessage(user.telegramChatId, message);

    await Task.updateMany(
      {
        _id: {
          $in: tasks.map((t) => t._id),
        },
      },
      {
        $set: {
          lastReminderAt: new Date(),
        },
      }
    );
  }
};

// ================= RESET =================

const resetDailyFlags = async () => {
  await Timetable.updateMany({}, { $set: { reminderSent: false } });
};

// ================= CRON =================

export const startScheduler = () => {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.log("Telegram reminders disabled.");
    return;
  }

  cron.schedule("* * * * *", () => {
    checkTimetableReminders().catch(console.error);
  });

  cron.schedule("0 * * * *", () => {
    checkTaskReminders().catch(console.error);
  });

  cron.schedule("0 0 * * *", () => {
    resetDailyFlags().catch(console.error);
  });

  console.log("Telegram reminder scheduler started.");
};
