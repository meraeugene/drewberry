"use client";

import { create } from "zustand";

type WatchlistState = {
  movieIds: string[];
  setMovieIds: (movieIds: string[]) => void;
  add: (movieId: string) => void;
  remove: (movieId: string) => void;
  has: (movieId: string) => boolean;
};

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  movieIds: [],
  setMovieIds: (movieIds) => set({ movieIds }),
  add: (movieId) =>
    set((state) => ({
      movieIds: state.movieIds.includes(movieId)
        ? state.movieIds
        : [...state.movieIds, movieId],
    })),
  remove: (movieId) =>
    set((state) => ({ movieIds: state.movieIds.filter((id) => id !== movieId) })),
  has: (movieId) => get().movieIds.includes(movieId),
}));
