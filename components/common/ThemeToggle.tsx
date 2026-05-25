"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="grid h-11 w-11 place-items-center rounded-full border border-pink-200/70 bg-white/70 text-pink-700 shadow-sm backdrop-blur transition hover:scale-105 dark:border-white/10 dark:bg-white/10 dark:text-pink-100"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
