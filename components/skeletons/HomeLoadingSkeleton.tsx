function PosterSkeleton() {
  return (
    <div className="poster-skeleton-card aspect-[2/3] h-[210px] min-w-[140px] rounded-[7px] ring-1 ring-[#f472b6]/10 sm:h-[300px] sm:min-w-[200px] lg:h-[330px] lg:min-w-[220px]" />
  );
}

function RowSkeleton({ titleWidth = "w-56" }: { titleWidth?: string }) {
  return (
    <section className="px-4 pb-8 sm:px-6 sm:pb-10 lg:px-9 lg:pb-12">
      <div
        className={`mb-4 h-8 ${titleWidth} max-w-[72vw] animate-pulse rounded bg-pink-100/10 sm:h-9`}
      />
      <div className="flex gap-3 overflow-hidden sm:gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <PosterSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

export function HomeLoadingSkeleton() {
  return (
    <main className="font-body min-h-screen overflow-hidden bg-[#12030a] text-white">
      <section className="relative min-h-[620px] px-4 pb-8 pt-[128px] sm:px-6 sm:pt-[150px] lg:min-h-[720px] lg:px-9 lg:pt-[160px]">
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(90deg,rgba(18,3,10,0.96)_0%,rgba(59,7,31,0.82)_28%,rgba(131,24,67,0.2)_62%,rgba(18,3,10,0.46)_100%),linear-gradient(180deg,rgba(18,3,10,0.12)_0%,rgba(18,3,10,0)_56%,#12030a_100%)]" />
        <div className="relative z-10 max-w-[850px]">
          <div className="h-16 w-52 animate-pulse rounded bg-pink-100/10 sm:h-20 sm:w-64" />
          <div className="mt-5 h-10 w-[min(560px,80vw)] animate-pulse rounded bg-white/10 sm:h-12" />
          <div className="mt-6 grid max-w-[min(600px,86vw)] gap-3">
            <div className="h-4 animate-pulse rounded bg-white/10" />
            <div className="h-4 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
          </div>
          <div className="mt-7 flex gap-4 sm:gap-5">
            <div className="h-[50px] w-36 animate-pulse rounded-[7px] bg-[#ee3e9f]/60 sm:w-44" />
          </div>
        </div>
      </section>

      <div className="relative z-20 -mt-[105px] sm:-mt-[120px] lg:-mt-[150px]">
        <RowSkeleton titleWidth="w-64" />
      </div>
      <RowSkeleton titleWidth="w-72" />
      <RowSkeleton titleWidth="w-52" />
    </main>
  );
}
