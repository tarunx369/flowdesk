import Timetable from "../models/Timetable.js";

// GET /api/timetable?date=YYYY-MM-DD
export const getTimetable = async (req, res) => {
  try {
    const { date } = req.query;
    const filter = { userId: req.user._id };
    if (date) filter.date = date;

    const slots = await Timetable.find(filter).sort({ startTime: 1 });
    res.json({ slots });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch timetable", error: error.message });
  }
};

export const createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, activity, color } = req.body;
    if (!date || !startTime || !activity) {
      return res.status(400).json({ message: "Date, start time and activity are required" });
    }
    const slot = await Timetable.create({
      userId: req.user._id,
      date,
      startTime,
      endTime,
      activity,
      color,
    });
    res.status(201).json({ slot });
  } catch (error) {
    res.status(500).json({ message: "Could not create slot", error: error.message });
  }
};

export const updateSlot = async (req, res) => {
  try {
    const slot = await Timetable.findOne({ _id: req.params.id, userId: req.user._id });
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    const { startTime, endTime, activity, color } = req.body;
    if (startTime !== undefined) slot.startTime = startTime;
    if (endTime !== undefined) slot.endTime = endTime;
    if (activity !== undefined) slot.activity = activity;
    if (color !== undefined) slot.color = color;

    await slot.save();
    res.json({ slot });
  } catch (error) {
    res.status(500).json({ message: "Could not update slot", error: error.message });
  }
};

export const deleteSlot = async (req, res) => {
  try {
    const slot = await Timetable.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    res.json({ message: "Slot deleted" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete slot", error: error.message });
  }
};

export const getUpcomingSlots = async (req, res) => {
  try {
    const pad = (n) => String(n).padStart(2, "0");
    const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const days = [];
    for (let i = 0; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(toKey(d));
    }
    const slots = await Timetable.find({ userId: req.user._id, date: { $in: days } })
      .sort({ date: 1, startTime: 1 })
      .limit(6);
    res.json({ slots });
  } catch (error) {
    res.status(500).json({ message: "Could not load upcoming schedule", error: error.message });
  }
};
