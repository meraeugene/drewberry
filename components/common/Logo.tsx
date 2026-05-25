import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Logo() {
  return (
    <Link href="/home" className="flex items-center gap-2">
      <span className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-pink-400 via-fuchsia-400 to-violet-500 text-white shadow-lg shadow-pink-500/30">
        <Crown className="h-5 w-5" />
        <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-pink-100" />
      </span>
      <span className="font-script text-3xl text-pink-700 dark:text-pink-100">
        {APP_NAME}
      </span>
    </Link>
  );
}
