import { create } from "zustand";

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

const stored = localStorage.getItem("flowdesk_theme") || "dark";
applyTheme(stored);

const useThemeStore = create((set, get) => ({
  theme: stored,
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem("flowdesk_theme", next);
    applyTheme(next);
    set({ theme: next });
  },
  setTheme: (theme) => {
    localStorage.setItem("flowdesk_theme", theme);
    applyTheme(theme);
    set({ theme });
  },
}));

export default useThemeStore;
