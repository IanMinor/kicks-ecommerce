import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  login: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },
  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
  initialize: () => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    try {
      set({ user: JSON.parse(stored) });
    } catch {
      localStorage.removeItem("user");
      set({ user: null });
    }
  },
}));
