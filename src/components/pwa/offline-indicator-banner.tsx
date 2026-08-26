"use client";

import * as React from "react";
import { CloudOff, RefreshCw, Layers, CheckCircle2, Wifi } from "lucide-react";
import { useOffline } from "@/context/offline-context";
import { OfflineQueueModal } from "./offline-queue-modal";

export function OfflineIndicatorBanner() {
  const { isOnline, offlineCount, isSyncing, syncNow, syncResult, dismissSyncResult } =
    useOffline();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [showReconnectedToast, setShowReconnectedToast] = React.useState(false);

  // Auto-dismiss sync result after 4 seconds
  React.useEffect(() => {
    if (syncResult) {
      const timer = setTimeout(() => {
        dismissSyncResult();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [syncResult, dismissSyncResult]);

  // Show reconnected toast briefly when switching back online
  const prevOnlineRef = React.useRef(isOnline);
  React.useEffect(() => {
    if (!prevOnlineRef.current && isOnline) {
      setShowReconnectedToast(true);
      const timer = setTimeout(() => setShowReconnectedToast(false), 3000);
      return () => clearTimeout(timer);
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline]);

  return (
    <>
      {/* 1. Offline Mode Floating Warning */}
      {!isOnline && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-xl shadow-xl shadow-black/50">
            <CloudOff className="h-3.5 w-3.5 animate-pulse text-amber-400" />
            <span>Mode Offline — Transaksi tersimpan aman di perangkat ini</span>
          </div>
        </div>
      )}

      {/* 2. Reconnected Toast */}
      {showReconnectedToast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-xl shadow-xl shadow-black/50">
            <Wifi className="h-3.5 w-3.5 text-emerald-400" />
            <span>Tersambung Kembali ke Internet</span>
          </div>
        </div>
      )}

      {/* 3. Sync Result Success Notification */}
      {syncResult && syncResult.synced > 0 && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold backdrop-blur-2xl shadow-xl shadow-black/60">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{syncResult.synced} transaksi offline berhasil disinkronkan ke cloud!</span>
          </div>
        </div>
      )}

      {/* 4. Pending Queue Floating Pill (When there are unsynced items) */}
      {offlineCount > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-4 z-40 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-2 p-2 px-3 rounded-2xl bg-zinc-950/90 border border-amber-500/30 backdrop-blur-2xl shadow-2xl text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Layers className="h-3.5 w-3.5" />
              <span>{offlineCount} Antrean</span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[11px] text-zinc-300 hover:text-white px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-medium transition-colors cursor-pointer"
            >
              Lihat
            </button>

            {isOnline && (
              <button
                onClick={() => syncNow()}
                disabled={isSyncing}
                title="Sinkronkan Sekarang"
                className="text-[11px] text-emerald-400 hover:text-emerald-300 px-2 py-0.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Sync..." : "Sync"}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Queue Modal */}
      <OfflineQueueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}