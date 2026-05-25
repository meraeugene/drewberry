"use client";

import { create } from "zustand";
import type { Movie } from "@/types/movie";

type UIState = {
  sidebarOpen: boolean;
  activeCollection: string;
  selectedMovie: Movie | null;
  searchQuery: string;
  setSidebarOpen: (open: boolean) => void;
  setActiveCollection: (id: string) => void;
  setSelectedMovie: (movie: Movie | null) => void;
  setSearchQuery: (query: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activeCollection: "all",
  selectedMovie: null,
  searchQuery: "",
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setActiveCollection: (activeCollection) => set({ activeCollection }),
  setSelectedMovie: (selectedMovie) => set({ selectedMovie }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
