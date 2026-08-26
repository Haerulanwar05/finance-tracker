export default function TransactionsLoading() {
  return (
    <div className="space-y-6 animate-pulse p-1 sm:p-2">
      {/* Top Header & Actions Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-44 bg-zinc-800/80 rounded-2xl"></div>
          <div className="h-4 w-64 bg-zinc-800/50 rounded-xl"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-10 w-32 bg-zinc-800/60 rounded-2xl"></div>
          <div className="h-10 w-28 bg-zinc-800/60 rounded-2xl"></div>
          <div className="h-10 w-36 bg-emerald-500/20 rounded-2xl"></div>
        </div>
      </div>

      {/* 3 Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-28 bg-zinc-900/60 border border-white/[0.06] rounded-3xl"></div>
        <div className="h-28 bg-zinc-900/60 border border-white/[0.06] rounded-3xl"></div>
        <div className="h-28 bg-zinc-900/60 border border-white/[0.06] rounded-3xl"></div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-14 bg-zinc-900/50 border border-white/[0.06] rounded-2xl"></div>

      {/* Transaction List Items Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-18 bg-zinc-900/40 border border-white/[0.05] rounded-2xl flex items-center justify-between px-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-zinc-800/60 rounded-2xl"></div>
              <div className="space-y-1.5">
                <div className="h-4 w-36 bg-zinc-800/70 rounded-lg"></div>
                <div className="h-3 w-24 bg-zinc-800/40 rounded-md"></div>
              </div>
            </div>
            <div className="h-5 w-24 bg-zinc-800/60 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
