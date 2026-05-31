"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Play } from "lucide-react";
import type { Movie } from "@/types/movie";
import { useWatchlistStore } from "@/store/watchlistStore";
import { moviePath } from "@/lib/utils";
import { MovieMeta } from "./MovieMeta";

export function MovieCard({ movie }: { movie: Movie }) {
  const { add, remove, has } = useWatchlistStore();
  const saved = has(movie.id);

  return (
    <article className="poster-float-card group relative overflow-hidden rounded-[1.75rem] [--poster-radius:1.75rem] border border-white/70 bg-white/70 shadow-xl shadow-pink-400/10 backdrop-blur hover:shadow-pink-400/25 dark:border-white/10 dark:bg-white/10">
      <Link
        href={moviePath(movie.id, movie.title)}
        className="relative block aspect-[3/4] overflow-hidden"
      >
        <Image
          src={movie.poster_url}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, 240px"
          className="poster-float-media object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <button className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-full bg-white text-pink-600 shadow-lg">
          <Play className="h-5 w-5 fill-current" />
        </button>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-black text-pink-950 dark:text-white">
              {movie.title}
            </h3>
            <p className="mt-1 truncate text-xs text-pink-900/65 dark:text-pink-100/65">
              {movie.genre.join(" / ")}
            </p>
          </div>
          <button
            onClick={() => (saved ? remove(movie.id) : add(movie))}
            aria-label={saved ? "Remove from My List" : "Add to My List"}
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full bg-pink-100 text-pink-600 dark:bg-pink-400/20 dark:text-pink-100"
          >
            <Heart className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} />
          </button>
        </div>
        <div className="mt-3">
          <MovieMeta movie={movie} />
        </div>
      </div>
    </article>
  );
}
