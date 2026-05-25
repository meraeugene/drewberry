"use client";

import useSWR from "swr";
import { apiGet } from "@/lib/utils";
import type { Movie } from "@/types/movie";

export function useWatchlist() {
  return useSWR<Movie[]>("/api/watchlist", apiGet);
}
