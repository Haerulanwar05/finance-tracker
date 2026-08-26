"use client";

import * as React from "react";

export default function GlobalErrorRoot({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Critical Root Layout error caught:", error);
    try {
      const reloadKey = "ft_root_layout_error_reload";
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();
      const isWithinCooldown = lastReload && now - parseInt(lastReload, 10) < 15000;

      if (!isWithinCooldown && typeof window !== "undefined") {
        sessionStorage.setItem(reloadKey, now.toString());
        const timer = setTimeout(() => {
          window.location.reload();
        }, 250);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, [error]);

  return (
    <html lang="id">
      <body className="bg-[#08080a] text-zinc-100 min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0c0c0f] border border-white/[0.08] text-center shadow-2xl">
          <div className="h-14 w-14 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">
            FT
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Menyinkronkan Aplikasi</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Versi sistem baru saja diperbarui. Sedang menyegarkan antarmuka...
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                try {
                  sessionStorage.removeItem("ft_root_layout_error_reload");
                } catch {}
                window.location.reload();
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              Muat Ulang
            </button>
            <button
              onClick={() => reset()}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] text-zinc-300 font-medium text-xs hover:bg-white/[0.1] transition-colors cursor-pointer"
            >
              Coba Render Ulang
            </button>
          </div>
          {error?.digest && (
            <p className="text-[10px] text-zinc-600 font-mono mt-5">
              Kode Diagnostik: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
