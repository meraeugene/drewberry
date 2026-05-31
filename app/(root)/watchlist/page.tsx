"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import type { Movie } from "@/types/movie";
import { moviePath } from "@/lib/utils";
import { useWatchlistStore } from "@/store/watchlistStore";

function WatchlistPoster({ movie }: { movie: Movie }) {
  return (
    <Link
      href={moviePath(movie.id, movie.title)}
      className="poster-float-card relative aspect-[2/3] w-full cursor-pointer overflow-hidden rounded-[7px] bg-[#240414] shadow-[0_18px_38px_rgba(0,0,0,0.32)]"
      aria-label={movie.title}
    >
      <Image
        src={movie.poster_url}
        alt={movie.title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
        className="poster-float-media object-cover"
      />
    </Link>
  );
}

export default function WatchlistPage() {
  const movies = useWatchlistStore((state) => state.movies);

  return (
    <main className="min-h-screen bg-[#07020b] px-4 pb-14 pt-28 text-white sm:px-6 sm:pt-32 lg:px-9">
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-script text-[34px] font-semibold leading-none text-[#ff75bd] sm:text-[46px]">
              My Watchlist
            </p>
          </div>
          <div className="flex h-11 items-center gap-2 rounded-[7px] bg-white/10 px-4 text-sm font-semibold text-pink-100 ring-1 ring-white/12">
            <Heart className="h-4 w-4 fill-current text-[#ff75bd]" />
            {movies.length} saved
          </div>
        </div>

        {movies.length ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie) => (
              <WatchlistPoster key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid min-h-[360px] place-items-center rounded-[7px] border border-white/10 bg-white/[0.04] px-6 text-center">
            <div className="max-w-md">
              <Search className="mx-auto h-10 w-10 text-[#ff75bd]" />
              <h2 className="mt-4 text-2xl font-semibold">
                No saved movies yet
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Tap the heart on any movie card or movie page to save it here on
                this browser.
              </p>
              <Link
                href="/home"
                className="mt-6 inline-flex h-11 items-center rounded-[7px] bg-[#ee3e9f] px-5 text-sm font-semibold text-white transition hover:bg-[#c81979]"
              >
                Browse movies
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
