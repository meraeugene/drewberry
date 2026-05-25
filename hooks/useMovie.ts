"use client";

import useSWR from "swr";
import { apiGet } from "@/lib/utils";
import type { Movie } from "@/types/movie";

export function useMovie(id: string) {
  return useSWR<Movie>(id ? `/api/movies?id=${id}` : null, apiGet);
}
