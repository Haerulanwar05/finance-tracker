"use client";

import * as React from "react";
import {
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  Target,
  Sparkles,
  Layers,
  ShoppingBag,
  SlidersHorizontal,
  Printer,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardAnalyticsData } from "@/features/dashboard/actions";
import { formatRupiah } from "@/lib/currency";
import { usePrivacy } from "@/context/privacy-context";
import { CashflowChart } from "@/features/dashboard/components/cashflow-chart";
import { CategoryDonutChart } from "@/features/dashboard/components/category-donut-chart";
import { EditBudgetModal } from "@/features/dashboard/components/edit-budget-modal";
import { printAnalyticsReport } from "../lib/print-analytics";

interface AnalyticsViewProps {
  data: DashboardAnalyticsData;
}

const PERIOD_OPTIONS = [
  { id: "THIS_MONTH", label: "Bulan Ini" },
  { id: "LAST_3_MONTHS", label: "3 Bulan" },
  { id: "LAST_6_MONTHS", label: "6 Bulan" },
  { id: "THIS_YEAR", label: "Tahun Ini" },
];

export function AnalyticsView({ data }: AnalyticsViewProps) {
  const { isPrivate } = usePrivacy();
  const [selectedPeriod, setSelectedPeriod] = React.useState("THIS_MONTH");
  const [isEditBudgetOpen, setIsEditBudgetOpen] = React.useState(false);

  // Top spending category
  const topCategory = data.categoryExpenses[0] || null;

  const currentPeriodLabel =
    PERIOD_OPTIONS.find((p) => p.id === selectedPeriod)?.label || "Bulan Ini";

  const handlePrint = () => {
    printAnalyticsReport({
      data,
      periodLabel: currentPeriodLabel,
      userName: data.userName || "Pengguna",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Analitik & Kesehatan Finansial</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
              Intelligence
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Evaluasi mendalam arus kas, rasio tabungan, dan efisiensi pengeluaran Anda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          {/* Print PDF Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 text-xs shadow-sm print:hidden cursor-pointer group h-10 sm:h-9"
          >
            <Printer className="h-4 w-4 text-blue-400 mr-1.5 transition-transform group-hover:scale-110" />
            <span>Cetak Dokumen</span>
          </Button>

          {/* Period Switcher Tabs */}
          <div className="flex items-center justify-between sm:justify-start p-1 bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-inner print:hidden overflow-x-auto">
            {PERIOD_OPTIONS.map((p) => {
              const isActive = selectedPeriod === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPeriod(p.id)}
                  className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/40 font-bold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. Four Financial Health KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Financial Health Score */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-blue-950/20 via-zinc-900/60 to-zinc-950/80 backdrop-blur-xl p-5 space-y-3 flex flex-col justify-between shadow-lg group hover:border-blue-500/40 hover:scale-[1.01] transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Skor Kesehatan Finansial</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
                {data.healthGrade}
              </span>
              <div className="h-7 w-7 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Activity className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
              {data.healthScore}
            </span>
            <span className="text-xs text-zinc-500 font-mono">/ 100</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                data.healthScore >= 75
                  ? "bg-emerald-400"
                  : data.healthScore >= 50
                  ? "bg-blue-400"
                  : "bg-amber-400"
              }`}
              style={{ width: `${data.healthScore}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Savings Rate */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-emerald-950/20 via-zinc-900/60 to-zinc-950/80 backdrop-blur-xl p-5 space-y-3 flex flex-col justify-between shadow-lg group hover:border-emerald-500/40 hover:scale-[1.01] transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Rasio Tabungan</span>
            <div className="h-8 w-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-sm shadow-emerald-500/10 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
              {data.savingsRate}%
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              {data.savingsRate >= 20 ? "✅ Di atas target ideal (20%)" : "⚠️ Di bawah target ideal (20%)"}
            </p>
          </div>

          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, data.savingsRate * 2)}%` }}
            />
          </div>
        </div>

        {/* KPI 3: User Determined Monthly Spending Budget & Sub-Daily Limit */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/30 via-zinc-900/60 to-zinc-950/80 backdrop-blur-xl p-5 space-y-3 flex flex-col justify-between shadow-lg group hover:border-indigo-500/50 hover:scale-[1.01] transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">Batas Belanja Bulanan</span>
            <button
              onClick={() => setIsEditBudgetOpen(true)}
              className="text-[10px] font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="h-2.5 w-2.5" />
              <span>{data.monthlyBudget.isCustom ? "Ubah" : "Atur"}</span>
            </button>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {isPrivate
                ? "Rp ••••••••"
                : data.monthlyBudget.isCustom
                ? formatRupiah(data.monthlyBudget.monthlyLimit)
                : "Belum Diatur"}
              {data.monthlyBudget.isCustom && (
                <span className="text-xs font-normal text-zinc-400 font-sans"> / bln</span>
              )}
            </p>
            {data.monthlyBudget.isCustom && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      data.monthlyBudget.usagePercentage >= 90
                        ? "bg-rose-500"
                        : data.monthlyBudget.usagePercentage >= 75
                        ? "bg-amber-400"
                        : "bg-indigo-400"
                    }`}
                    style={{ width: `${Math.min(100, data.monthlyBudget.usagePercentage)}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-400">
                  Terpakai {isPrivate ? "•••" : formatRupiah(data.monthlyBudget.monthlySpent)} ({data.monthlyBudget.usagePercentage}%)
                </p>
              </div>
            )}
          </div>

          {/* Sub-metric directly below */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Batas Harian:</span>
            <span className="font-mono font-bold text-indigo-300">
              {isPrivate ? "Rp •••••" : formatRupiah(data.monthlyBudget.dailySafeAmount)} / hari
            </span>
          </div>
        </div>

        {/* KPI 4: Total Goal Savings Reserved */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-purple-950/20 via-zinc-900/60 to-zinc-950/80 backdrop-blur-xl p-5 space-y-3 flex flex-col justify-between shadow-lg group hover:border-purple-500/40 hover:scale-[1.01] transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Tabungan Terencana (Target)</span>
            <div className="h-8 w-8 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-sm shadow-purple-500/10 group-hover:scale-110 transition-transform">
              <Target className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono tabular-nums tracking-tight">
              {isPrivate ? "Rp ••••••••" : formatRupiah(data.totalGoalSavings)}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Dari {data.topGoals.length} target impian aktif
            </p>
          </div>

          <p className="text-[10px] text-zinc-500">
            Aman dari pengeluaran harian
          </p>
        </div>
      </div>

      {/* Edit Budget Modal */}
      {isEditBudgetOpen && (
        <EditBudgetModal
          isOpen={isEditBudgetOpen}
          onClose={() => setIsEditBudgetOpen(false)}
          currentLimit={data.monthlyBudget.monthlyLimit}
          daysRemaining={data.monthlyBudget.daysRemaining}
        />
      )}

      {/* 2. Visual Charts Row (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <CashflowChart data={data.cashflowTrend} />
        </div>
        <div className="lg:col-span-5">
          <CategoryDonutChart
            categories={data.categoryExpenses}
            totalExpense={data.monthlyExpense}
          />
        </div>
      </div>

      {/* 3. Deep-Dive Category Breakdown Table */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Layers className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Rincian Pos Pengeluaran
              </h3>
              <p className="text-xs text-zinc-400">
                Breakdown komprehensif seluruh kategori belanja
              </p>
            </div>
          </div>
          <span className="text-xs text-zinc-400">
            {data.categoryExpenses.length} kategori aktif
          </span>
        </div>

        {data.categoryExpenses.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <p className="text-xs text-zinc-400">Belum ada data pengeluaran untuk dianalisis.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                  <th className="pb-3 pl-2">Kategori</th>
                  <th className="pb-3 text-right">Total Biaya</th>
                  <th className="pb-3 text-center">Porsi (%)</th>
                  <th className="pb-3 text-center">Frekuensi</th>
                  <th className="pb-3 text-right pr-2">Rata-rata per Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {data.categoryExpenses.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-semibold text-zinc-100">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-mono font-bold text-zinc-200">
                      {isPrivate ? "Rp •••••" : formatRupiah(cat.amount)}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-800 font-mono text-zinc-300">
                        {cat.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 text-center font-mono text-zinc-400">
                      {cat.count || 1}x transaksi
                    </td>
                    <td className="py-3.5 text-right pr-2 font-mono text-zinc-400">
                      {isPrivate ? "Rp •••••" : formatRupiah(cat.avgPerTx || cat.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Smart Insights & Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Insight 1 */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Lightbulb className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Pola Pengeluaran</h4>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {topCategory
              ? `Kategori ${topCategory.name} merupakan pos pengeluaran terbesar (${topCategory.percentage}% dari total belanja). Evaluasi pos ini untuk efisiensi.`
              : "Catat lebih banyak transaksi untuk mendapatkan analisis pola pengeluaran otomatis."}
          </p>
        </div>

        {/* Insight 2 */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Kesehatan Arus Kas</h4>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {data.monthlyIncome >= data.monthlyExpense
              ? `Surplus arus kas bulan ini sebesar ${isPrivate ? "Rp •••••" : formatRupiah(data.monthlyIncome - data.monthlyExpense)}. Bagus untuk dialokasikan ke target tabungan.`
              : `Pengeluaran bulan ini melebihi pemasukan. Kurangi belanja non-esensial untuk menjaga likuiditas.`}
          </p>
        </div>

        {/* Insight 3 */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Target Finansial</h4>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {data.topGoals.length > 0
              ? `Anda memiliki ${data.topGoals.length} target tabungan aktif dengan total tabungan ${isPrivate ? "Rp •••••" : formatRupiah(data.totalGoalSavings)}.`
              : "Buat target tabungan pertama untuk mulai memisahkan dana impian secara teratur."}
          </p>
        </div>
      </div>
    </div>
  );
}
