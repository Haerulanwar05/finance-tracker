"use client";

import * as React from "react";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Dashboard error caught by boundary:", error);

    // Auto-recover once if chunk loading failed due to fresh Vercel deployment
    const isChunkMismatch =
      error?.message?.includes("ChunkLoadError") ||
      error?.message?.includes("Loading chunk") ||
      error?.message?.includes("Failed to fetch");

    const hasReloaded = sessionStorage.getItem("dashboard_error_reload");
    if (isChunkMismatch && !hasReloaded) {
      sessionStorage.setItem("dashboard_error_reload", "true");
      window.location.reload();
    }
  }, [error]);

  const handleHardRefresh = () => {
    sessionStorage.removeItem("dashboard_error_reload");
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="relative mb-5">
        <div className="h-16 w-16 rounded-3xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.15)]">
          <AlertCircle className="h-8 w-8" />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-tight">
        Gagal Memuat Halaman
      </h2>

      <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
        Sistem baru saja diperbarui atau terjadi jeda sinkronisasi database. Klik tombol di bawah untuk menyegarkan dan memuat ringkasan finansial Anda.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={handleHardRefresh}
          size="sm"
          className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950/40"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Muat Ulang Halaman</span>
        </Button>

        <Button
          onClick={() => reset()}
          variant="secondary"
          size="sm"
          className="gap-2 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-200"
        >
          <LayoutDashboard className="h-4 w-4 text-zinc-400" />
          <span>Coba Render Ulang</span>
        </Button>
      </div>

      {error?.digest && (
        <p className="text-[10px] text-zinc-600 font-mono mt-6">
          Kode Diagnostik: {error.digest}
        </p>
      )}
    </div>
  );
}
