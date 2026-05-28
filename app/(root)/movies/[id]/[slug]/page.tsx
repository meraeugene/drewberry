"use client";

import { ArrowLeft, Film, Play, Server, Sparkles, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type IframeHTMLAttributes, useEffect, useState } from "react";
import { MediaCarousel } from "@/components/common/MediaCarousel";
import { ErrorState } from "@/components/common/ErrorState";
import { MovieDetailsLoadingSkeleton } from "@/components/skeletons/MovieDetailsLoadingSkeleton";
import { useMovie } from "@/hooks/useMovie";
import { useMovieSuggestions } from "@/hooks/useMovieSuggestions";
import { cn, moviePath } from "@/lib/utils";

function formatDuration(minutes: number) {
  if (!minutes) return null;

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (!hours) return `${remaining}m`;

  return `${hours}h ${remaining}m`;
}

function releaseDate(year: number) {
  if (!year) return "TBA";

  return String(year);
}

function getMediaId(id: string) {
  const match = /^(movie|tv)-(\d+)$/.exec(id);

  if (match) return { type: match[1] as "movie" | "tv", id: match[2] };
  if (/^\d+$/.test(id)) return { type: "movie" as const, id };

  return null;
}

type PlayerServer = "vidsrc" | "vidking" | "videasy";

const playerServers: { id: PlayerServer; label: string }[] = [
  { id: "vidsrc", label: "Server 1" },
  { id: "vidking", label: "Server 2" },
  { id: "videasy", label: "Server 3" },
];

function playerUrl({
  server,
  id,
  season,
  episode,
  autoPlay,
}: {
  server: PlayerServer;
  id: string;
  season: number;
  episode: number;
  autoPlay: boolean;
}) {
  const media = getMediaId(id);
  if (!media) return "";

  // VIDSRC (FIRST PRIORITY)
  if (server === "vidsrc") {
    if (media.type === "tv") {
      return `https://vidsrc-embed.ru/embed/tv/${media.id}/${season}/${episode}`;
    }

    return `https://vidsrc-embed.ru/embed/movie/${media.id}`;
  }

  // VIDKING (SECOND PRIORITY)
  if (server === "vidking") {
    const params = new URLSearchParams({
      color: "EC4899",
      autoPlay: String(autoPlay),
    });

    if (media.type === "tv") {
      params.set("nextEpisode", "true");
      params.set("episodeSelector", "true");

      return `https://www.vidking.net/embed/tv/${media.id}/${season}/${episode}?${params.toString()}`;
    }

    return `https://www.vidking.net/embed/movie/${media.id}?${params.toString()}`;
  }

  // VIDEASY (THIRD PRIORITY)
  if (server === "videasy") {
    const params = new URLSearchParams({
      overlay: "true",
      color: "EC4899",
      autoPlay: String(autoPlay),
    });

    if (media.type === "tv") {
      params.set("nextEpisode", "true");
      params.set("episodeSelector", "true");
      params.set("autoplayNextEpisode", String(autoPlay));

      return `https://player.videasy.net/tv/${media.id}/${season}/${episode}?${params.toString()}`;
    }

    return `https://player.videasy.net/movie/${media.id}?${params.toString()}`;
  }

  return "";
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    function updateMatches() {
      setMatches(mediaQuery.matches);
    }

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);

    return () => mediaQuery.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
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
  const [selectedServer, setSelectedServer] = useState<PlayerServer>("vidsrc");
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const isDesktopViewport = useMediaQuery("(min-width: 1024px)");

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
  const media = getMediaId(currentMovie.id);
  const isTvShow = media?.type === "tv";
  const seasons = currentMovie.seasons ?? [];
  const activeSeason =
    seasons.find((season) => season.season_number === selectedSeason) ??
    seasons.find((season) => season.season_number === 1) ??
    seasons[0];
  const episodeCount = activeSeason?.episode_count ?? 1;
  const activeSeasonNumber = activeSeason?.season_number ?? selectedSeason;
  const activeEpisode = Math.min(selectedEpisode, episodeCount);
  const inlineWatchUrl = media
    ? playerUrl({
        server: selectedServer,
        id: currentMovie.id,
        season: activeSeasonNumber,
        episode: activeEpisode,
        autoPlay: false,
      })
    : currentMovie.trailer_url;
  const playbackWatchUrl = media
    ? playerUrl({
        server: selectedServer,
        id: currentMovie.id,
        season: activeSeasonNumber,
        episode: activeEpisode,
        autoPlay: true,
      })
    : currentMovie.trailer_url;
  const playerTitle = isTvShow
    ? `${currentMovie.title} S${activeSeasonNumber} E${activeEpisode}`
    : currentMovie.title;

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
              className="mb-5 grid  cursor-pointer place-items-center   text-white  "
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <p className="font-script text-[34px] font-semibold tracking-wide text-[#ff75bd] sm:text-[44px]">
              Featured
              <Sparkles className="ml-3 inline h-5 w-5 align-middle text-[#ff75bd]" />
            </p>
            <h1 className="max-w-[900px] text-[32px] font-semibold leading-[1.06] text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.72)] sm:text-[52px] lg:max-w-[1100px] lg:text-[72px]">
              {currentMovie.title}
            </h1>

            {isDesktopViewport === false ? (
              <iframe
                src={inlineWatchUrl}
                title={playerTitle}
                width="100%"
                height="100%"
                allowFullScreen
                allow="encrypted-media; fullscreen; picture-in-picture"
                className="mt-6 aspect-video w-full rounded-[7px] bg-black shadow-[0_18px_38px_rgba(0,0,0,0.32)]"
              ></iframe>
            ) : null}

            {media ? (
              <div className="mt-4 flex max-w-full flex-nowrap items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {playerServers.map((server) => (
                  <button
                    key={server.id}
                    type="button"
                    onClick={() => setSelectedServer(server.id)}
                    className={cn(
                      "h-10 shrink-0 cursor-pointer rounded-[7px] px-4 text-[14px] font-semibold transition ring-1",
                      selectedServer === server.id
                        ? "bg-[#ee3e9f] text-white ring-[#ff75bd]/70"
                        : "bg-white/10 text-white/82 ring-white/14 hover:bg-white/16",
                    )}
                  >
                    {server.label}
                  </button>
                ))}
              </div>
            ) : null}

            {isTvShow && seasons.length ? (
              <div className="mt-4 grid gap-4 rounded-[7px] bg-black/28 p-3 ring-1 ring-white/10 backdrop-blur-md sm:p-4 lg:max-w-[860px]">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {seasons.map((season) => (
                    <button
                      key={season.season_number}
                      type="button"
                      onClick={() => {
                        setSelectedSeason(season.season_number);
                        setSelectedEpisode(1);
                      }}
                      className={cn(
                        "h-10 shrink-0 cursor-pointer rounded-[7px] px-4 text-[14px] font-semibold transition ring-1",
                        activeSeasonNumber === season.season_number
                          ? "bg-white text-[#ee3e9f] ring-white"
                          : "bg-white/10 text-white/82 ring-white/14 hover:bg-white/16",
                      )}
                    >
                      {season.name || `Season ${season.season_number}`}
                    </button>
                  ))}
                </div>
                <div className="grid max-h-[176px] grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-2 overflow-y-auto pr-1 sm:grid-cols-[repeat(auto-fill,minmax(58px,1fr))]">
                  {Array.from(
                    { length: episodeCount },
                    (_, index) => index + 1,
                  ).map((episode) => (
                    <button
                      key={`${activeSeasonNumber}-${episode}`}
                      type="button"
                      onClick={() => setSelectedEpisode(episode)}
                      className={cn(
                        "h-10 cursor-pointer rounded-[7px] text-[14px] font-semibold transition ring-1",
                        activeEpisode === episode
                          ? "bg-[#ee3e9f] text-white ring-[#ff75bd]/70"
                          : "bg-white/10 text-white/82 ring-white/14 hover:bg-white/16",
                      )}
                      aria-label={`Episode ${episode}`}
                    >
                      E{episode}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div
              className="mt-5 flex flex-nowrap overflow-x-auto
             scrollbar-none  max-w-full  items-center   pb-1  [&::-webkit-scrollbar]:hidden  gap-2 text-[14px] text-white/90 sm:mt-6 sm:gap-5 sm:text-[20px] lg:mt-7"
            >
              <span className="flex items-center gap-2 rounded-[7px] bg-white/10 px-3 py-1.5">
                <Star className="h-5 w-5 fill-[#facc15] text-[#facc15]" />
                {currentMovie.rating.toFixed(1)}
              </span>
              <span>{currentMovie.year || "TBA"}</span>
              {isTvShow ? (
                <span className="rounded-[5px] border border-white/34 px-2.5 py-1 text-[16px]">
                  S{activeSeasonNumber} E{activeEpisode}
                </span>
              ) : null}
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
              src={isTrailerOpen ? currentMovie.trailer_url : playbackWatchUrl}
              title={
                isTrailerOpen ? `${currentMovie.title} trailer` : playerTitle
              }
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
