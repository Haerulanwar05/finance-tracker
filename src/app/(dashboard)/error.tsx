"use client";

import * as React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
      <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 text-rose-400">
        <AlertCircle className="h-7 w-7" />
      </div>

      <h2 className="text-xl font-bold text-white mb-2">
        Gagal Memuat Halaman
      </h2>

      <p className="text-xs text-zinc-400 max-w-md mb-6 leading-relaxed">
        Terjadi pembaruan sistem atau gangguan jaringan sesaat. Silakan muat ulang halaman ini untuk menyinkronkan data terbaru.
      </p>

      <div className="flex items-center gap-3">
        <Button
          onClick={() => {
            // Hard reload to refresh webpack chunks if a deployment just occurred
            window.location.reload();
          }}
          size="sm"
          className="gap-2 bg-blue-600 hover:bg-blue-500 text-white"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Muat Ulang Halaman</span>
        </Button>

        <Link href="/dashboard">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 border-zinc-800"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Overview</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
