"use client";

import useSWR from "swr";
import { apiGet } from "@/lib/utils";
import type { Collection } from "@/types/collection";

export function useCollections() {
  return useSWR<Collection[]>("/api/collections", apiGet);
}
