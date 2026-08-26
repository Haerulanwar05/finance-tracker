"use client";

import * as React from "react";
import {
  Plus,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Scale,
  Sparkles,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/currency";
import { usePrivacy } from "@/context/privacy-context";
import { TransactionWithRelations } from "../actions";
import { TransactionFilters, PeriodFilterType } from "./transaction-filters";
import { TransactionList } from "./transaction-list";
import { AddTransactionModal } from "./add-transaction-modal";
import { EditTransactionModal } from "./edit-transaction-modal";
import { ImportCsvModal } from "./import-csv-modal";
import { ReceiptScannerModal } from "@/features/ocr/components/receipt-scanner-modal";
import { printFinancialStatement } from "../lib/print-statement";
import { exportTransactionsToCsv } from "../lib/export-csv";

interface TransactionsViewProps {
  initialTransactions: TransactionWithRelations[];
  summary: {
    totalIncome: number;
    totalExpense: number;
    netCashflow: number;
    count: number;
  };
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    balance: number;
    color?: string | null;
  }>;
  categories: Array<{
    id: string;
    name: string;
    type: string;
    icon?: string | null;
    color?: string | null;
  }>;
  userName?: string | null;
}

export function TransactionsView({
  initialTransactions,
  accounts,
  categories,
  userName = "Pengguna",
}: TransactionsViewProps) {
  const { isPrivate } = usePrivacy();

  // Filter States
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState("ALL");
  const [accountId, setAccountId] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [period, setPeriod] = React.useState<PeriodFilterType>("ALL");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = React.useState(false);
  const [editingTx, setEditingTx] = React.useState<TransactionWithRelations | null>(null);

  // Filter Transactions dynamically
  const filteredTransactions = React.useMemo(() => {
    const now = new Date();

    return initialTransactions.filter((tx) => {
      const txDate = new Date(tx.date);

      // Period filter
      if (period === "THIS_MONTH") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        if (txDate < start || txDate > end) return false;
      } else if (period === "LAST_MONTH") {
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        if (txDate < start || txDate > end) return false;
      } else if (period === "LAST_3_MONTHS") {
        const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        if (txDate < start || txDate > end) return false;
      } else if (period === "THIS_YEAR") {
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        if (txDate < start || txDate > end) return false;
      } else if (period === "CUSTOM") {
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (txDate < start) return false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (txDate > end) return false;
        }
      }

      if (type !== "ALL" && tx.type !== type) return false;
      if (accountId && tx.accountId !== accountId && tx.targetAccountId !== accountId) return false;
      if (categoryId && tx.categoryId !== categoryId) return false;
      if (search) {
        const query = search.toLowerCase();
        const descMatch = (tx.description || "").toLowerCase().includes(query);
        const catMatch = (tx.category?.name || "").toLowerCase().includes(query);
        const accMatch = tx.account.name.toLowerCase().includes(query);
        if (!descMatch && !catMatch && !accMatch) return false;
      }
      return true;
    });
  }, [initialTransactions, period, startDate, endDate, type, accountId, categoryId, search]);

  // Dynamic Summary based on active filters
  const dynamicSummary = React.useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = filteredTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netCashflow = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      netCashflow,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // Computed period label for export
  const periodLabel = React.useMemo(() => {
    if (period === "THIS_MONTH") return "Bulan Ini";
    if (period === "LAST_MONTH") return "Bulan Lalu";
    if (period === "LAST_3_MONTHS") return "3 Bulan Terakhir";
    if (period === "THIS_YEAR") return "Tahun Ini";
    if (period === "CUSTOM" && startDate && endDate) return `${startDate} s/d ${endDate}`;
    return "Semua Waktu";
  }, [period, startDate, endDate]);

  const handlePrintPdf = () => {
    printFinancialStatement({
      transactions: filteredTransactions,
      periodLabel,
      userName: userName || "Pengguna",
    });
  };

  const handleDownloadCsv = () => {
    const safePeriod = periodLabel.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
    const filename = `laporan-transaksi-${safePeriod}-${new Date().toISOString().slice(0, 10)}.csv`;
    exportTransactionsToCsv(filteredTransactions, filename);
  };

  function handleResetFilters() {
    setSearch("");
    setType("ALL");
    setAccountId("");
    setCategoryId("");
    setPeriod("ALL");
    setStartDate("");
    setEndDate("");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Riwayat Transaksi
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Catatan pengeluaran, pemasukan, dan mutasi rekening Anda.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          {/* Direct 1-Click Print PDF */}
          <Button
            type="button"
            onClick={handlePrintPdf}
            variant="secondary"
            size="sm"
            className="text-xs shadow-xs cursor-pointer group h-10 sm:h-9"
          >
            <Printer className="h-4 w-4 text-zinc-400 mr-1.5 transition-transform group-hover:scale-110" />
            <span>Cetak PDF</span>
          </Button>

          {/* Direct 1-Click Export CSV */}
          <Button
            type="button"
            onClick={handleDownloadCsv}
            variant="secondary"
            size="sm"
            className="text-xs shadow-xs cursor-pointer group h-10 sm:h-9"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400 mr-1.5 transition-transform group-hover:scale-110" />
            <span>Unduh CSV</span>
          </Button>

          {/* AI Scan Receipt */}
          <Button
            onClick={() => setIsScanModalOpen(true)}
            variant="secondary"
            size="sm"
            className="text-xs font-semibold cursor-pointer group h-10 sm:h-9"
          >
            <Sparkles className="h-4 w-4 text-emerald-400 mr-1.5 transition-transform group-hover:scale-110" />
            <span>Foto Struk AI</span>
          </Button>

          {/* Import CSV */}
          <Button
            onClick={() => setIsImportModalOpen(true)}
            variant="secondary"
            size="sm"
            className="text-xs cursor-pointer group h-10 sm:h-9"
          >
            <FileSpreadsheet className="h-4 w-4 text-zinc-400 group-hover:text-emerald-400 mr-1.5 transition-colors" />
            <span>Import CSV</span>
          </Button>

          {/* Add Transaction */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="emerald"
            size="sm"
            className="col-span-2 sm:col-span-1 text-xs font-bold cursor-pointer group h-10 sm:h-9"
          >
            <Plus className="h-4 w-4 mr-1.5 transition-transform group-hover:rotate-90 duration-200" />
            <span>Catat Transaksi</span>
          </Button>
        </div>
      </div>

      {/* Bento Stats Summary Banner (Dynamically reflects active filter) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/85 via-zinc-900/50 to-zinc-950/90 backdrop-blur-2xl p-5 space-y-2 shadow-[0_10px_30px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:border-emerald-500/30 transition-[border-color,transform,box-shadow] duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-zinc-400">Total Pemasukan</span>
            <div className="h-8.5 w-8.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono tabular-nums tracking-tight">
            {isPrivate ? "Rp ••••••••" : `+${formatRupiah(dynamicSummary.totalIncome)}`}
          </p>
          <p className="text-[11px] text-zinc-400 font-mono">Periode: {periodLabel}</p>
        </div>

        {/* Total Expense */}
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/85 via-zinc-900/50 to-zinc-950/90 backdrop-blur-2xl p-5 space-y-2 shadow-[0_10px_30px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:border-rose-500/30 transition-[border-color,transform,box-shadow] duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-zinc-400">Total Pengeluaran</span>
            <div className="h-8.5 w-8.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(244,63,94,0.2)] group-hover:scale-105 transition-transform">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-400 font-mono tabular-nums tracking-tight">
            {isPrivate ? "Rp ••••••••" : `-${formatRupiah(dynamicSummary.totalExpense)}`}
          </p>
          <p className="text-[11px] text-zinc-400 font-mono">Periode: {periodLabel}</p>
        </div>

        {/* Net Cashflow */}
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/85 via-zinc-900/50 to-zinc-950/90 backdrop-blur-2xl p-5 space-y-2 shadow-[0_10px_30px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:border-white/[0.2] transition-[border-color,transform,box-shadow] duration-200 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-zinc-400">Arus Kas Bersih (Net)</span>
            <div className="h-8.5 w-8.5 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-zinc-200 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <p
            className={`text-xl sm:text-2xl font-extrabold font-mono tabular-nums tracking-tight ${
              dynamicSummary.netCashflow >= 0 ? "text-white" : "text-amber-400"
            }`}
          >
            {isPrivate
              ? "Rp ••••••••"
              : dynamicSummary.netCashflow >= 0
              ? `+${formatRupiah(dynamicSummary.netCashflow)}`
              : `-${formatRupiah(Math.abs(dynamicSummary.netCashflow))}`}
          </p>
          <p className="text-[11px] text-zinc-400">
            {dynamicSummary.netCashflow >= 0 ? "Surplus Keuangan" : "Defisit Keuangan"}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <TransactionFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        accountId={accountId}
        onAccountChange={setAccountId}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        period={period}
        onPeriodChange={setPeriod}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        accounts={accounts}
        categories={categories}
        onReset={handleResetFilters}
      />

      {/* Transaction List Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-zinc-100 tracking-tight">
            Daftar Riwayat
          </h2>
          <span className="text-xs text-zinc-500">
            Menampilkan {filteredTransactions.length} dari {initialTransactions.length} transaksi ({periodLabel})
          </span>
        </div>

        <TransactionList
          transactions={filteredTransactions}
          onEdit={(tx) => setEditingTx(tx)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        accounts={accounts}
        categories={categories}
      />

      <EditTransactionModal
        isOpen={!!editingTx}
        onClose={() => setEditingTx(null)}
        transaction={editingTx}
        accounts={accounts}
        categories={categories}
      />

      <ImportCsvModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        accounts={accounts}
      />

      <ReceiptScannerModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        accounts={accounts}
        categories={categories}
      />
    </div>
  );
}
