"use client";

import * as React from "react";
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
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
      icon: ShieldCheck,
    },
    WARNING: {
      label: "Perlu Hati-hati",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      icon: AlertTriangle,
    },
    CRITICAL: {
      label: "Batas Kritis",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      icon: AlertOctagon,
    },
  }[monthlyBudget.status];

  const StatusIcon = statusConfig.icon;

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

        {/* 4. Batas Belanja Bulanan & Harian (User-Determined) */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/40 via-zinc-900/80 to-zinc-950/90 backdrop-blur-xl p-5 flex flex-col justify-between group hover:border-indigo-500/50 hover:scale-[1.01] transition-all duration-200 shadow-lg space-y-3.5">
          {/* Card Header with Edit Trigger */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-xs font-bold text-zinc-200">Batas Belanja Bulanan</span>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>{monthlyBudget.isCustom ? "Ubah" : "Atur"}</span>
            </button>
          </div>

          {/* Primary Metric: Batas Belanja Bulanan */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <p className="text-xl sm:text-2xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                {isPrivate
                  ? "Rp ••••••••"
                  : monthlyBudget.isCustom
                  ? formatRupiah(monthlyBudget.monthlyLimit)
                  : "Belum Diatur"}
                {monthlyBudget.isCustom && (
                  <span className="text-xs font-normal text-zinc-400 font-sans"> / bln</span>
                )}
              </p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium flex items-center gap-1 ${statusConfig.color}`}>
                <StatusIcon className="h-2.5 w-2.5" />
                <span>{statusConfig.label}</span>
              </span>
            </div>

            {/* Progress meter bar */}
            {monthlyBudget.isCustom && (
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      monthlyBudget.usagePercentage >= 90
                        ? "bg-rose-500"
                        : monthlyBudget.usagePercentage >= 75
                        ? "bg-amber-400"
                        : "bg-indigo-500"
                    }`}
                    style={{ width: `${Math.min(100, monthlyBudget.usagePercentage)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Terpakai {isPrivate ? "•••" : formatRupiah(monthlyBudget.monthlySpent)} ({monthlyBudget.usagePercentage}%)</span>
                  <span>Sisa {isPrivate ? "•••" : formatRupiah(monthlyBudget.monthlyRemaining)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Secondary Sub-Metric DIRECTLY BELOW: Batas Belanja Harian (Safe-to-Spend) */}
          <div className="pt-2.5 border-t border-zinc-800/80 space-y-1 bg-zinc-950/40 -mx-5 -mb-5 p-3.5 px-5 rounded-b-3xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-indigo-300">
                Batas Belanja Harian
              </span>
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                <Calendar className="h-3 w-3 text-zinc-500" />
                <span>Rata-rata 30 hari</span>
              </span>
            </div>
            <p className="text-base sm:text-lg font-extrabold text-indigo-200 font-mono tabular-nums">
              {isPrivate ? "Rp •••••" : formatRupiah(monthlyBudget.dailySafeAmount)}
              <span className="text-xs font-normal text-zinc-400 font-sans"> / hari</span>
            </p>
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
