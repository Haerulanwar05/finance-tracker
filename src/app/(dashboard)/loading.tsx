export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Top Header Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-zinc-800/60 rounded-xl"></div>
          <div className="h-4 w-72 bg-zinc-800/40 rounded-lg"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-zinc-800/60 rounded-xl"></div>
          <div className="h-9 w-28 bg-zinc-800/60 rounded-xl"></div>
        </div>
      </div>

      {/* Hero Bento Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-40 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl"></div>
        <div className="h-40 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl"></div>
        <div className="h-40 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl"></div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl"></div>
        <div className="h-72 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl"></div>
      </div>
    </div>
  );
}
