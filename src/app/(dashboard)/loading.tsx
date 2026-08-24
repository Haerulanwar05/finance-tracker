export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-1 sm:p-2">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-zinc-800/80 rounded-2xl"></div>
          <div className="h-4 w-72 bg-zinc-800/50 rounded-xl"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-zinc-800/60 rounded-2xl"></div>
          <div className="h-10 w-32 bg-zinc-800/60 rounded-2xl"></div>
        </div>
      </div>

      {/* Hero Bento Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="h-36 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl"></div>
        <div className="h-36 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl"></div>
        <div className="h-36 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl"></div>
        <div className="h-36 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl"></div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-80 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl"></div>
        <div className="lg:col-span-5 h-80 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl"></div>
      </div>
    </div>
  );
}
