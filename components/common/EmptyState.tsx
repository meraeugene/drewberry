import { Sparkles } from "lucide-react";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="grid min-h-72 place-items-center rounded-[2rem] border border-dashed border-pink-300 bg-white/55 p-8 text-center shadow-sm dark:border-pink-300/20 dark:bg-white/5">
      <div>
        <Sparkles className="mx-auto mb-4 h-10 w-10 text-pink-500" />
        <h2 className="text-2xl font-bold text-pink-950 dark:text-white">{title}</h2>
        <p className="mt-2 max-w-md text-sm text-pink-900/70 dark:text-pink-100/70">
          {message}
        </p>
      </div>
    </div>
  );
}
