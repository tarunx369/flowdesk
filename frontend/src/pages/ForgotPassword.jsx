import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import api from "../api/axios.js";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setToken(data.resetToken || "");
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Could not process request");
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", { token, newPassword });
      setMessage(data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll help you get back in."
      footer={
        <Link to="/login" className="font-medium text-violet-soft hover:underline">
          Back to login
        </Link>
      }
    >
      {error && (
        <div className="mb-4 rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
          {error}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={requestReset} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                className="input-field pl-9"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Sending..." : "Send Reset Token"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submitReset} className="space-y-4">
          {message && <p className="text-sm text-mint">{message}</p>}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Reset Token</label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                className="input-field pl-9"
                placeholder="Paste your reset token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input-field"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-4 text-center">
          <p className="text-sm text-mint">{message}</p>
          <Link to="/login" className="btn-primary w-full">
            Go to Login
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
