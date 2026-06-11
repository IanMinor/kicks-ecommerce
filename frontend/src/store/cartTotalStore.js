import { create } from "zustand";

export const useCartTotalStore = create((set) => ({
  totalItems: 0,
  setTotalItems: (total) => set({ totalItems: total }),
}));
