import { create } from "zustand";
import api from "../api/axios.js";

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  init: async () => {
    try {
      const token = localStorage.getItem("flowdesk_token");
      if (!token) {
        set({ loading: false });
        return;
      }
      const { data } = await api.get("/auth/me");
      set({ user: data.user, loading: false });
    } catch {
      localStorage.removeItem("flowdesk_token");
      set({ user: null, loading: false });
    }
  },

  register: async ({ name, email, password }) => {
    set({ error: null });
    const { data } = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("flowdesk_token", data.token);
    set({ user: data.user });
    return data.user;
  },

  login: async ({ email, password, stayLoggedIn }) => {
    set({ error: null });
    const { data } = await api.post("/auth/login", { email, password, stayLoggedIn });
    localStorage.setItem("flowdesk_token", data.token);
    set({ user: data.user });
    return data.user;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore */
    }
    localStorage.removeItem("flowdesk_token");
    set({ user: null });
  },

  updateUser: (user) => set({ user }),
}));

export default useAuthStore;
