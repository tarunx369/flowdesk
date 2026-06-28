import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore.js";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return <SplashLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return <SplashLoader />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function SplashLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet border-t-transparent" />
    </div>
  );
}

export default function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
