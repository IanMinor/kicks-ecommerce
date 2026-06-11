import { create } from "zustand";

export const useFilterStore = create((set) => ({
  filters: {
    minPrice: 0,
    gender: [],
    size: [],
    color: [],
    category: [],
  },

  updateFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  toggleFilterValue: (key, value) =>
    set((state) => {
      const values = state.filters[key];
      const newValues = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];
      return {
        filters: {
          ...state.filters,
          [key]: newValues,
        },
      };
    }),

  resetFilters: () =>
    set(() => ({
      filters: {
        minPrice: 0,
        gender: [],
        size: [],
        color: [],
        category: [],
      },
    })),

  setMultipleFilters: (newFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    })),
}));
