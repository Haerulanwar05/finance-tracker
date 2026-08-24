"use client";

import * as React from "react";
import { Plus, Sparkles, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardAnalyticsData } from "../actions";
import { BentoMetrics } from "./bento-metrics";
import { CashflowChart } from "./cashflow-chart";
import { CategoryDonutChart } from "./category-donut-chart";
import { RecentTransactionsWidget } from "./recent-transactions-widget";
import { GoalsSummaryWidget } from "./goals-summary-widget";
import { AddTransactionModal } from "@/features/transactions/components/add-transaction-modal";
import { ReceiptScannerModal } from "@/features/ocr/components/receipt-scanner-modal";
import { TransferModal } from "@/features/accounts/components/transfer-modal";

interface DashboardViewProps {
  data: DashboardAnalyticsData;
}

export function DashboardView({ data }: DashboardViewProps) {
  const [isAddTxOpen, setIsAddTxOpen] = React.useState(false);
  const [isScanReceiptOpen, setIsScanReceiptOpen] = React.useState(false);
  const [isTransferOpen, setIsTransferOpen] = React.useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Ringkasan Keuangan
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Arus kas, batas belanja harian, dan progres target tabungan Anda.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <Button
            onClick={() => setIsScanReceiptOpen(true)}
            variant="secondary"
            size="sm"
            className="border border-indigo-500/30 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 shadow-md shadow-indigo-500/10 font-semibold group h-10 sm:h-9"
          >
            <Sparkles className="h-4 w-4 text-indigo-400 mr-1.5 transition-transform group-hover:scale-110" />
            <span>Foto Struk AI</span>
          </Button>

          <Button
            onClick={() => setIsTransferOpen(true)}
            variant="secondary"
            size="sm"
            className="border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 group h-10 sm:h-9"
          >
            <ArrowRightLeft className="h-4 w-4 text-purple-400 mr-1.5 transition-transform group-hover:rotate-180 duration-300" />
            <span>Pindah Saldo</span>
          </Button>

          <Button
            onClick={() => setIsAddTxOpen(true)}
            size="sm"
            className="col-span-2 sm:col-span-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/25 group cursor-pointer h-10 sm:h-9"
          >
            <Plus className="h-4 w-4 mr-1.5 transition-transform group-hover:rotate-90 duration-200" />
            <span>Catat Transaksi</span>
          </Button>
        </div>
      </div>

      {/* 1. Four Bento Top Metrics */}
      <BentoMetrics
        netWorth={data.netWorth}
        monthlyIncome={data.monthlyIncome}
        monthlyExpense={data.monthlyExpense}
        incomeGrowthPct={data.incomeGrowthPct}
        expenseGrowthPct={data.expenseGrowthPct}
        monthlyBudget={data.monthlyBudget}
        safeToSpend={data.safeToSpend}
      />

      {/* 2. Visual Charts Row (Cashflow Trend 6-Bulan & Donut Kategori Pengeluaran) */}
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

      {/* 3. Operational Widgets Row (Recent Transactions & Goals Progress) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RecentTransactionsWidget transactions={data.recentTransactions} />
        </div>
        <div className="lg:col-span-5">
          <GoalsSummaryWidget goals={data.topGoals} />
        </div>
      </div>

      {/* Action Modals */}
      {isAddTxOpen && (
        <AddTransactionModal
          isOpen={isAddTxOpen}
          onClose={() => setIsAddTxOpen(false)}
          accounts={data.accounts}
          categories={data.categories}
        />
      )}

      {isScanReceiptOpen && (
        <ReceiptScannerModal
          isOpen={isScanReceiptOpen}
          onClose={() => setIsScanReceiptOpen(false)}
          accounts={data.accounts}
          categories={data.categories}
        />
      )}

      {isTransferOpen && (
        <TransferModal
          isOpen={isTransferOpen}
          onClose={() => setIsTransferOpen(false)}
          accounts={data.accounts}
        />
      )}
    </div>
  );
}
