import { create } from "zustand";
import api from "../api/axios.js";
import { toDateKey } from "../utils/date.js";

const usePlannerStore = create((set, get) => ({
  selectedDate: toDateKey(new Date()),
  tasks: [],
  slots: [],
  loading: false,
  searchTerm: "",

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchAll(date);
  },

  fetchAll: async (date) => {
    const d = date || get().selectedDate;
    set({ loading: true });
    try {
      const [tasksRes, slotsRes] = await Promise.all([
        api.get("/tasks", { params: { date: d } }),
        api.get("/timetable", { params: { date: d } }),
      ]);
      set({ tasks: tasksRes.data.tasks, slots: slotsRes.data.slots, loading: false });
    } catch (e) {
      set({ loading: false });
    }
  },

  // Tasks
  addTask: async (task) => {
    const { data } = await api.post("/tasks", { ...task, date: get().selectedDate });
    set({ tasks: [...get().tasks, data.task] });
  },
  updateTask: async (id, updates) => {
    const { data } = await api.put(`/tasks/${id}`, updates);
    set({ tasks: get().tasks.map((t) => (t._id === id ? data.task : t)) });
  },
  toggleTask: async (id) => {
    const task = get().tasks.find((t) => t._id === id);
    if (!task) return;
    await get().updateTask(id, { completed: !task.completed });
  },
  togglePin: async (id) => {
    const task = get().tasks.find((t) => t._id === id);
    if (!task) return;
    await get().updateTask(id, { pinned: !task.pinned });
  },
  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    set({ tasks: get().tasks.filter((t) => t._id !== id) });
  },

  // Timetable
  addSlot: async (slot) => {
    const { data } = await api.post("/timetable", { ...slot, date: get().selectedDate });
    set({ slots: [...get().slots, data.slot].sort((a, b) => a.startTime.localeCompare(b.startTime)) });
  },
  updateSlot: async (id, updates) => {
    const { data } = await api.put(`/timetable/${id}`, updates);
    set({ slots: get().slots.map((s) => (s._id === id ? data.slot : s)) });
  },
  deleteSlot: async (id) => {
    await api.delete(`/timetable/${id}`);
    set({ slots: get().slots.filter((s) => s._id !== id) });
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
}));

export default usePlannerStore;
