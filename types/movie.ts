export type Movie = {
  id: string;
  title: string;
  description: string;
  year: number;
  rating: number;
  duration: number;
  quality: "HD" | "4K";
  age_rating: string;
  genre: string[];
  poster_url: string;
  banner_url: string;
  trailer_url: string;
  director: string;
  cast: string[];
  language: string;
  subtitles: string[];
  created_at: string;
  collectionIds: string[];
  seasons?: {
    season_number: number;
    name: string;
    episode_count: number;
  }[];
};
