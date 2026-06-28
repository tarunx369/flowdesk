import Task from "../models/Task.js";

// GET /api/tasks?date=YYYY-MM-DD
export const getTasks = async (req, res) => {
  try {
    const { date, search } = req.query;
    const filter = { userId: req.user._id };
    if (date) filter.date = date;
    if (search) filter.title = { $regex: search, $options: "i" };

    const tasks = await Task.find(filter).sort({ pinned: -1, createdAt: 1 });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch tasks", error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { date, title, description, priority } = req.body;
    if (!date || !title) {
      return res.status(400).json({ message: "Date and title are required" });
    }
    const task = await Task.create({
      userId: req.user._id,
      date,
      title,
      description,
      priority,
    });
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Could not create task", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { title, description, priority, completed, pinned } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (completed !== undefined) task.completed = completed;
    if (pinned !== undefined) task.pinned = pinned;

    await task.save();
    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: "Could not update task", error: error.message });
  }
};

export const getUpcoming = async (req, res) => {
  try {
    const pad = (n) => String(n).padStart(2, "0");
    const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const days = [];
    for (let i = 0; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(toKey(d));
    }
    const tasks = await Task.find({
      userId: req.user._id,
      date: { $in: days },
      completed: false,
    })
      .sort({ date: 1 })
      .limit(6);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Could not load upcoming tasks", error: error.message });
  }
};
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete task", error: error.message });
  }
};

// GET /api/tasks/stats/weekly - completion % for the last 7 days + current streak
export const getWeeklyStats = async (req, res) => {
  try {
    const pad = (n) => String(n).padStart(2, "0");
    const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(toKey(d));
    }

    const tasks = await Task.find({
      userId: req.user._id,
      date: { $in: days },
    });

    const byDate = {};
    days.forEach((d) => (byDate[d] = { total: 0, completed: 0 }));
    tasks.forEach((t) => {
      byDate[t.date].total += 1;
      if (t.completed) byDate[t.date].completed += 1;
    });

    const series = days.map((d) => ({
      date: d,
      label: new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" }),
      percent: byDate[d].total === 0 ? 0 : Math.round((byDate[d].completed / byDate[d].total) * 100),
      total: byDate[d].total,
      completed: byDate[d].completed,
    }));

    // Streak: consecutive days (ending today) where every task was completed and at least 1 task existed
    let streak = 0;
    for (let i = series.length - 1; i >= 0; i--) {
      const day = series[i];
      if (day.total > 0 && day.completed === day.total) {
        streak += 1;
      } else {
        break;
      }
    }

    res.json({ series, streak });
  } catch (error) {
    res.status(500).json({ message: "Could not load stats", error: error.message });
  }
};
