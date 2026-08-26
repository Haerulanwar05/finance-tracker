export default function VaultsLoading() {
  return (
    <div className="space-y-6 animate-pulse p-1 sm:p-2">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-44 bg-zinc-800/80 rounded-2xl"></div>
          <div className="h-4 w-72 bg-zinc-800/50 rounded-xl"></div>
        </div>
        <div className="h-10 w-36 bg-emerald-500/20 rounded-2xl"></div>
      </div>

      {/* 3 Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-28 bg-zinc-900/60 border border-white/[0.06] rounded-3xl"></div>
        <div className="h-28 bg-zinc-900/60 border border-white/[0.06] rounded-3xl"></div>
        <div className="h-28 bg-zinc-900/60 border border-white/[0.06] rounded-3xl"></div>
      </div>

      {/* Grid of Vault Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 bg-zinc-900/50 border border-white/[0.06] rounded-3xl p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 bg-zinc-800/70 rounded-2xl"></div>
              <div className="h-6 w-20 bg-zinc-800/50 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-5 w-36 bg-zinc-800/70 rounded-lg"></div>
              <div className="h-3 w-full bg-zinc-800/40 rounded-full"></div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-4 w-24 bg-zinc-800/50 rounded-md"></div>
              <div className="h-8 w-24 bg-zinc-800/60 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
