import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    completed: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    lastReminderAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

taskSchema.index({ userId: 1, date: 1 });

export default mongoose.model("Task", taskSchema);
