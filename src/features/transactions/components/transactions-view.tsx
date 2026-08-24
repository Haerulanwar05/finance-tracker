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

        <div className="flex items-center gap-2 flex-wrap">
          {/* Direct 1-Click Print PDF */}
          <Button
            type="button"
            onClick={handlePrintPdf}
            variant="outline"
            size="sm"
            className="border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 text-xs shadow-sm cursor-pointer"
          >
            <Printer className="h-4 w-4 text-blue-400 mr-1.5" />
            <span>Cetak PDF</span>
          </Button>

          {/* Direct 1-Click Export CSV */}
          <Button
            type="button"
            onClick={handleDownloadCsv}
            variant="outline"
            size="sm"
            className="border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 text-xs shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400 mr-1.5" />
            <span className="hidden sm:inline">Unduh CSV</span>
          </Button>

          {/* AI Scan Receipt */}
          <Button
            onClick={() => setIsScanModalOpen(true)}
            variant="secondary"
            size="sm"
            className="border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 shadow-sm text-xs cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-indigo-400 mr-1.5" />
            <span>Foto Struk</span>
          </Button>

          {/* Import CSV */}
          <Button
            onClick={() => setIsImportModalOpen(true)}
            variant="secondary"
            size="sm"
            className="border border-zinc-800 hover:border-zinc-700 text-xs cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400 mr-1.5" />
            <span>Import CSV</span>
          </Button>

          {/* Add Transaction */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 text-xs font-semibold cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Catat Transaksi</span>
          </Button>
        </div>
      </div>

      {/* Bento Stats Summary Banner (Dynamically reflects active filter) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Total Pemasukan</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono tabular-nums tracking-tight">
            {isPrivate ? "Rp ••••••••" : `+${formatRupiah(dynamicSummary.totalIncome)}`}
          </p>
          <p className="text-[11px] text-zinc-500">Periode: {periodLabel}</p>
        </div>

        {/* Total Expense */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Total Pengeluaran</span>
            <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-400 font-mono tabular-nums tracking-tight">
            {isPrivate ? "Rp ••••••••" : `-${formatRupiah(dynamicSummary.totalExpense)}`}
          </p>
          <p className="text-[11px] text-zinc-500">Periode: {periodLabel}</p>
        </div>

        {/* Net Cashflow */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Arus Kas Bersih (Net)</span>
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <p
            className={`text-xl sm:text-2xl font-extrabold font-mono tabular-nums tracking-tight ${
              dynamicSummary.netCashflow >= 0 ? "text-blue-400" : "text-amber-400"
            }`}
          >
            {isPrivate
              ? "Rp ••••••••"
              : dynamicSummary.netCashflow >= 0
              ? `+${formatRupiah(dynamicSummary.netCashflow)}`
              : `-${formatRupiah(Math.abs(dynamicSummary.netCashflow))}`}
          </p>
          <p className="text-[11px] text-zinc-500">
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
