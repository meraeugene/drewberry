"use client";

import useSWR from "swr";
import { apiGet } from "@/lib/utils";
import type { Profile } from "@/types/user";

export function useProfile() {
  return useSWR<Profile>("/api/profile", apiGet);
}
