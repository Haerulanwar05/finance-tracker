"use client";

import * as React from "react";
import { Download, X, Smartphone, Sparkles, Share, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "financetracker_pwa_install_dismissed_until";

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(false);
  const [showIOSModal, setShowIOSModal] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already installed as standalone
    const isRunningStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true;

    setIsStandalone(isRunningStandalone);
    if (isRunningStandalone) return;

    // Check dismissal cooldown
    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for Chrome/Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If on iOS and not standalone, show banner after a small delay
    if (isIosDevice && !isRunningStandalone) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Cooldown 7 days
    const nextWeek = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, nextWeek.toString());
  };

  if (isStandalone || !showBanner) return null;

  return (
    <>
      {/* Floating Modern PWA Install Banner */}
      <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-zinc-950/90 backdrop-blur-2xl p-4 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 group">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10 pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">Pasang Aplikasi</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-0.5">
                  <Sparkles className="h-2.5 w-2.5" />
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                Akses cepat 1-klik di layar HP & catat offline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10 shrink-0">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs h-8 px-3 rounded-xl shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Pasang
            </Button>
            <button
              onClick={handleDismiss}
              className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Installation Instruction Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl shadow-black space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Smartphone className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Pasang di iPhone / iPad</h3>
              <p className="text-xs text-zinc-400">
                Ikuti 2 langkah mudah ini untuk menambahkan ke Layar Utama:
              </p>
            </div>

            <div className="space-y-2.5 text-left text-xs bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-zinc-800 flex items-center justify-center text-blue-400 shrink-0">
                  <Share className="h-4 w-4" />
                </div>
                <span>1. Ketuk tombol <strong>Bagikan (Share)</strong> di bilah navigasi Safari.</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <PlusSquare className="h-4 w-4" />
                </div>
                <span>2. Pilih opsi <strong>"Tambah ke Layar Utama"</strong>.</span>
              </div>
            </div>

            <Button
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl h-10 cursor-pointer"
              onClick={() => setShowIOSModal(false)}
            >
              Saya Mengerti
            </Button>
          </div>
        </div>
      )}
    </>
  );
}