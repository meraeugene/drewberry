"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUIStore } from "@/store/uiStore";
import type { Movie } from "@/types/movie";
import { moviePath } from "@/lib/utils";

export function SearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const { searchQuery, setSearchQuery } = useUIStore();
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trimmedQuery = useMemo(() => searchQuery.trim(), [searchQuery]);
  const visibleSuggestions = trimmedQuery.length >= 2 ? suggestions : [];

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);

    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (trimmedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/movies?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error("Search request failed");

        const movies = (await response.json()) as Movie[];
        setSuggestions(movies.slice(0, 6));
        setOpen(true);
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  return (
    <div ref={wrapperRef} className="relative">
      <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 text-sm text-pink-50 shadow-sm backdrop-blur">
        <Search className="h-4 w-4 shrink-0 text-pink-300" />
        <input
          value={searchQuery}
          onChange={(event) => {
            const nextQuery = event.target.value;

            setSearchQuery(nextQuery);
            setIsLoading(nextQuery.trim().length >= 2);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search magical movies"
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-pink-200/62"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSuggestions([]);
              setOpen(false);
              setIsLoading(false);
            }}
            aria-label="Clear search"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-pink-100/70 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </label>

      {open && trimmedQuery.length >= 2 ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-full min-w-[280px] overflow-hidden rounded-[7px] border border-white/10 bg-[#17030d]/96 shadow-[0_22px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-pink-100/70">Searching...</div>
          ) : visibleSuggestions.length ? (
            <div className="max-h-[420px] overflow-y-auto py-1">
              {visibleSuggestions.map((movie) => (
                <Link
                  key={movie.id}
                  href={moviePath(movie.id, movie.title)}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="flex min-h-[76px] items-center gap-3 px-3 py-2 transition hover:bg-white/10"
                >
                  <span className="relative h-[58px] w-[42px] shrink-0 overflow-hidden rounded-[5px] bg-[#240414]">
                    <Image
                      src={movie.poster_url}
                      alt=""
                      fill
                      sizes="42px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white">
                      {movie.title}
                    </span>
                    <span className="mt-1 block truncate text-xs text-pink-100/62">
                      {[movie.year || "TBA", ...movie.genre.slice(0, 2)].join(
                        " / ",
                      )}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-pink-100/70">
              No movies found
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
