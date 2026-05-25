"use client";

import { create } from "zustand";
import type { Profile } from "@/types/user";

type UserState = {
  profile: Profile | null;
  isAuthenticated: boolean;
  setProfile: (profile: Profile | null) => void;
};

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isAuthenticated: false,
  setProfile: (profile) => set({ profile, isAuthenticated: Boolean(profile) }),
}));
