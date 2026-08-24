"use client";

import * as React from "react";
import { Download, X, Smartphone, Laptop, Sparkles, Share, PlusSquare, Monitor, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "financetracker_pwa_dismissed_session";

function downloadDesktopShortcut() {
  if (typeof window === "undefined") return;
  const currentOrigin = window.location.origin || "https://finance-tracker-two-teal-14.vercel.app";
  const content = `[InternetShortcut]\r\nURL=${currentOrigin}/dashboard\r\nIconFile=${currentOrigin}/favicon.ico\r\nIconIndex=0\r\n`;
  const blob = new Blob([content], { type: "application/x-msdownload" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "FinanceTracker.url";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const promptRef = React.useRef<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(false);
  const [showGuideModal, setShowGuideModal] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already installed as standalone
    const isRunningStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true;

    setIsStandalone(isRunningStandalone);
    if (isRunningStandalone) return;

    // Detect Device Type
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

    setIsIOS(isIosDevice);
    setIsDesktop(!isMobileDevice);

    // Read global early captured prompt if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).__pwaInstallPrompt) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const earlyPrompt = (window as any).__pwaInstallPrompt as BeforeInstallPromptEvent;
      promptRef.current = earlyPrompt;
      setDeferredPrompt(earlyPrompt);
    }

    // Listen for custom trigger from sidebar or settings
    const handleOpenCustom = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const prompt = promptRef.current || (window as any).__pwaInstallPrompt;
      if (prompt) {
        try {
          await prompt.prompt();
          const choiceResult = await prompt.userChoice;
          if (choiceResult.outcome === "accepted") {
            setShowBanner(false);
            setShowGuideModal(false);
            promptRef.current = null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).__pwaInstallPrompt = null;
            setDeferredPrompt(null);
            setIsInstalled(true);
            return;
          }
        } catch {
          // Fallback to guide modal
        }
      }
      setShowGuideModal(true);
    };
    window.addEventListener("open-pwa-install-modal", handleOpenCustom);

    // Listen for Chrome/Edge/Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      promptRef.current = promptEvent;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__pwaInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      // Only show banner if not dismissed in current session
      const isDismissed = sessionStorage.getItem(DISMISS_KEY);
      if (!isDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handlePromptReady = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).__pwaInstallPrompt) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const earlyPrompt = (window as any).__pwaInstallPrompt as BeforeInstallPromptEvent;
        promptRef.current = earlyPrompt;
        setDeferredPrompt(earlyPrompt);
      }
    };
    window.addEventListener("pwa-prompt-ready", handlePromptReady);

    const handleAppInstalled = () => {
      setShowBanner(false);
      setShowGuideModal(false);
      setIsInstalled(true);
      promptRef.current = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__pwaInstallPrompt = null;
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    // Show banner after brief delay on iOS or Desktop if not dismissed in current session
    const isDismissed = sessionStorage.getItem(DISMISS_KEY);
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("open-pwa-install-modal", handleOpenCustom);
        window.removeEventListener("pwa-prompt-ready", handlePromptReady);
        window.removeEventListener("appinstalled", handleAppInstalled);
        clearTimeout(timer);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("open-pwa-install-modal", handleOpenCustom);
      window.removeEventListener("pwa-prompt-ready", handlePromptReady);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prompt = deferredPrompt || promptRef.current || (window as any).__pwaInstallPrompt;
    if (prompt) {
      try {
        await prompt.prompt();
        const choiceResult = await prompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          setShowBanner(false);
          setShowGuideModal(false);
          promptRef.current = null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).__pwaInstallPrompt = null;
          setDeferredPrompt(null);
          setIsInstalled(true);
          return;
        }
      } catch {
        setShowGuideModal(true);
      }
    } else {
      // Show manual guide modal (iOS Safari or Desktop Chrome/Edge)
      setShowGuideModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem(DISMISS_KEY, "true");
  };

  if (isStandalone || isInstalled) return null;

  return (
    <>
      {/* Floating Modern PWA Install Banner */}
      {showBanner && (
        <div className="fixed bottom-24 md:bottom-6 right-4 left-4 md:left-auto md:max-w-lg z-40 animate-in slide-in-from-bottom-6 duration-300">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-zinc-950/90 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl shadow-black/90 ring-1 ring-emerald-500/20 group">
            {/* Subtle Ambient Glow Effect */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
              {/* Left Content */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                {/* Dual Device Icon Badge */}
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-blue-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                  <div className="relative flex items-center justify-center">
                    <Laptop className="h-5 w-5 text-emerald-400" />
                    <Smartphone className="h-3.5 w-3.5 text-teal-300 absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-0.5" />
                  </div>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center flex-wrap gap-1.5">
                    <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                      Pasang FinanceTracker
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5 text-emerald-400" />
                      HP & PC/Laptop
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed font-normal">
                    Pasang di layar HP atau Laptop untuk akses kilat 1-klik dan tetap bisa catat transaksi saat offline.
                  </p>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Button
                  size="sm"
                  onClick={handleInstallClick}
                  className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-bold text-xs h-8.5 px-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Pasang Sekarang
                </Button>
                <button
                  onClick={handleDismiss}
                  className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer"
                  title="Tutup"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Device Installation Instruction Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  {isIOS ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {isIOS ? "Pasang di iPhone / iPad" : "Pasang di Laptop / Komputer PC"}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {isIOS ? "Akses via Apple Safari" : "Aplikasi Mandiri Desktop"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGuideModal(false)}
                className="text-zinc-500 hover:text-white p-1.5 rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Instruction Steps / Direct Action */}
            {isIOS ? (
              <div className="space-y-3 text-xs bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-zinc-800 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Share className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white">1. Ketuk Tombol Bagikan (Share)</p>
                    <p className="text-zinc-400 text-[11px]">Buka Safari, lalu ketuk ikon Bagikan di bilah menu bawah.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <PlusSquare className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white">2. Pilih "Tambah ke Layar Utama"</p>
                    <p className="text-zinc-400 text-[11px]">Gulir ke bawah dan ketuk opsi <em>Add to Home Screen</em>.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {/* Direct Desktop Shortcut Download Option */}
                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">Unduh Pintasan Desktop Langsung</p>
                    <p className="text-[11px] text-zinc-400">Download file pintasan `.url` ke desktop PC / laptop Anda.</p>
                  </div>
                  <Button
                    type="button"
                    onClick={downloadDesktopShortcut}
                    className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl h-10 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    <Download className="h-4 w-4" />
                    <span>Unduh File Pintasan (FinanceTracker.url)</span>
                  </Button>
                </div>

                {/* Browser Address Bar Quick Info */}
                <div className="text-[11px] text-zinc-400 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800/50 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Anda juga dapat mengklik ikon <strong>Install (📥)</strong> di ujung kanan bilah alamat (URL bar) Google Chrome / Microsoft Edge.
                  </span>
                </div>
              </div>
            )}

            <Button
              variant="ghost"
              className="w-full text-zinc-400 hover:text-white rounded-xl h-9 text-xs cursor-pointer"
              onClick={() => setShowGuideModal(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </>
  );
}