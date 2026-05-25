import { Star } from "lucide-react";
import type { Movie } from "@/types/movie";
import { formatTime } from "@/utils/formatTime";

export function MovieMeta({ movie }: { movie: Movie }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-pink-950/75 dark:text-pink-100/80">
      <span className="flex items-center gap-1 rounded-full bg-amber-200 px-3 py-1 text-amber-950">
        <Star className="h-3.5 w-3.5 fill-current" />
        {movie.rating}
      </span>
      <span>{movie.year}</span>
      <span>{formatTime(movie.duration)}</span>
      <span className="rounded-full border border-pink-300 px-2 py-0.5">{movie.quality}</span>
      <span className="rounded-full border border-pink-300 px-2 py-0.5">{movie.age_rating}</span>
    </div>
  );
}
