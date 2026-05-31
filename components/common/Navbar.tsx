"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SearchBar } from "./SearchBar";

function navIcon(href: string) {
  if (href === "/watchlist") return <Heart className="h-4 w-4" />;

  return <Home className="h-4 w-4" />;
}

export function Navbar() {
  const pathname = usePathname();
  const visibleItems = navItems.filter((item) => item.href !== "/profile");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
          : "border-pink-300/10 bg-[#1a0310]/72 backdrop-blur-md",
      )}
    >
      <div className="flex min-h-[68px] items-center gap-4 px-4 py-3 md:px-9 lg:gap-8">
        <Link href="/home" className="flex shrink-0 items-center gap-2">
          <span className="font-script text-[32px] md:text-[44px] font-semibold leading-none text-[#ff5fb6]">
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

        <nav className="hidden items-center gap-6 lg:flex xl:ml-12 xl:gap-9">
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
        <div className="ml-auto hidden w-full max-w-[420px] md:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => {
              setSearchOpen((open) => !open);
              setMenuOpen(false);
            }}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-pink-50 ring-1 ring-white/10 transition hover:bg-white/16"
          >
            <motion.span
              animate={{
                rotate: searchOpen ? 90 : 0,
                scale: searchOpen ? 0.92 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </motion.span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen((open) => !open);
              setSearchOpen(false);
            }}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-pink-50 ring-1 ring-white/10 transition hover:bg-white/16"
          >
            <motion.span
              animate={{
                rotate: menuOpen ? 90 : 0,
                scale: menuOpen ? 0.92 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            key="mobile-search"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="border-t border-white/10 px-4 py-4 md:hidden"
          >
            <SearchBar onNavigate={() => setSearchOpen(false)} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            key="mobile-menu"
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/10 px-4 pb-4 md:hidden"
          >
            <div className="grid gap-2 pt-3">
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.18 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex h-12 items-center gap-3 rounded-[7px] px-4 text-[15px] font-semibold transition",
                      pathname === item.href
                        ? "bg-[#ee3e9f]/18 text-[#ff75bd]"
                        : "text-pink-50/88 hover:bg-white/10 hover:text-[#ff8bcb]",
                    )}
                  >
                    {navIcon(item.href)}
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
