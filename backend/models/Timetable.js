import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // "06:00 AM"
    endTime: { type: String, default: "" },
    activity: { type: String, required: true, trim: true },
    color: { type: String, default: "#7C5CFC" },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

timetableSchema.index({ userId: 1, date: 1 });

export default mongoose.model("Timetable", timetableSchema);
