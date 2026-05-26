"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MediaCarousel } from "@/components/common/MediaCarousel";
import useSWR from "swr";
import { HomeLoadingSkeleton } from "@/components/skeletons/HomeLoadingSkeleton";
import { apiGet, moviePath } from "@/lib/utils";

type HomeMovie = {
  id: string;
  title: string;
  overview: string;
  year: string;
  rating: number;
  posterUrl: string;
  backdropUrl: string;
};

type HomeCategory = {
  title: string;
  movies: HomeMovie[];
};

type TmdbHomeResponse = {
  missingKey: boolean;
  hero: HomeMovie[];
  popular: HomeMovie[];
  categories: HomeCategory[];
};

function splitHeroTitle(title: string) {
  if (title.toLowerCase().startsWith("barbie")) {
    return {
      brand: "Barbie",
      title: title.replace(/^barbie\s*:?\s*/i, "") || title,
    };
  }

  return {
    brand: "Featured",
    title,
  };
}

function shorten(text: string, maxLength = 190) {
  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(" ");

  return `${trimmed.slice(0, lastSpace > 0 ? lastSpace : maxLength)}...`;
}

function PosterCard({ movie }: { movie: HomeMovie }) {
  return (
    <Link
      href={moviePath(movie.id, movie.title)}
      className="poster-float-card relative aspect-[2/3] h-[210px] min-w-[140px] cursor-pointer overflow-hidden rounded-[7px] bg-[#240414] shadow-[0_18px_38px_rgba(0,0,0,0.32)]  sm:h-[300px] sm:min-w-[200px] lg:h-[330px] lg:min-w-[220px]"
    >
      <Image
        src={movie.posterUrl}
        alt={movie.title}
        fill
        sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 220px"
        className="poster-float-media object-cover"
      />
    </Link>
  );
}

export default function HomePage() {
  const { data, isLoading } = useSWR<TmdbHomeResponse>(
    "/api/tmdb/home",
    apiGet,
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const heroMovies = useMemo(() => data?.hero ?? [], [data?.hero]);
  const activeHeroIndex = heroMovies.length
    ? activeSlide % heroMovies.length
    : 0;
  const slide = heroMovies[activeHeroIndex] ?? heroMovies[0];

  useEffect(() => {
    if (!heroMovies.length) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroMovies.length);
    }, 5600);

    return () => window.clearInterval(timer);
  }, [heroMovies.length]);

  if (isLoading || !data || !slide) return <HomeLoadingSkeleton />;

  const heroTitle = splitHeroTitle(slide.title);

  return (
    <main className="font-body min-h-screen overflow-hidden bg-[linear-gradient(135deg,#07020b_0%,#1a0310_42%,#4a0624_100%)] text-white">
      <section className="relative min-h-[620px] px-4 pb-10 pt-[128px] sm:px-6 sm:pt-[150px] lg:min-h-[720px] lg:px-9 lg:pt-[160px]">
        <div className="absolute inset-0">
          {heroMovies.map((movie, index) => (
            <Image
              key={movie.id}
              src={movie.backdropUrl}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover object-center transition-opacity duration-500 ease-out ${
                activeHeroIndex === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,2,11,0.98)_0%,rgba(26,3,16,0.92)_24%,rgba(59,7,31,0.74)_46%,rgba(131,24,67,0.24)_68%,rgba(7,2,11,0.6)_100%),linear-gradient(180deg,rgba(7,2,11,0.22)_0%,rgba(7,2,11,0.14)_48%,#07020b_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(236,72,153,0.2),transparent_24%)]" />

        <div className="relative z-10 max-w-[850px]">
          <motion.h1
            key={`${slide.id}-brand`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.08 }}
            className="font-script text-[38px] font-semibold leading-[0.88] text-[#ff75bd] drop-shadow-[0_5px_22px_rgba(76,5,35,0.72)] sm:text-[72px] lg:text-[88px]"
          >
            {heroTitle.brand}
          </motion.h1>
          <motion.h2
            key={`${slide.id}-title`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.16 }}
            className="mt-2 max-w-[340px] text-[28px] font-semibold leading-tight text-white drop-shadow-[0_4px_18px_rgba(76,5,35,0.72)] sm:max-w-[1000px] sm:text-[36px] lg:text-[40px]"
          >
            {heroTitle.title}
          </motion.h2>
          <motion.p
            key={`${slide.id}-description`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.24 }}
            className="mt-4 max-w-[340px] overflow-hidden text-[15px] leading-6 text-white [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] drop-shadow-[0_3px_16px_rgba(76,5,35,0.72)] sm:max-w-[600px] sm:text-[17px] sm:leading-7"
          >
            {shorten(slide.overview, 240)}
          </motion.p>

          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href={moviePath(slide.id, slide.title)}
              className="flex h-[51px] cursor-pointer items-center gap-3 rounded-[7px] bg-[#ee3e9f] px-8 text-[18px] font-semibold text-white transition hover:bg-[#c81979] sm:px-10 sm:text-[20px]"
            >
              <Play className="h-5 w-5 fill-white" />
              Play
            </Link>
          </div>
        </div>

        <div className="absolute bottom-[154px] left-1/2 z-30 flex -translate-x-1/2 gap-5 lg:bottom-[176px]">
          {heroMovies.map((movie, index) => (
            <button
              key={movie.id}
              type="button"
              aria-label={`Show ${movie.title}`}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 cursor-pointer rounded-full transition ${
                activeHeroIndex === index
                  ? "w-8 bg-[#ee3e9f]"
                  : "w-2.5 bg-white/72 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="relative z-20 -mt-[105px] px-4 pb-10 sm:-mt-[120px] sm:px-6 sm:pb-10 lg:-mt-[150px] lg:px-9 lg:pb-12">
        <div className=" flex items-center gap-2">
          <h2 className="font-script text-[28px] font-semibold leading-none sm:mb-2 text-[#ff75bd] drop-shadow-[0_3px_10px_rgba(0,0,0,0.72)] sm:text-[42px] ">
            Popular Picks
          </h2>
          <Image
            src="/pinkb.png"
            alt=""
            width={22}
            height={22}
            className="h-6 w-6 object-contain"
          />
        </div>
        <MediaCarousel itemCount={data.popular.length}>
          {data.popular.map((movie, index) => (
            <PosterCard key={`${movie.id}-${index}`} movie={movie} />
          ))}
        </MediaCarousel>
      </section>

      {data.categories.map((category) => (
        <section
          key={category.title}
          className="px-4 pb-10 sm:px-6 sm:pb-10 lg:px-9 lg:pb-12"
        >
          <h2 className=" font-script text-[28px] font-semibold leading-none text-[#ff75bd] drop-shadow-[0_3px_10px_rgba(0,0,0,0.72)] sm:mb-2 sm:text-[42px]">
            {category.title}
          </h2>
          <MediaCarousel itemCount={category.movies.length}>
            {category.movies.map((movie, index) => (
              <PosterCard
                key={`${category.title}-${movie.id}-${movie.title}-${index}`}
                movie={movie}
              />
            ))}
          </MediaCarousel>
        </section>
      ))}
    </main>
  );
}
