"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Play, Sparkles } from "lucide-react";
import type { Movie } from "@/types/movie";
import { useWatchlistStore } from "@/store/watchlistStore";
import { moviePath } from "@/lib/utils";
import { MovieMeta } from "./MovieMeta";

export function MovieHero({ movie }: { movie: Movie }) {
  const { add, remove, has } = useWatchlistStore();
  const saved = has(movie.id);

  return (
    <section className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-white/60 shadow-2xl shadow-pink-500/20 dark:border-white/10">
      <Image src={movie.banner_url} alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-pink-50 via-pink-50/80 to-transparent dark:from-[#11051d] dark:via-[#11051d]/85" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,105,180,0.3),transparent_35%)]" />
      <div className="relative z-10 flex min-h-[560px] max-w-2xl flex-col justify-end p-6 sm:p-10">
        <span className="mb-4 flex w-fit items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-pink-600 shadow-sm backdrop-blur dark:bg-white/10 dark:text-pink-100">
          <Sparkles className="h-4 w-4" />
          Featured dream premiere
        </span>
        <h1 className="text-5xl font-black leading-none text-pink-950 dark:text-white sm:text-7xl">
          {movie.title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-pink-950/75 dark:text-pink-100/80">
          {movie.description}
        </p>
        <div className="mt-5">
          <MovieMeta movie={movie} />
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={moviePath(movie.id, movie.title)} className="flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 px-6 font-bold text-white shadow-lg shadow-pink-500/30">
            <Play className="h-5 w-5 fill-current" />
            Watch now
          </Link>
          <button
            onClick={() => (saved ? remove(movie.id) : add(movie.id))}
            className="flex h-12 items-center gap-2 rounded-full border border-pink-200 bg-white/75 px-6 font-bold text-pink-700 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-pink-100"
          >
            <Heart className={saved ? "h-5 w-5 fill-current" : "h-5 w-5"} />
            {saved ? "Saved" : "My List"}
          </button>
        </div>
      </div>
    </section>
  );
}
