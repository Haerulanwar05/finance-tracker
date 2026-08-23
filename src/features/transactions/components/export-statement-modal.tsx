"use client";

import * as React from "react";
import {
  X,
  Printer,
  FileSpreadsheet,
  WalletCards,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  FileText,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/currency";
import { TransactionWithRelations } from "../actions";
import { exportTransactionsToCsv } from "../lib/export-csv";
import { printFinancialStatement } from "../lib/print-statement";

interface ExportStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: TransactionWithRelations[];
  periodLabel: string;
  userName?: string | null;
}

export function ExportStatementModal({
  isOpen,
  onClose,
  transactions,
  periodLabel,
  userName = "Pengguna FinanceTracker",
}: ExportStatementModalProps) {
  const documentId = React.useMemo(() => {
    const d = new Date();
    const yearMonth = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
    const hash = (transactions.length * 137 + 1000) % 9000;
    return `FT-${yearMonth}-${1000 + hash}`;
  }, [transactions.length]);

  if (!isOpen) return null;

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netCashflow = totalIncome - totalExpense;

  // Category breakdown
  const categoryMap = new Map<string, { name: string; amount: number; count: number }>();
  transactions
    .filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      const catName = t.category?.name || "Lainnya";
      const existing = categoryMap.get(catName) || { name: catName, amount: 0, count: 0 };
      existing.amount += Number(t.amount);
      existing.count += 1;
      categoryMap.set(catName, existing);
    });

  const categoryBreakdown = Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount);

  const handlePrint = () => {
    printFinancialStatement({
      transactions,
      periodLabel,
      userName,
    });
  };

  const handleDownloadCsv = () => {
    const filename = `laporan-keuangan-${periodLabel.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`;
    exportTransactionsToCsv(transactions, filename);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl overflow-hidden">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-zinc-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">Pratinjau Dokumen Laporan Keuangan</h2>
              <p className="text-[11px] text-zinc-400">Periode: {periodLabel} • {transactions.length} Mutasi Transaksi</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadCsv}
              className="text-xs border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
              <span className="hidden sm:inline">Unduh CSV</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handlePrint}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/40 font-semibold"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5" />
              <span>Cetak / Simpan PDF</span>
            </Button>

            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 rounded-xl hover:bg-zinc-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-zinc-900/50 flex justify-center">
          {/* Printable White Paper Sheet (A4 Preview) */}
          <div
            id="printable-statement"
            className="w-full max-w-3xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 space-y-6 font-sans border border-slate-200"
          >
            {/* 1. Official Header */}
            <div className="flex flex-row items-start justify-between gap-4 border-b-2 border-slate-900 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm tracking-wider shadow-xs">
                    FT
                  </div>
                  <div>
                    <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                      FinanceTracker
                    </h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Personal Financial Statement
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 max-w-sm pt-0.5">
                  Laporan rekapitulasi mutasi kas, saldo rekening, dan pembukuan anggaran.
                </p>
              </div>

              {/* Document Meta Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-1 text-[11px] shrink-0 min-w-[210px]">
                <div className="flex justify-between text-slate-500">
                  <span>No. Dokumen:</span>
                  <strong className="font-mono text-slate-800">{documentId}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Pemilik Akun:</span>
                  <strong className="text-slate-800">{userName || "Pengguna"}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Periode:</span>
                  <strong className="text-blue-700 font-bold">{periodLabel}</strong>
                </div>
                <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200 text-[10px]">
                  <span>Tanggal Cetak:</span>
                  <span className="text-slate-700 font-medium">
                    {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Executive Summary KPI Cards (Balanced 3 Columns) */}
            <div className="grid grid-cols-3 gap-3">
              {/* Total Income */}
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-slate-900 space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <ArrowDownRight className="h-3 w-3 text-emerald-700" />
                  Pemasukan
                </span>
                <p className="text-base sm:text-lg font-black font-mono text-emerald-800 tracking-tight">
                  +{formatRupiah(totalIncome)}
                </p>
                <p className="text-[9px] text-emerald-700">Dana Masuk</p>
              </div>

              {/* Total Expense */}
              <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-slate-900 space-y-0.5">
                <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-rose-700" />
                  Pengeluaran
                </span>
                <p className="text-base sm:text-lg font-black font-mono text-rose-800 tracking-tight">
                  -{formatRupiah(totalExpense)}
                </p>
                <p className="text-[9px] text-rose-700">Total Belanja & Tagihan</p>
              </div>

              {/* Net Cashflow */}
              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-slate-900 space-y-0.5">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                  <WalletCards className="h-3 w-3 text-blue-700" />
                  Arus Kas Bersih
                </span>
                <p className={`text-base sm:text-lg font-black font-mono tracking-tight ${netCashflow >= 0 ? "text-blue-800" : "text-rose-800"}`}>
                  {netCashflow >= 0 ? "+" : ""}{formatRupiah(netCashflow)}
                </p>
                <p className="text-[9px] text-blue-700">
                  {netCashflow >= 0 ? "Surplus Keuangan" : "Defisit Keuangan"}
                </p>
              </div>
            </div>

            {/* 3. Category Breakdown Table */}
            {categoryBreakdown.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-600" />
                  <span>Rincian Pengeluaran Berdasarkan Kategori</span>
                </h3>
                <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Nama Kategori</th>
                        <th className="py-2 px-3 text-center">Frekuensi</th>
                        <th className="py-2 px-3 text-right">Total Belanja</th>
                        <th className="py-2 px-3 text-right">Porsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {categoryBreakdown.map((cat, idx) => {
                        const pct = totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 100) : 0;
                        return (
                          <tr key={cat.name} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                            <td className="py-1.5 px-3 font-semibold text-slate-800">{cat.name}</td>
                            <td className="py-1.5 px-3 text-center text-slate-600">{cat.count}x</td>
                            <td className="py-1.5 px-3 text-right font-mono font-bold text-rose-700">
                              {formatRupiah(cat.amount)}
                            </td>
                            <td className="py-1.5 px-3 text-right font-mono font-medium text-slate-700">
                              {pct}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. Complete Transaction Ledger Table */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Receipt className="h-3.5 w-3.5 text-slate-600" />
                  <span>Buku Mutasi Transaksi</span>
                </span>
                <span className="text-[10px] font-normal text-slate-500 lowercase">
                  ({transactions.length} transaksi tercatat)
                </span>
              </h3>

              {transactions.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-300 rounded-xl text-xs text-slate-500">
                  Tidak ada catatan transaksi pada periode yang dipilih.
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 w-24">Tanggal</th>
                        <th className="py-2 px-3">Deskripsi / Keterangan</th>
                        <th className="py-2 px-3 w-28">Kategori</th>
                        <th className="py-2 px-3 w-28">Rekening</th>
                        <th className="py-2 px-3 text-right w-32">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {transactions.map((tx, idx) => {
                        const dateObj = new Date(tx.date);
                        const formattedDate = dateObj.toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });

                        return (
                          <tr key={tx.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                            <td className="py-1.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                              {formattedDate}
                            </td>
                            <td className="py-1.5 px-3 font-semibold text-slate-900">
                              {tx.description || (tx.type === "TRANSFER" ? "Transfer Antar Rekening" : tx.category?.name || "Transaksi")}
                            </td>
                            <td className="py-1.5 px-3 text-slate-600">
                              {tx.type === "TRANSFER" ? "Transfer" : tx.category?.name || "Lainnya"}
                            </td>
                            <td className="py-1.5 px-3 text-slate-600 font-medium">
                              {tx.account.name}
                              {tx.targetAccount && ` ➔ ${tx.targetAccount.name}`}
                            </td>
                            <td className={`py-1.5 px-3 text-right font-mono font-bold whitespace-nowrap ${
                              tx.type === "INCOME"
                                ? "text-emerald-700"
                                : tx.type === "EXPENSE"
                                ? "text-rose-700"
                                : "text-blue-700"
                            }`}>
                              {tx.type === "INCOME" ? "+" : tx.type === "EXPENSE" ? "-" : ""}{formatRupiah(Number(tx.amount))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 5. Formal Statement Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-row items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Dokumen Resmi Diterbitkan Otomatis oleh Sistem FinanceTracker</span>
              </div>
              <p className="font-mono text-slate-400">
                Dicetak pada {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
