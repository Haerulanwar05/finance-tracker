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
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-blue-950/20 via-zinc-900/70 to-zinc-950/90 backdrop-blur-xl p-5 space-y-3 flex flex-col justify-between group hover:border-blue-500/40 hover:scale-[1.01] transition-all duration-200 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Total Kekayaan Bersih</span>
            <div className="h-9 w-9 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-sm shadow-blue-500/10 group-hover:scale-110 transition-transform">
              <Landmark className="h-4.5 w-4.5" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {isPrivate ? "Rp ••••••••" : formatRupiah(netWorth)}
            </p>
            <p className="text-[11px] text-zinc-500">Saldo gabungan seluruh rekening aktif</p>
          </div>
        </div>

        {/* 2. Pemasukan Bulan Ini */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-emerald-950/20 via-zinc-900/70 to-zinc-950/90 backdrop-blur-xl p-5 space-y-3 flex flex-col justify-between group hover:border-emerald-500/40 hover:scale-[1.01] transition-all duration-200 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Pemasukan Bulan Ini</span>
            <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-sm shadow-emerald-500/10 group-hover:scale-110 transition-transform">
              <ArrowDownLeft className="h-4.5 w-4.5" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums tracking-tight">
              {isPrivate ? "Rp ••••••••" : `+${formatRupiah(monthlyIncome)}`}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className={`flex items-center font-semibold ${incomeGrowthPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {incomeGrowthPct >= 0 ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                {incomeGrowthPct >= 0 ? `+${incomeGrowthPct}%` : `${incomeGrowthPct}%`}
              </span>
              <span>vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* 3. Pengeluaran Bulan Ini */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-rose-950/20 via-zinc-900/70 to-zinc-950/90 backdrop-blur-xl p-5 space-y-3 flex flex-col justify-between group hover:border-rose-500/40 hover:scale-[1.01] transition-all duration-200 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Pengeluaran Bulan Ini</span>
            <div className="h-9 w-9 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-sm shadow-rose-500/10 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="h-4.5 w-4.5" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tabular-nums tracking-tight">
              {isPrivate ? "Rp ••••••••" : `-${formatRupiah(monthlyExpense)}`}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <span className={`flex items-center font-semibold ${expenseGrowthPct <= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {expenseGrowthPct >= 0 ? `+${expenseGrowthPct}%` : `${expenseGrowthPct}%`}
              </span>
              <span>vs bulan lalu</span>
            </div>
          </div>
        </div>

        {/* 4. Batas Belanja Bulanan (Minimalis, Elegan & Simetris) */}
        <div
          onClick={() => setIsEditModalOpen(true)}
          className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-indigo-950/20 via-zinc-900/70 to-zinc-950/90 backdrop-blur-xl p-5 space-y-3 flex flex-col justify-between group hover:border-indigo-500/40 hover:scale-[1.01] transition-all duration-200 shadow-lg cursor-pointer"
        >
          {/* Card Header matching Cards 1, 2, 3 */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Batas Belanja Bulanan</span>
            <div
              title="Klik untuk mengatur batas belanja"
              className="h-9 w-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-sm shadow-indigo-500/10 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all"
            >
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </div>
          </div>

          {/* Primary Metric & Progress */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                {isPrivate
                  ? "Rp ••••••••"
                  : monthlyBudget.isCustom
                  ? formatRupiah(monthlyBudget.monthlyLimit)
                  : formatRupiah(5000000)}
              </p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold inline-flex items-center gap-1 shrink-0 ${statusConfig.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot} animate-pulse`} />
                <span>{statusConfig.label}</span>
              </span>
            </div>

            {/* Minimal Slim Progress Meter */}
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    monthlyBudget.usagePercentage >= 90
                      ? "bg-rose-500"
                      : monthlyBudget.usagePercentage >= 75
                      ? "bg-amber-400"
                      : "bg-gradient-to-r from-indigo-500 to-cyan-400"
                  }`}
                  style={{ width: `${Math.min(100, monthlyBudget.usagePercentage)}%` }}
                />
              </div>

              {/* Clean Minimalist Subline */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                <span>
                  Sisa {isPrivate ? "•••" : formatRupiah(monthlyBudget.monthlyRemaining)}
                </span>
                <span className="text-zinc-500">
                  Aman {isPrivate ? "•••" : formatRupiah(monthlyBudget.dailySafeAmount)}/hr
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
