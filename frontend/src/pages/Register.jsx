import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import useAuthStore from "../store/authStore.js";

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up your planner in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-violet-soft hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Name</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              required
              className="input-field pl-9"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              required
              className="input-field pl-9"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="password"
              required
              minLength={6}
              className="input-field pl-9"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
}
