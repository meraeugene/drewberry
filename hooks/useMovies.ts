"use client";

import useSWR from "swr";
import { apiGet } from "@/lib/utils";
import type { Movie } from "@/types/movie";

export function useMovies(query = "") {
  const key = query ? `/api/movies?q=${encodeURIComponent(query)}` : "/api/movies";
  return useSWR<Movie[]>(key, apiGet);
}
