import type { Movie } from "@/types/movie";
import { MovieCard } from "./MovieCard";

export function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-black text-pink-950 dark:text-white">{title}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
