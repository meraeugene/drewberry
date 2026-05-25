import { MovieCardSkeleton } from "./MovieCardSkeleton";

export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-80 animate-pulse rounded-[2rem] bg-pink-200/60 dark:bg-white/10" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
