import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import useAuthStore from "../store/authStore.js";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: "", password: "", stayLoggedIn: true });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
      footer={
        <>
          New to FlowDesk?{" "}
          <Link to="/register" className="font-medium text-violet-soft hover:underline">
            Create an account
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
              type={showPassword ? "text" : "password"}
              required
              className="input-field pl-9 pr-9"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-400">
            <input
              type="checkbox"
              checked={form.stayLoggedIn}
              onChange={(e) => setForm({ ...form, stayLoggedIn: e.target.checked })}
              className="rounded border-white/20 bg-transparent text-violet focus:ring-violet"
            />
            Stay logged in
          </label>
          <Link to="/forgot-password" className="text-violet-soft hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </AuthLayout>
  );
}
