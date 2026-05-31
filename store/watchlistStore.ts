"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Movie } from "@/types/movie";

type WatchlistState = {
  movieIds: string[];
  movies: Movie[];
  toast: { id: number; message: string } | null;
  clearToast: () => void;
  setMovieIds: (movieIds: string[]) => void;
  add: (movie: Movie | string) => void;
  remove: (movieId: string) => void;
  has: (movieId: string) => boolean;
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      movieIds: [],
      movies: [],
      toast: null,
      clearToast: () => set({ toast: null }),
      setMovieIds: (movieIds) => set({ movieIds }),
      add: (movie) =>
        set((state) => {
          const movieId = typeof movie === "string" ? movie : movie.id;
          const alreadySaved = state.movieIds.includes(movieId);
          const title = typeof movie === "string" ? "Movie" : movie.title;

          return {
            movieIds: alreadySaved
              ? state.movieIds
              : [...state.movieIds, movieId],
            movies:
              typeof movie === "string" ||
              state.movies.some((item) => item.id === movie.id)
                ? state.movies
                : [...state.movies, movie],
            toast: alreadySaved
              ? state.toast
              : { id: Date.now(), message: `${title} added to Watchlist` },
          };
        }),
      remove: (movieId) =>
        set((state) => {
          const removedMovie = state.movies.find((movie) => movie.id === movieId);

          return {
            movieIds: state.movieIds.filter((id) => id !== movieId),
            movies: state.movies.filter((movie) => movie.id !== movieId),
            toast: state.movieIds.includes(movieId)
              ? {
                  id: Date.now(),
                  message: `${removedMovie?.title ?? "Movie"} removed from Watchlist`,
                }
              : state.toast,
          };
        }),
      has: (movieId) => get().movieIds.includes(movieId),
    }),
    {
      name: "drewberry-watchlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        movieIds: state.movieIds,
        movies: state.movies,
      }),
    },
  ),
);
