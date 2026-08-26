"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isAutoReloading, setIsAutoReloading] = React.useState(false);

  React.useEffect(() => {
    console.error("Global error boundary caught:", error);

    // Auto-recover immediately on chunk mismatch / fresh Vercel deployment
    // Guarded by 15-second cooldown to prevent reload loops
    try {
      const reloadKey = "ft_global_last_auto_reload";
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();
      const isWithinCooldown = lastReload && now - parseInt(lastReload, 10) < 15000;

      if (!isWithinCooldown && typeof window !== "undefined") {
        sessionStorage.setItem(reloadKey, now.toString());
        setIsAutoReloading(true);
        const timer = setTimeout(() => {
          window.location.reload();
        }, 200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, [error]);

  const handleManualReload = () => {
    try {
      sessionStorage.removeItem("ft_global_last_auto_reload");
    } catch {}
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center p-6 text-center text-zinc-100 selection:bg-emerald-500/30">
      <div className="w-full max-w-md p-8 rounded-3xl border border-white/[0.09] bg-[#0c0c0f]/90 backdrop-blur-2xl shadow-[0_20px_50px_-8px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.08)] flex flex-col items-center">
        <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mb-5 text-amber-400 shadow-[inset_0_1px_0_0_rgba(245,158,11,0.2)]">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
          {isAutoReloading ? "Menyinkronkan Versi..." : "Terjadi Kendala Memuat Aplikasi"}
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed font-normal">
          {isAutoReloading
            ? "Mendeteksi rilis versi terbaru. Sedang menyegarkan cache aplikasi secara otomatis..."
            : "Aplikasi baru saja menerima pembaruan versi atau koneksi sedang disinkronkan. Silakan muat ulang halaman untuk menyegarkan cache."}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Button
            onClick={handleManualReload}
            className="w-full sm:flex-1 gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold h-10.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Muat Ulang Halaman</span>
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full gap-2 border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 h-10.5 rounded-xl cursor-pointer"
            >
              <Home className="h-4 w-4" />
              <span>Halaman Utama</span>
            </Button>
          </Link>
        </div>

        {error?.digest && (
          <p className="text-[10px] text-zinc-600 font-mono mt-5">
            Kode Diagnostik: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
