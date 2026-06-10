import { create } from "zustand";
import type { Category } from "~/lib/data/content";

interface FilterState {
  search: string;
  activeTab: string;
  selectedCategories: Category[];
  maxDuration: number;
  appliedDuration: number;
  page: number;

  setSearch: (search: string) => void;
  setActiveTab: (tab: string) => void;
  toggleCategory: (category: Category) => void;
  setMaxDuration: (n: number) => void;
  applyDuration: () => void;
  setPage: (page: number) => void;
  reset: () => void;
}

const NAV_TABS = ["All", "Videos", "Music", "Shorts", "Podcasts", "Tutorials"] as const;

export { NAV_TABS };

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  activeTab: "All",
  selectedCategories: [],
  maxDuration: 60,
  appliedDuration: 60,
  page: 1,

  setSearch: (search) => set({ search, page: 1 }),
  setActiveTab: (tab) => set({ activeTab: tab, page: 1 }),
  toggleCategory: (category) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category],
      page: 1,
    })),
  setMaxDuration: (n) => set({ maxDuration: n }),
  applyDuration: () =>
    set((state) => ({ appliedDuration: state.maxDuration, page: 1 })),
  setPage: (page) => set({ page }),
  reset: () =>
    set({
      selectedCategories: [],
      maxDuration: 60,
      appliedDuration: 60,
      page: 1,
    }),
}));
