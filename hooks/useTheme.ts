"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

export function useTheme() {
  const store = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", store.theme === "dark");
  }, [store.theme]);

  return store;
}
