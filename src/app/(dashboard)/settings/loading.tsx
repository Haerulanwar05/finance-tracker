export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse p-1 sm:p-2 max-w-4xl">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-44 bg-zinc-800/80 rounded-2xl"></div>
        <div className="h-4 w-72 bg-zinc-800/50 rounded-xl"></div>
      </div>

      {/* Profile Section Skeleton */}
      <div className="h-56 bg-zinc-900/60 border border-white/[0.06] rounded-3xl p-6 space-y-4">
        <div className="h-5 w-36 bg-zinc-800/70 rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-10 bg-zinc-800/50 rounded-2xl"></div>
          <div className="h-10 bg-zinc-800/50 rounded-2xl"></div>
        </div>
        <div className="h-10 w-28 bg-emerald-500/20 rounded-2xl"></div>
      </div>

      {/* Budget Section Skeleton */}
      <div className="h-64 bg-zinc-900/60 border border-white/[0.06] rounded-3xl p-6 space-y-4">
        <div className="h-5 w-44 bg-zinc-800/70 rounded-lg"></div>
        <div className="h-10 w-full bg-zinc-800/50 rounded-2xl"></div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-zinc-800/40 rounded-xl"></div>
          <div className="h-8 w-20 bg-zinc-800/40 rounded-xl"></div>
          <div className="h-8 w-20 bg-zinc-800/40 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
