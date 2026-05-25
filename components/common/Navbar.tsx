"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";

export function Navbar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const visibleItems = navItems.filter((item) => item.href !== "/profile");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300",
        scrolled
          ? "border-pink-400/16 bg-[#1a0310]/82 shadow-[0_18px_38px_rgba(0,0,0,0.32)] backdrop-blur-xl"
          : "border-pink-300/10 bg-[#1a0310]/54 backdrop-blur-md",
      )}
    >
      <div className="flex h-[68px] items-center gap-8 px-4 md:px-9">
        <Link href="/home" className="flex shrink-0 items-center gap-2">
          <span className="font-script text-[44px] font-semibold leading-none text-[#ff5fb6]">
            drewberry
          </span>
          <Image
            src="/pinkb.png"
            alt=""
            width={27}
            height={27}
            className="h-7 w-7 object-contain"
          />
        </Link>

        <nav className="ml-24 hidden items-center gap-9 lg:flex">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-1 py-3 text-[15px] font-semibold transition",
                pathname === item.href
                  ? "text-[#ff5fb6]"
                  : "text-pink-50/88 hover:text-[#ff8bcb]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
