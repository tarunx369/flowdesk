import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, UserRound, Camera, Lock, Send, BellRing } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";
import useAuthStore from "../store/authStore.js";
import api from "../api/axios.js";

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [preview, setPreview] = useState(user?.profileImage || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  const [telegram, setTelegram] = useState({
    telegramChatId: user?.telegramChatId || "",
    notifyTimetable: user?.notifyTimetable ?? true,
    notifyTaskReminder: user?.notifyTaskReminder ?? true,
  });
  const [savingTelegram, setSavingTelegram] = useState(false);
  const [telegramMsg, setTelegramMsg] = useState("");
  const [testing, setTesting] = useState(false);

  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setProfileMsg("");
    setSavingProfile(true);
    try {
      const { data } = await api.put("/profile", { name, profileImage: preview });
      updateUser(data.user);
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordMsg("");
    setSavingPassword(true);
    try {
      await api.put("/profile/change-password", passwords);
      setPasswordMsg("Password changed successfully.");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const saveTelegram = async (e) => {
    e.preventDefault();
    setError("");
    setTelegramMsg("");
    setSavingTelegram(true);
    try {
      const { data } = await api.put("/profile", telegram);
      updateUser(data.user);
      setTelegramMsg("Reminder settings saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save reminder settings");
    } finally {
      setSavingTelegram(false);
    }
  };

  const sendTest = async () => {
    setError("");
    setTelegramMsg("");
    setTesting(true);
    try {
      const { data } = await api.post("/profile/test-telegram");
      setTelegramMsg(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send test message");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <TopBar />
        <main className="mx-auto max-w-2xl space-y-6 px-6 pb-16">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>

          <h1 className="font-display text-2xl font-bold text-slate-50">Profile &amp; Settings</h1>

          {error && (
            <div className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
              {error}
            </div>
          )}

          <motion.form
            onSubmit={saveProfile}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card space-y-5 p-6"
          >
            <h2 className="font-display text-base font-semibold text-slate-100">Account details</h2>

            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-white/5">
                {preview ? (
                  <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="m-auto h-full w-8 text-slate-500" />
                )}
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  <Camera className="h-5 w-5 text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{user?.email}</p>
                <p className="text-xs text-slate-500">Click the avatar to change your photo</p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Name</label>
              <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {profileMsg && <p className="text-sm text-mint">{profileMsg}</p>}

            <button type="submit" disabled={savingProfile} className="btn-primary">
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </motion.form>

          <motion.form
            onSubmit={saveTelegram}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card space-y-5 p-6"
          >
            <div>
              <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate-100">
                <Send className="h-4 w-4 text-violet-soft" /> Telegram Reminders
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Get a nudge on Telegram 10 minutes before a scheduled activity, and an hourly ping
                listing tasks you haven't checked off yet.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">
              <p className="mb-1 font-medium text-slate-300">How to connect:</p>
              <ol className="list-inside list-decimal space-y-1">
                <li>Open Telegram and search for your FlowDesk bot (ask whoever deployed it for the bot username).</li>
                <li>Send it any message, e.g. "hi" — this starts a chat with the bot.</li>
                <li>
                  Open{" "}
                  <code className="rounded bg-black/30 px-1">
                    https://api.telegram.org/bot&lt;TOKEN&gt;/getUpdates
                  </code>{" "}
                  in a browser (the server admin has the token) and copy your <code className="rounded bg-black/30 px-1">chat.id</code> value.
                </li>
                <li>Paste that Chat ID below and save.</li>
              </ol>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Telegram Chat ID</label>
              <input
                className="input-field"
                placeholder="e.g. 123456789"
                value={telegram.telegramChatId}
                onChange={(e) => setTelegram({ ...telegram, telegramChatId: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <BellRing className="h-4 w-4 text-violet-soft" /> Remind 10 min before timetable activities
                </span>
                <input
                  type="checkbox"
                  checked={telegram.notifyTimetable}
                  onChange={(e) => setTelegram({ ...telegram, notifyTimetable: e.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-transparent text-violet focus:ring-violet"
                />
              </label>
              <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm text-slate-300">
                  <BellRing className="h-4 w-4 text-violet-soft" /> Hourly reminder for pending tasks
                </span>
                <input
                  type="checkbox"
                  checked={telegram.notifyTaskReminder}
                  onChange={(e) => setTelegram({ ...telegram, notifyTaskReminder: e.target.checked })}
                  className="h-4 w-4 rounded border-white/20 bg-transparent text-violet focus:ring-violet"
                />
              </label>
            </div>

            {telegramMsg && <p className="text-sm text-mint">{telegramMsg}</p>}

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={savingTelegram} className="btn-primary">
                {savingTelegram ? "Saving..." : "Save Reminder Settings"}
              </button>
              <button type="button" onClick={sendTest} disabled={testing} className="btn-ghost">
                {testing ? "Sending..." : "Send Test Message"}
              </button>
            </div>
          </motion.form>

          <motion.form
            onSubmit={savePassword}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card space-y-5 p-6"
          >
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-slate-100">
              <Lock className="h-4 w-4 text-violet-soft" /> Change password
            </h2>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Current password</label>
              <input
                type="password"
                required
                className="input-field"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">New password</label>
              <input
                type="password"
                required
                minLength={6}
                className="input-field"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              />
            </div>

            {passwordMsg && <p className="text-sm text-mint">{passwordMsg}</p>}

            <button type="submit" disabled={savingPassword} className="btn-primary">
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </motion.form>
        </main>
      </div>
    </div>
  );
}
