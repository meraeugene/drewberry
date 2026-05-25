"use client";

import useSWR from "swr";
import { apiGet } from "@/lib/utils";
import type { Movie } from "@/types/movie";

export function useMovieSuggestions(id: string) {
  return useSWR<Movie[]>(
    id ? `/api/movies?suggestionsFor=${encodeURIComponent(id)}` : null,
    apiGet,
  );
}
