"use client";

import { ArrowLeft, Film, Play, Sparkles, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type IframeHTMLAttributes, useState } from "react";
import { MediaCarousel } from "@/components/common/MediaCarousel";
import { ErrorState } from "@/components/common/ErrorState";
import { MovieDetailsLoadingSkeleton } from "@/components/skeletons/MovieDetailsLoadingSkeleton";
import { useMovie } from "@/hooks/useMovie";
import { useMovieSuggestions } from "@/hooks/useMovieSuggestions";
import { cn, moviePath } from "@/lib/utils";

function formatDuration(minutes: number) {
  if (!minutes) return "Runtime TBA";

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (!hours) return `${remaining}m`;

  return `${hours}h ${remaining}m`;
}

function releaseDate(year: number) {
  if (!year) return "TBA";

  return String(year);
}

function playerUrl(id: string) {
  const match = /^(movie|tv)-(\d+)$/.exec(id);

  if (match) {
    return `https://player.videasy.net/${match[1]}/${match[2]}?overlay=true&color=EC4899`;
  }

  return `https://player.videasy.net/movie/${id}?overlay=true&color=EC4899`;
}

const fullscreenIframeProps: IframeHTMLAttributes<HTMLIFrameElement> & {
  webkitallowfullscreen: string;
  mozallowfullscreen: string;
} = {
  allow: "autoplay; fullscreen; encrypted-media; picture-in-picture",
  allowFullScreen: true,
  webkitallowfullscreen: "true",
  mozallowfullscreen: "true",
};

function PlayerFrame({
  src,
  title,
  className,
}: {
  src: string;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden bg-black",
        className,
      )}
    >
      <iframe
        src={src}
        title={title}
        {...fullscreenIframeProps}
        className="movie-player-frame absolute inset-0 h-full w-full"
      />
    </div>
  );
}

export default function MovieDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const movie = useMovie(params.id);
  const suggestions = useMovieSuggestions(params.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  if (movie.isLoading || suggestions.isLoading)
    return <MovieDetailsLoadingSkeleton />;

  if (movie.error || !movie.data) {
    return (
      <main className="min-h-screen bg-[#07020b] px-6 pt-28 text-white">
        <ErrorState message="Movie not found." />
      </main>
    );
  }

  const currentMovie = movie.data;
  const suggestedMovies = (suggestions.data ?? []).slice(0, 5);
  const watchUrl =
    /^(movie|tv)-\d+$/.test(currentMovie.id) || /^\d+$/.test(currentMovie.id)
      ? playerUrl(currentMovie.id)
      : currentMovie.trailer_url;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07020b] text-white">
      <Image
        src={currentMovie.banner_url}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#07020b_0%,rgba(7,2,11,0.96)_24%,rgba(20,6,34,0.62)_54%,rgba(7,2,11,0.06)_100%),linear-gradient(180deg,rgba(7,2,11,0.16)_0%,rgba(7,2,11,0.5)_58%,#07020b_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(236,72,153,0.36),transparent_24%)]" />

      <div className="relative z-10">
        <section className="px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-32 lg:px-9 lg:pb-12">
          <div className="">
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-5 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-black/36 text-white shadow-[0_10px_24px_rgba(0,0,0,0.28)] ring-1 ring-white/12 backdrop-blur-md transition hover:bg-[#ee3e9f] hover:text-white hover:ring-[#ff75bd]/60"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <p className="font-script text-[34px] font-semibold tracking-wide text-[#ff75bd] sm:text-[44px]">
              Featured
              <Sparkles className="ml-3 inline h-5 w-5 align-middle text-[#ff75bd]" />
            </p>
            <h1 className="max-w-[900px] text-[32px] font-semibold leading-[1.06] text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.72)] sm:text-[52px] lg:max-w-[1100px] lg:text-[72px]">
              {currentMovie.title}
            </h1>

            <iframe
              src={watchUrl}
              title={currentMovie.title}
              width="100%"
              height="100%"
              allowFullScreen
              allow="encrypted-media"
              className="sm:hidden mt-6 aspect-video rounded-[7px] "
            ></iframe>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-[14px] text-white/90 sm:mt-6 sm:gap-5 sm:text-[20px] lg:mt-7">
              <span className="flex items-center gap-2 rounded-[7px] bg-white/10 px-3 py-1.5">
                <Star className="h-5 w-5 fill-[#facc15] text-[#facc15]" />
                {currentMovie.rating.toFixed(1)}
              </span>
              <span>{currentMovie.year || "TBA"}</span>
              <span className="rounded-[5px] border border-white/34 px-2.5 py-1 text-[16px]">
                {currentMovie.age_rating}
              </span>
              <span>{formatDuration(currentMovie.duration)}</span>
              <span className="rounded-[5px] border border-white/34 px-2.5 py-1 text-[16px]">
                {currentMovie.quality}
              </span>
            </div>

            <p className="mt-5 max-w-[720px] text-[14px] leading-6 text-white/92 sm:mt-7 sm:text-[17px] sm:leading-8 lg:max-w-[850px]">
              {currentMovie.description}
            </p>

            <div className="mt-7 hidden flex-wrap gap-3 sm:mt-9 sm:flex sm:gap-5">
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="flex h-[50px] cursor-pointer items-center gap-3 rounded-[7px] bg-[#ee3e9f] px-7 text-[17px] font-semibold text-white shadow-[0_18px_38px_rgba(236,72,153,0.34)] transition hover:bg-[#c81979] sm:h-[58px] sm:gap-4 sm:px-11 sm:text-[22px]"
              >
                <Play className="h-6 w-6 fill-current" />
                Play
              </button>
              <button
                type="button"
                onClick={() => setIsTrailerOpen(true)}
                className="flex h-[50px] cursor-pointer items-center gap-3 rounded-[7px] bg-white px-6 text-[17px] font-semibold text-[#ee3e9f] shadow-[0_18px_38px_rgba(0,0,0,0.26)] transition hover:bg-[#ffe3f3] sm:h-[58px] sm:gap-4 sm:px-9 sm:text-[22px]"
              >
                <Film className="h-6 w-6" />
                Watch Trailer
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-12 border-t border-white/10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-24 lg:px-9">
          <div>
            <h2 className="font-script text-[32px] font-semibold text-[#ff75bd] sm:text-[34px]">
              Details
            </h2>
            <dl className="mt-2 grid gap-4 text-[14px] text-white/92 sm:mt-6 sm:gap-5 sm:text-[16px]">
              <div className="grid grid-cols-[86px_1fr] gap-4 sm:grid-cols-[100px_1fr] sm:gap-5">
                <dt className="text-white/72">Director</dt>
                <dd>{currentMovie.director}</dd>
              </div>
              <div className="grid grid-cols-[86px_1fr] gap-4 sm:grid-cols-[100px_1fr] sm:gap-5">
                <dt className="text-white/72">Cast</dt>
                <dd>{currentMovie.cast.join(", ") || "Cast unavailable"}</dd>
              </div>
              <div className="grid grid-cols-[86px_1fr] gap-4 sm:grid-cols-[100px_1fr] sm:gap-5">
                <dt className="text-white/72">Genres</dt>
                <dd>{currentMovie.genre.join(", ") || "Genre unavailable"}</dd>
              </div>
              <div className="grid grid-cols-[86px_1fr] gap-4 sm:grid-cols-[100px_1fr] sm:gap-5">
                <dt className="text-white/72">Release</dt>
                <dd>{releaseDate(currentMovie.year)}</dd>
              </div>
              <div className="grid grid-cols-[86px_1fr] gap-4 sm:grid-cols-[100px_1fr] sm:gap-5">
                <dt className="text-white/72">Language</dt>
                <dd>{currentMovie.language}</dd>
              </div>
              <div className="grid grid-cols-[86px_1fr] gap-4 sm:grid-cols-[100px_1fr] sm:gap-5">
                <dt className="text-white/72">Subtitles</dt>
                <dd>{currentMovie.subtitles.join(", ")}</dd>
              </div>
            </dl>
          </div>

          <aside className="min-w-0">
            <h2 className="font-script text-[32px] font-semibold text-[#ff75bd] sm:text-[34px]">
              Suggested Movies
            </h2>
            <MediaCarousel itemCount={suggestedMovies.length}>
              {suggestedMovies.map((item) => (
                <Link
                  key={item.id}
                  href={moviePath(item.id, item.title)}
                  className="poster-float-card group relative aspect-[2/3] h-[210px] min-w-[140px] cursor-pointer overflow-hidden rounded-[7px] bg-[#240414] shadow-[0_18px_38px_rgba(0,0,0,0.32)]  sm:h-[300px] sm:min-w-[200px] lg:h-[330px] lg:min-w-[220px]"
                >
                  <Image
                    src={item.poster_url}
                    alt={item.title}
                    fill
                    className="poster-float-media object-cover"
                  />
                </Link>
              ))}
            </MediaCarousel>
          </aside>
        </section>
      </div>

      {isPlaying || isTrailerOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/82 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[8px] bg-[#07020b] shadow-[0_24px_80px_rgba(0,0,0,0.72)] ring-1 ring-white/14">
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setIsTrailerOpen(false);
              }}
              aria-label="Close video"
              className="absolute right-3 top-3 z-10 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-black/62 text-white transition hover:bg-[#ee3e9f]"
            >
              <X className="h-5 w-5" />
            </button>
            <PlayerFrame
              src={isTrailerOpen ? currentMovie.trailer_url : watchUrl}
              title={
                isTrailerOpen
                  ? `${currentMovie.title} trailer`
                  : currentMovie.title
              }
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
