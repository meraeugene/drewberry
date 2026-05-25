import { Clapperboard, Play } from "lucide-react";

export function MovieTrailerCard() {
  return (
    <div className="rounded-[1.75rem] border border-pink-200/70 bg-white/70 p-5 shadow-xl shadow-pink-400/10 dark:border-white/10 dark:bg-white/10">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-pink-600 dark:text-pink-100">
        <Clapperboard className="h-4 w-4" />
        Trailer
      </div>
      <button className="flex aspect-video w-full items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-600 text-white shadow-inner">
        <Play className="h-12 w-12 fill-current" />
      </button>
    </div>
  );
}
