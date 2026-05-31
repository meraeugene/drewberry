function DetailsLine() {
  return (
    <div className="grid grid-cols-[86px_1fr] gap-4 sm:grid-cols-[100px_1fr] sm:gap-5">
      <div className="h-4 animate-pulse rounded bg-white/10 sm:h-5" />
      <div className="h-4 animate-pulse rounded bg-white/10 sm:h-5" />
    </div>
  );
}

function SuggestedPosterSkeleton() {
  return (
    <div className="poster-skeleton-card aspect-[2/3] h-[210px] min-w-[140px] rounded-[7px] ring-1 ring-[#f472b6]/10 sm:h-[300px] sm:min-w-[200px] lg:h-[330px] lg:min-w-[220px]" />
  );
}

export function MovieDetailsLoadingSkeleton() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07020b] text-white">
      <div className="absolute inset-0 animate-pulse bg-[linear-gradient(90deg,#07020b_0%,rgba(7,2,11,0.96)_24%,rgba(20,6,34,0.62)_54%,rgba(7,2,11,0.06)_100%),linear-gradient(180deg,rgba(7,2,11,0.16)_0%,rgba(7,2,11,0.5)_58%,#07020b_100%)]" />
      <div className="relative z-10">
        <section className="px-4 pb-8 pt-24 sm:px-6 sm:pb-10 sm:pt-32 lg:px-9 lg:pb-12">
          <div className="mb-5 h-7 w-7 animate-pulse bg-white rounded-sm " />
          <div className="h-9 w-28 animate-pulse rounded bg-[#ff75bd]/30 sm:h-11 sm:w-32" />
          <div className="mt-4 h-10 w-[min(680px,84vw)] animate-pulse rounded bg-white/10 sm:mt-5 sm:h-16 lg:w-[min(900px,84vw)]" />

          <div className="poster-skeleton-card mt-5 aspect-video w-full min-h-[210px] rounded-[8px]  sm:hidden" />

          <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-14 animate-pulse rounded-[7px] bg-white/10 sm:h-10 sm:w-20"
              />
            ))}
          </div>
          <div className="mt-5 grid max-w-[min(720px,86vw)] gap-3 sm:mt-7 lg:max-w-[850px]">
            <div className="h-4 animate-pulse rounded bg-white/10" />
            <div className="h-4 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
          </div>
          <div className="mt-7 hidden gap-3 sm:mt-9 sm:flex sm:gap-5">
            <div className="h-[50px] w-32 animate-pulse rounded-[7px] bg-[#ee3e9f]/60 sm:h-[58px] sm:w-44" />
            <div className="h-[50px] w-44 animate-pulse rounded-[7px] bg-white/20 sm:h-[58px] sm:w-56" />
          </div>
        </section>

        <section className="grid gap-12 border-t border-white/10 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-24 lg:px-9">
          <div>
            <div className="h-8 w-28 animate-pulse rounded bg-[#ff75bd]/30" />
            <dl className="mt-5 grid gap-4 sm:mt-6 sm:gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <DetailsLine key={index} />
              ))}
            </dl>
          </div>

          <aside className="min-w-0">
            <div className="h-8 w-52 animate-pulse rounded bg-[#ff75bd]/30 sm:w-56" />
            <div className="mt-6 flex gap-3 overflow-hidden sm:gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <SuggestedPosterSkeleton key={index} />
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
