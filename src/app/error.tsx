"use client";

import * as React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-zinc-100 selection:bg-blue-500/30">
      <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 text-rose-400">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h1 className="text-2xl font-bold text-white mb-2">
        Terjadi Kendala Memuat Aplikasi
      </h1>

      <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
        Aplikasi baru saja menerima pembaruan versi. Silakan muat ulang browser untuk menyegarkan cache.
      </p>

      <Button
        onClick={() => window.location.reload()}
        className="gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 h-11 rounded-xl"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Muat Ulang Halaman</span>
      </Button>
    </div>
  );
}
