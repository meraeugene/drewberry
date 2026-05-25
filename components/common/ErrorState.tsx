import { CircleAlert } from "lucide-react";

export function ErrorState({ message = "Something sparkly went sideways." }: { message?: string }) {
  return (
    <div className="rounded-3xl border border-rose-300 bg-rose-50 p-6 text-rose-900 dark:border-rose-400/30 dark:bg-rose-950/30 dark:text-rose-100">
      <div className="flex items-center gap-3 font-semibold">
        <CircleAlert className="h-5 w-5" />
        {message}
      </div>
    </div>
  );
}
