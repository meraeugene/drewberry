import type { Movie } from "@/types/movie";
import { MovieRow } from "./MovieRow";

export function MoreLikeThis({ movies }: { movies: Movie[] }) {
  return <MovieRow title="More like this" movies={movies} />;
}
