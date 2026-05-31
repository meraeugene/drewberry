"use client";

import { Heart } from "lucide-react";
import { useEffect } from "react";
import { useWatchlistStore } from "@/store/watchlistStore";

export function WatchlistToast() {
  const toast = useWatchlistStore((state) => state.toast);
  const clearToast = useWatchlistStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(clearToast, 2400);

    return () => window.clearTimeout(timer);
  }, [clearToast, toast]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex max-w-[calc(100vw-40px)] items-center gap-3 rounded-[7px] border border-pink-300/20 bg-[#1a0310]/95 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ee3e9f]/18 text-[#ff75bd]">
        <Heart className="h-4 w-4 fill-current" />
      </span>
      <span className="min-w-0 truncate">{toast.message}</span>
    </div>
  );
}
