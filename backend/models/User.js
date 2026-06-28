import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    telegramChatId: { type: String, default: "" },
    notifyTimetable: { type: Boolean, default: true },
    notifyTaskReminder: { type: Boolean, default: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    profileImage: this.profileImage,
    theme: this.theme,
    telegramChatId: this.telegramChatId,
    notifyTimetable: this.notifyTimetable,
    notifyTaskReminder: this.notifyTaskReminder,
    createdAt: this.createdAt,
  };
};

export default mongoose.model("User", userSchema);
