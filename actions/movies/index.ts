"use server";

import { movies } from "@/data/movies";
import type { Movie } from "@/types/movie";

type TmdbMovieDetails = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  runtime: number | null;
  episode_run_time?: number[];
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
  original_language: string;
  adult: boolean;
  created_by?: { name: string }[];
  seasons?: {
    season_number: number;
    name: string;
    episode_count: number;
  }[];
};

type TmdbMovieSummary = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  poster_path: string | null;
  backdrop_path: string | null;
  adult: boolean;
  genre_ids?: number[];
  media_type?: "movie" | "tv" | string;
};

type TmdbMovieListResponse = {
  results: TmdbMovieSummary[];
};

type TmdbCredits = {
  cast: { name: string }[];
  crew: { job: string; name: string }[];
};

type TmdbVideos = {
  results: {
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
  }[];
};

const imageBase = "https://image.tmdb.org/t/p";

function getTmdbHeaders() {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) return undefined;

  return {
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  };
}

function withApiKey(url: URL) {
  const apiKey = process.env.TMDB_API_KEY;

  if (apiKey && !process.env.TMDB_ACCESS_TOKEN) {
    url.searchParams.set("api_key", apiKey);
  }

  return url;
}

function parseTmdbId(id: string) {
  const match = /^(movie|tv)-(\d+)$/.exec(id);

  if (match) return { media: match[1] as "movie" | "tv", id: match[2] };
  if (/^\d+$/.test(id)) return { media: "movie" as const, id };

  return null;
}

async function fetchTmdbMovie(id: string): Promise<Movie | null> {
  const parsed = parseTmdbId(id);
  if (!parsed) return null;
  if (!process.env.TMDB_ACCESS_TOKEN && !process.env.TMDB_API_KEY) return null;

  const movieUrl = withApiKey(
    new URL(`https://api.themoviedb.org/3/${parsed.media}/${parsed.id}`),
  );
  movieUrl.searchParams.set("language", "en-US");

  const creditsUrl = withApiKey(
    new URL(`https://api.themoviedb.org/3/${parsed.media}/${parsed.id}/credits`),
  );
  creditsUrl.searchParams.set("language", "en-US");

  const videosUrl = withApiKey(
    new URL(`https://api.themoviedb.org/3/${parsed.media}/${parsed.id}/videos`),
  );
  videosUrl.searchParams.set("language", "en-US");

  const [movieResponse, creditsResponse, videosResponse] = await Promise.all([
    fetch(movieUrl, {
      headers: getTmdbHeaders(),
      next: { revalidate: 60 * 60 * 12 },
    }),
    fetch(creditsUrl, {
      headers: getTmdbHeaders(),
      next: { revalidate: 60 * 60 * 12 },
    }),
    fetch(videosUrl, {
      headers: getTmdbHeaders(),
      next: { revalidate: 60 * 60 * 12 },
    }),
  ]);

  if (!movieResponse.ok) return null;

  const movie = (await movieResponse.json()) as TmdbMovieDetails;
  const credits = creditsResponse.ok
    ? ((await creditsResponse.json()) as TmdbCredits)
    : { cast: [], crew: [] };
  const videos = videosResponse.ok
    ? ((await videosResponse.json()) as TmdbVideos)
    : { results: [] };
  const director =
    parsed.media === "tv"
      ? (movie.created_by?.map((creator) => creator.name).join(", ") ??
        credits.crew.find((member) => member.job === "Director")?.name ??
        "")
      : (credits.crew.find((member) => member.job === "Director")?.name ?? "");
  const trailer =
    videos.results.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official,
    ) ??
    videos.results.find(
      (video) => video.site === "YouTube" && video.type === "Trailer",
    ) ??
    videos.results.find((video) => video.site === "YouTube");

  return {
    id: `${parsed.media}-${movie.id}`,
    title: movie.title ?? movie.name ?? "Untitled",
    description: movie.overview || "No overview is available yet.",
    year:
      movie.release_date || movie.first_air_date
        ? Number((movie.release_date ?? movie.first_air_date ?? "").slice(0, 4))
        : 0,
    rating: Number(movie.vote_average.toFixed(1)),
    duration: movie.runtime ?? movie.episode_run_time?.[0] ?? 0,
    quality: "HD",
    age_rating: movie.adult ? "R" : "PG",
    genre: movie.genres.map((genre) => genre.name),
    poster_url: movie.poster_path
      ? `${imageBase}/w780${movie.poster_path}`
      : `https://placehold.co/780x1170/240414/ff75bd.png?text=${encodeURIComponent(movie.title ?? movie.name ?? "Untitled")}`,
    banner_url: movie.backdrop_path
      ? `${imageBase}/w1280${movie.backdrop_path}`
      : `https://placehold.co/1280x720/240414/ff75bd.png?text=${encodeURIComponent(movie.title ?? movie.name ?? "Untitled")}`,
    trailer_url: trailer
      ? `https://www.youtube.com/embed/${trailer.key}`
      : `https://player.videasy.net/${parsed.media}/${movie.id}?overlay=true&color=EC4899`,
    director,
    cast: credits.cast.slice(0, 5).map((member) => member.name),
    language: movie.original_language.toUpperCase(),
    subtitles: ["English"],
    created_at: new Date().toISOString(),
    collectionIds: [],
    seasons:
      parsed.media === "tv"
        ? (movie.seasons ?? [])
            .filter((season) => season.episode_count > 0)
            .map((season) => ({
              season_number: season.season_number,
              name: season.name,
              episode_count: season.episode_count,
            }))
        : undefined,
  };
}

function mapTmdbSummary(movie: TmdbMovieSummary, media: "movie" | "tv" = "movie"): Movie {
  const title = movie.title ?? movie.name ?? "Untitled";
  const date = movie.release_date ?? movie.first_air_date ?? "";
  const resultMedia =
    movie.media_type === "tv" || movie.media_type === "movie"
      ? movie.media_type
      : media;

  return {
    id: `${resultMedia}-${movie.id}`,
    title,
    description: movie.overview || "No overview is available yet.",
    year: date ? Number(date.slice(0, 4)) : 0,
    rating: Number(movie.vote_average.toFixed(1)),
    duration: 0,
    quality: "HD",
    age_rating: movie.adult ? "R" : "PG",
    genre: [],
    poster_url: movie.poster_path
      ? `${imageBase}/w780${movie.poster_path}`
      : `https://placehold.co/780x1170/240414/ff75bd.png?text=${encodeURIComponent(title)}`,
    banner_url: movie.backdrop_path
      ? `${imageBase}/w1280${movie.backdrop_path}`
      : `https://placehold.co/1280x720/240414/ff75bd.png?text=${encodeURIComponent(title)}`,
    trailer_url: "",
    director: "",
    cast: [],
    language: "EN",
    subtitles: ["English"],
    created_at: new Date().toISOString(),
    collectionIds: [],
  };
}

async function fetchTmdbMovieList(url: URL, media: "movie" | "tv" = "movie") {
  const response = await fetch(withApiKey(url), {
    headers: getTmdbHeaders(),
    next: { revalidate: 60 * 60 * 12 },
  });

  if (!response.ok) return [];

  const data = (await response.json()) as TmdbMovieListResponse;

  return data.results
    .filter((movie) => movie.poster_path)
    .map((movie) => mapTmdbSummary(movie, media));
}

async function searchTmdbMovies(query: string) {
  if (!process.env.TMDB_ACCESS_TOKEN && !process.env.TMDB_API_KEY) {
    return [];
  }

  const url = withApiKey(new URL("https://api.themoviedb.org/3/search/multi"));
  url.searchParams.set("query", query);
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("language", "en-US");
  url.searchParams.set("page", "1");

  const response = await fetch(url, {
    headers: getTmdbHeaders(),
    next: { revalidate: 60 * 30 },
  });

  if (!response.ok) return [];

  const data = (await response.json()) as TmdbMovieListResponse;

  return data.results
    .filter(
      (movie) =>
        movie.poster_path &&
        (movie.media_type === "movie" || movie.media_type === "tv"),
    )
    .map((movie) => mapTmdbSummary(movie));
}

export async function getMovieSuggestions(id: string) {
  const localFallback = movies
    .filter((movie) => movie.id !== id)
    .slice(0, 5);

  const parsed = parseTmdbId(id);
  if (!parsed) return localFallback;
  if (!process.env.TMDB_ACCESS_TOKEN && !process.env.TMDB_API_KEY) {
    return localFallback;
  }

  const recommendationsUrl = new URL(
    `https://api.themoviedb.org/3/${parsed.media}/${parsed.id}/recommendations`,
  );
  recommendationsUrl.searchParams.set("language", "en-US");
  recommendationsUrl.searchParams.set("page", "1");

  const similarUrl = new URL(`https://api.themoviedb.org/3/${parsed.media}/${parsed.id}/similar`);
  similarUrl.searchParams.set("language", "en-US");
  similarUrl.searchParams.set("page", "1");

  const [recommendations, similar] = await Promise.all([
    fetchTmdbMovieList(recommendationsUrl, parsed.media),
    fetchTmdbMovieList(similarUrl, parsed.media),
  ]);

  let suggestions = [...recommendations, ...similar].filter(
    (movie, index, list) =>
      movie.id !== id && list.findIndex((item) => item.id === movie.id) === index,
  );

  if (suggestions.length < 5) {
    const popularUrl = new URL(`https://api.themoviedb.org/3/${parsed.media}/popular`);
    popularUrl.searchParams.set("language", "en-US");
    popularUrl.searchParams.set("page", "1");

    const popular = await fetchTmdbMovieList(popularUrl, parsed.media);

    suggestions = [...suggestions, ...popular].filter(
      (movie, index, list) =>
        movie.id !== id &&
        list.findIndex((item) => item.id === movie.id) === index,
    );
  }

  return suggestions.length ? suggestions.slice(0, 12) : localFallback;
}

export async function getMovies(query?: string) {
  if (!query) return movies;
  const needle = query.toLowerCase();
  const localMatches = movies.filter((movie) =>
    [movie.title, movie.description, movie.director, ...movie.genre]
      .join(" ")
      .toLowerCase()
      .includes(needle),
  );
  const tmdbMatches = await searchTmdbMovies(query);

  return [...localMatches, ...tmdbMatches].filter(
    (movie, index, list) =>
      list.findIndex((item) => item.id === movie.id) === index,
  );
}

export async function getMovie(id: string) {
  return movies.find((movie) => movie.id === id) ?? (await fetchTmdbMovie(id));
}
