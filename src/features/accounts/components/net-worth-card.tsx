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
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950/95 backdrop-blur-2xl p-6 sm:p-8 text-zinc-100 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.12)] ring-1 ring-white/[0.03]">
      {/* Subtle Specular Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-[11px] font-semibold text-zinc-300 tracking-wide uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span>Total Kekayaan Bersih</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-white font-mono tabular-nums truncate">
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
            className="group cursor-pointer h-10 sm:h-10 text-xs sm:text-sm font-semibold"
          >
            <ArrowRightLeft className="h-4 w-4 text-zinc-400 mr-1.5 transition-transform group-hover:rotate-180 duration-300" />
            <span>Pindah Saldo</span>
          </Button>

          <Button
            onClick={onOpenAddModal}
            variant="emerald"
            size="md"
            className="group cursor-pointer h-10 sm:h-10 text-xs sm:text-sm font-bold"
          >
            <Plus className="h-4 w-4 mr-1.5 transition-transform group-hover:rotate-90 duration-200" />
            <span>Tambah Akun</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
