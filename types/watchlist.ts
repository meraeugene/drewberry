export type WatchlistItem = {
  id: string;
  user_id: string;
  movie_id: string;
  added_at: string;
};

export type ContinueWatchingItem = {
  id: string;
  user_id: string;
  movie_id: string;
  progress: number;
  updated_at: string;
};
