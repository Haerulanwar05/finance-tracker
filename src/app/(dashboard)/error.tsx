"use client";

import * as React from "react";
import { AlertCircle, RefreshCw, RotateCcw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isAutoReloading, setIsAutoReloading] = React.useState(false);

  React.useEffect(() => {
    console.error("Dashboard error boundary caught:", error);

    // Auto-recover immediately on chunk mismatch / deployment refresh
    // Guarded by a 15-second cooldown to prevent infinite reload loops
    try {
      const RELOAD_KEY = "dashboard_last_auto_reload";
      const lastReload = sessionStorage.getItem(RELOAD_KEY);
      const now = Date.now();
      const isWithinCooldown = lastReload && now - parseInt(lastReload, 10) < 15000;

      if (!isWithinCooldown && typeof window !== "undefined") {
        sessionStorage.setItem(RELOAD_KEY, now.toString());
        setIsAutoReloading(true);
        const timer = setTimeout(() => {
          window.location.reload();
        }, 200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage access disabled in restricted iframes
    }
  }, [error]);

  const handleRefreshCurrent = () => {
    try {
      sessionStorage.removeItem("dashboard_last_auto_reload");
    } catch {}
    window.location.reload();
  };

  const handleGoDashboard = () => {
    try {
      sessionStorage.removeItem("dashboard_last_auto_reload");
    } catch {}
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="relative mb-5">
        <div className="h-16 w-16 rounded-3xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 shadow-[0_0_24px_rgba(244,63,94,0.15)]">
          <AlertCircle className="h-8 w-8" />
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-tight">
        {isAutoReloading ? "Menyegarkan Versi Aplikasi..." : "Gagal Memuat Halaman"}
      </h2>

      <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
        {isAutoReloading
          ? "Mendeteksi pembaruan versi atau sinkronisasi database baru. Sedang memuat ulang secara otomatis..."
          : "Sistem baru saja diperbarui atau terjadi jeda sinkronisasi database. Klik tombol di bawah untuk menyegarkan dan memuat ringkasan finansial Anda."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={handleRefreshCurrent}
          size="sm"
          className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950/40 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Muat Ulang Halaman</span>
        </Button>

        <Button
          onClick={() => reset()}
          variant="secondary"
          size="sm"
          className="gap-2 border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4 text-zinc-400" />
          <span>Coba Render Ulang</span>
        </Button>

        <Button
          onClick={handleGoDashboard}
          variant="outline"
          size="sm"
          className="gap-2 border-white/[0.08] bg-transparent hover:bg-white/[0.06] text-zinc-300 cursor-pointer"
        >
          <LayoutDashboard className="h-4 w-4 text-zinc-400" />
          <span>Ke Overview</span>
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
