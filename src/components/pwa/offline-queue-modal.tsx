"use client";

import * as React from "react";
import { X, CloudOff, RefreshCw, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { useOffline } from "@/context/offline-context";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/currency";

interface OfflineQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OfflineQueueModal({ isOpen, onClose }: OfflineQueueModalProps) {
  const {
    offlineQueue,
    isOnline,
    isSyncing,
    syncNow,
    removeOfflineTx,
    clearQueue,
    syncResult,
  } = useOffline();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl shadow-black space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <CloudOff className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Antrean Transaksi Offline
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                  {offlineQueue.length} Tertunda
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Transaksi disimpan di HP & siap disinkronkan ke server.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sync Result Alert */}
        {syncResult && (
          <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-2 ${
            syncResult.failed === 0
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
          }`}>
            <div className="flex items-center gap-2">
              {syncResult.failed === 0 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              )}
              <span>
                {syncResult.synced} transaksi berhasil disinkronkan
                {syncResult.failed > 0 && `, ${syncResult.failed} gagal dicatat.`}
              </span>
            </div>
          </div>
        )}

        {/* Queue Items List */}
        <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
          {offlineQueue.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-400/80 mx-auto" />
              <p className="text-sm font-semibold text-zinc-300">Antrean Bersih!</p>
              <p className="text-xs text-zinc-500">Semua transaksi offline Anda sudah tersinkronisasi ke cloud.</p>
            </div>
          ) : (
            offlineQueue.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3 group hover:border-zinc-700 transition-all"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold uppercase ${
                      item.type === "EXPENSE"
                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                        : item.type === "INCOME"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                    }`}>
                      {item.type}
                    </span>
                    <p className="text-xs font-semibold text-zinc-200 truncate">
                      {item.description || "Tanpa Keterangan"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <span>{new Date(item.date).toLocaleDateString("id-ID")}</span>
                    <span>•</span>
                    <span className="font-mono font-bold text-white">
                      {formatRupiah(item.amount)}
                    </span>
                    {item.lastError && (
                      <span className="text-rose-400 text-[10px] truncate max-w-[140px]">
                        ({item.lastError})
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeOfflineTx(item.id)}
                  title="Hapus dari antrean"
                  className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-3">
          {offlineQueue.length > 0 ? (
            <button
              onClick={clearQueue}
              className="text-xs text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              Kosongkan Antrean
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl border-zinc-800 hover:bg-zinc-900 text-xs"
            >
              Tutup
            </Button>
            {offlineQueue.length > 0 && (
              <Button
                size="sm"
                disabled={!isOnline || isSyncing}
                onClick={syncNow}
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
                {isSyncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}