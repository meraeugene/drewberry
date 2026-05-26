"use client";

import { ChevronRight } from "lucide-react";
import {
  Children,
  Fragment,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

function pageLeftFor(
  page: number,
  pageCount: number,
  setWidth: number,
  viewportWidth: number,
) {
  const scrollAmount = viewportWidth * 0.86;
  const maxScroll = Math.max(setWidth - viewportWidth, 0);

  if (page >= pageCount - 1) return maxScroll;

  return Math.min(page * scrollAmount, maxScroll);
}

export function MediaCarousel({
  children,
  itemCount,
}: {
  children: ReactNode;
  itemCount: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const resetTimerRef = useRef<number | null>(null);
  const [canLoop, setCanLoop] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [setWidth, setSetWidth] = useState(0);
  const items = useMemo(() => Children.toArray(children), [children]);
  const setIndexes = canLoop ? [0, 1, 2] : [0];

  useLayoutEffect(() => {
    function measure() {
      const row = rowRef.current;
      if (!row) return;

      const firstSet = row.firstElementChild as HTMLElement | null;
      const measuredSetWidth = firstSet?.offsetWidth ?? row.scrollWidth;
      const nextCanLoop =
        itemCount > 1 && measuredSetWidth > row.clientWidth + 8;
      const nextPageCount = nextCanLoop
        ? Math.ceil(
            (measuredSetWidth - row.clientWidth) / (row.clientWidth * 0.86),
          ) + 1
        : 0;

      setCanLoop(nextCanLoop);
      setSetWidth(measuredSetWidth);
      setPageCount(nextPageCount);
      setActivePage((current) =>
        nextPageCount ? Math.min(current, nextPageCount - 1) : 0,
      );

      if (nextCanLoop && canLoop) {
        const left =
          measuredSetWidth +
          pageLeftFor(
            Math.min(activePage, nextPageCount - 1),
            nextPageCount,
            measuredSetWidth,
            row.clientWidth,
          );

        if (
          row.scrollLeft < measuredSetWidth * 0.5 ||
          row.scrollLeft >= measuredSetWidth * 2.5
        ) {
          row.scrollTo({ left, behavior: "instant" });
        }
      }
    }

    measure();
    window.addEventListener("resize", measure);

    return () => window.removeEventListener("resize", measure);
  }, [activePage, canLoop, itemCount]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  function pageLeft(page: number) {
    const row = rowRef.current;
    if (!row) return 0;

    return pageLeftFor(page, pageCount, setWidth, row.clientWidth);
  }

  function resetToMiddle(page: number) {
    const row = rowRef.current;
    if (!row) return;

    row.scrollTo({
      left: setWidth + pageLeft(page),
      behavior: "instant",
    });
  }

  function next() {
    const row = rowRef.current;
    if (!row || !canLoop || !setWidth || !pageCount) return;

    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);

    const wrapping = activePage >= pageCount - 1;
    const nextPage = wrapping ? 0 : activePage + 1;
    const targetLeft = wrapping ? setWidth * 2 : setWidth + pageLeft(nextPage);

    setActivePage(nextPage);
    row.scrollTo({ left: targetLeft, behavior: "smooth" });

    if (wrapping) {
      resetTimerRef.current = window.setTimeout(() => {
        resetToMiddle(0);
      }, 560);
    }
  }

  function previous() {
    const row = rowRef.current;
    if (!row || !canLoop || !setWidth || !pageCount) return;

    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);

    const wrapping = activePage <= 0;
    const nextPage = wrapping ? pageCount - 1 : activePage - 1;
    const targetLeft = wrapping ? pageLeft(nextPage) : setWidth + pageLeft(nextPage);

    setActivePage(nextPage);
    row.scrollTo({ left: targetLeft, behavior: "smooth" });

    if (wrapping) {
      resetTimerRef.current = window.setTimeout(() => {
        resetToMiddle(nextPage);
      }, 560);
    }
  }

  return (
    <div className="relative -mx-4 overflow-visible pb-1 pl-4 pt-4 sm:-mx-6 sm:pl-6 lg:-mx-9 lg:pl-9">
      {pageCount > 1 ? (
        <div className="absolute right-4 top-0 z-20 hidden gap-1 sm:right-6 sm:flex lg:right-9">
          {Array.from({ length: pageCount }).map((_, index) => (
            <span
              key={index}
              className={`h-0.5 w-3 rounded-full transition ${
                activePage === index ? "bg-white" : "bg-white/34"
              }`}
            />
          ))}
        </div>
      ) : null}
      <div
        ref={rowRef}
        className="-my-4 flex overflow-x-auto scroll-smooth py-4 pr-4 [scrollbar-width:none] sm:pr-6 lg:pr-9 [&::-webkit-scrollbar]:hidden"
      >
        {setIndexes.map((setIndex) => (
          <div
            key={setIndex}
            className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4"
          >
            {items.map((item, index) => (
              <Fragment key={`${setIndex}-${index}`}>{item}</Fragment>
            ))}
          </div>
        ))}
      </div>
      {canLoop ? (
        <button
          type="button"
          aria-label="Show previous"
          onClick={previous}
          className="absolute left-0 top-4 z-40 hidden h-[calc(100%-18px)] w-11 cursor-pointer place-items-center bg-gradient-to-r from-[#12030a]/96 via-[#12030a]/64 to-transparent transition hover:text-[#ff75bd] sm:grid sm:w-16 lg:w-20"
        >
          <span className="grid h-16 w-10 rotate-180 place-items-center text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] sm:h-20 sm:w-12">
            <ChevronRight className="h-8 w-8 stroke-[3.25] sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
          </span>
        </button>
      ) : null}
      {canLoop ? (
        <button
          type="button"
          aria-label="Show more"
          onClick={next}
          className="absolute right-0 top-4 z-40 hidden h-[calc(100%-18px)] w-11 cursor-pointer place-items-center bg-gradient-to-l from-[#12030a]/96 via-[#12030a]/64 to-transparent transition hover:text-[#ff75bd] sm:grid sm:w-16 lg:w-20"
        >
          <span className="grid h-16 w-10 place-items-center text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] sm:h-20 sm:w-12">
            <ChevronRight className="h-8 w-8 stroke-[3.25] sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
          </span>
        </button>
      ) : null}
    </div>
  );
}
