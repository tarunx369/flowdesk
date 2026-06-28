import User from "../models/User.js";
import crypto from "crypto";
import { generateToken, setTokenCookie } from "../utils/generateToken.js";

// @desc Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    setTokenCookie(res, token, true);

    res.status(201).json({ user: user.toSafeObject(), token });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// @desc Login user
export const login = async (req, res) => {
  try {
    const { email, password, stayLoggedIn } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token, stayLoggedIn !== false);

    res.json({ user: user.toSafeObject(), token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// @desc Logout user
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// @desc Get current logged-in user
export const getMe = async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
};

// @desc Forgot password - generates a reset token (for demo: returned in response)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "No account found with that email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // In production, email this link to the user instead of returning it.
    res.json({
      message: "Password reset token generated. Use it within 15 minutes.",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not process request", error: error.message });
  }
};

// @desc Reset password using token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset token is invalid or has expired" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. Please log in." });
  } catch (error) {
    res.status(500).json({ message: "Could not reset password", error: error.message });
  }
};
