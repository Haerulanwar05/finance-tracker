"use client";

import * as React from "react";
import {
  TrendingUp,
  TrendingDown,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import { formatRupiah } from "@/lib/currency";
import { usePrivacy } from "@/context/privacy-context";
import { MonthlySpendingBudgetInfo } from "../actions";
import { EditBudgetModal } from "./edit-budget-modal";

interface BentoMetricsProps {
  netWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
  incomeGrowthPct: number;
  expenseGrowthPct: number;
  monthlyBudget: MonthlySpendingBudgetInfo;
  safeToSpend?: {
    dailyAmount: number;
    monthlyRemaining: number;
    daysRemaining: number;
    status: "SAFE" | "WARNING" | "CRITICAL";
  };
}

export function BentoMetrics({
  netWorth,
  monthlyIncome,
  monthlyExpense,
  incomeGrowthPct,
  expenseGrowthPct,
  monthlyBudget,
}: BentoMetricsProps) {
  const { isPrivate } = usePrivacy();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // Status configuration for Budget & Safe-to-Spend
  const statusConfig = {
    SAFE: {
      label: "Batas Aman",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    WARNING: {
      label: "Waspada",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      dot: "bg-amber-400",
    },
    CRITICAL: {
      label: "Batas Kritis",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      dot: "bg-rose-400",
    },
  }[monthlyBudget.status];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Net Worth */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/85 via-zinc-900/50 to-zinc-950/90 backdrop-blur-2xl p-5 space-y-3 flex flex-col justify-between group hover:border-white/[0.2] transition-[border-color,transform,box-shadow] duration-200 shadow-[0_10px_30px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-zinc-400">Total Kekayaan Bersih</span>
            <div className="h-8.5 w-8.5 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-zinc-200 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform">
              <Landmark className="h-4 w-4 text-zinc-200" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {isPrivate ? "Rp ••••••••" : formatRupiah(netWorth)}
            </p>
            <p className="text-[11px] text-zinc-400">Saldo gabungan seluruh rekening aktif</p>
          </div>
        </div>

        {/* 2. Pemasukan Bulan Ini */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/85 via-zinc-900/50 to-zinc-950/90 backdrop-blur-2xl p-5 space-y-3 flex flex-col justify-between group hover:border-emerald-500/30 transition-[border-color,transform,box-shadow] duration-200 shadow-[0_10px_30px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-zinc-400">Pemasukan Bulan Ini</span>
            <div className="h-8.5 w-8.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums tracking-tight">
              {isPrivate ? "Rp ••••••••" : `+${formatRupiah(monthlyIncome)}`}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-full text-[10px] border ${incomeGrowthPct >= 0 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20"}`}>
                {incomeGrowthPct >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {incomeGrowthPct >= 0 ? `+${incomeGrowthPct}%` : `${incomeGrowthPct}%`}
              </span>
              <span>vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* 3. Pengeluaran Bulan Ini */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/85 via-zinc-900/50 to-zinc-950/90 backdrop-blur-2xl p-5 space-y-3 flex flex-col justify-between group hover:border-rose-500/30 transition-[border-color,transform,box-shadow] duration-200 shadow-[0_10px_30px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-zinc-400">Pengeluaran Bulan Ini</span>
            <div className="h-8.5 w-8.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(244,63,94,0.2)] group-hover:scale-105 transition-transform">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tabular-nums tracking-tight">
              {isPrivate ? "Rp ••••••••" : `-${formatRupiah(monthlyExpense)}`}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-full text-[10px] border ${expenseGrowthPct <= 0 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20"}`}>
                {expenseGrowthPct >= 0 ? `+${expenseGrowthPct}%` : `${expenseGrowthPct}%`}
              </span>
              <span>vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* 4. Batas Belanja Bulanan */}
        <div
          onClick={() => setIsEditModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsEditModalOpen(true);
            }
          }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/85 via-zinc-900/50 to-zinc-950/90 backdrop-blur-2xl p-5 space-y-3 flex flex-col justify-between group hover:border-emerald-500/30 transition-[border-color,transform,box-shadow] duration-200 shadow-[0_10px_30px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-zinc-400">Batas Belanja Bulanan</span>
            <div
              title="Klik untuk mengatur batas belanja"
              className="h-8.5 w-8.5 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-zinc-300 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] group-hover:scale-105 group-hover:text-white transition-all"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                {isPrivate
                  ? "Rp ••••••••"
                  : monthlyBudget.isCustom
                  ? formatRupiah(monthlyBudget.monthlyLimit)
                  : formatRupiah(5000000)}
              </p>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold inline-flex items-center gap-1.5 shrink-0 ${statusConfig.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot} animate-pulse`} />
                <span>{statusConfig.label}</span>
              </span>
            </div>

            {/* High-Craft Slim Progress Meter */}
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    monthlyBudget.usagePercentage >= 90
                      ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                      : monthlyBudget.usagePercentage >= 75
                      ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                      : "bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  }`}
                  style={{ width: `${Math.min(100, monthlyBudget.usagePercentage)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                <span>
                  Sisa <span className="font-semibold text-zinc-200 font-mono">{isPrivate ? "•••" : formatRupiah(monthlyBudget.monthlyRemaining)}</span>
                </span>
                <span className="text-zinc-400 font-mono">
                  {isPrivate ? "•••" : formatRupiah(monthlyBudget.dailySafeAmount)}/hr
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Budget Modal */}
      {isEditModalOpen && (
        <EditBudgetModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentLimit={monthlyBudget.monthlyLimit}
          daysRemaining={monthlyBudget.daysRemaining}
        />
      )}
    </>
  );
}
