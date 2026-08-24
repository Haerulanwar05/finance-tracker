"use client";

import * as React from "react";
import { TrendingUp, ArrowRightLeft, Plus } from "lucide-react";
import { formatRupiah } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { usePrivacy } from "@/context/privacy-context";

interface NetWorthCardProps {
  netWorth: number;
  accountsCount: number;
  onOpenAddModal: () => void;
  onOpenTransferModal: () => void;
}

export function NetWorthCard({
  netWorth,
  accountsCount,
  onOpenAddModal,
  onOpenTransferModal,
}: NetWorthCardProps) {
  const { isPrivate } = usePrivacy();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800/90 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950/80 backdrop-blur-2xl p-5 sm:p-8 text-zinc-100 shadow-2xl shadow-black/40">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mb-20" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        <div className="space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Total Kekayaan Bersih (Net Worth)</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-white font-mono tabular-nums truncate">
              {isPrivate ? "Rp ••••••••" : formatRupiah(netWorth)}
            </h2>
            <p className="text-xs text-zinc-400">
              Akumulasi saldo riil dari <span className="text-zinc-200 font-semibold">{accountsCount} akun/dompet aktif</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 w-full sm:w-auto pt-1 md:pt-0">
          <Button
            onClick={onOpenTransferModal}
            variant="secondary"
            size="md"
            className="border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 group cursor-pointer h-10 sm:h-10 text-xs sm:text-sm font-semibold"
          >
            <ArrowRightLeft className="h-4 w-4 text-purple-400 mr-1.5 transition-transform group-hover:rotate-180 duration-300" />
            <span>Pindah Saldo</span>
          </Button>

          <Button
            onClick={onOpenAddModal}
            size="md"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/25 group cursor-pointer h-10 sm:h-10 text-xs sm:text-sm"
          >
            <Plus className="h-4 w-4 mr-1.5 transition-transform group-hover:rotate-90 duration-200" />
            <span>Tambah Akun</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
