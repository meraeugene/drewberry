"use client";

import { Search } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useUIStore();

  return (
    <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-pink-200/70 bg-white/75 px-4 text-sm text-pink-900 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-pink-50">
      <Search className="h-4 w-4 shrink-0 text-pink-500" />
      <input
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search magical movies"
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-pink-400/80"
      />
    </label>
  );
}
