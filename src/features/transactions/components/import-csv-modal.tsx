"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/currency";
import { parseBankCsv, ParsedCsvResult } from "../lib/csv-parser";
import { importBulkTransactions } from "../actions";

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    balance: number;
    color?: string | null;
  }>;
}

export function ImportCsvModal({ isOpen, onClose, accounts }: ImportCsvModalProps) {
  const router = useRouter();
  const [targetAccountId, setTargetAccountId] = React.useState(accounts[0]?.id || "");
  const [file, setFile] = React.useState<File | null>(null);
  const [parseResult, setParseResult] = React.useState<ParsedCsvResult | null>(null);
  const [isImporting, setIsImporting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  if (!isOpen) return null;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setErrorMessage(null);
    setSuccessMessage(null);

    const text = await selected.text();
    const result = parseBankCsv(text);

    if (!result.success || result.rows.length === 0) {
      setErrorMessage(
        "File CSV tidak dapat dibaca atau format kolom tidak dikenali. Pastikan kolom memuat Tanggal, Keterangan, dan Jumlah."
      );
      setParseResult(null);
    } else {
      setParseResult(result);
    }
  }

  async function handleImport() {
    if (!parseResult || parseResult.rows.length === 0) return;
    if (!targetAccountId) {
      setErrorMessage("Pilih akun tujuan mutasi.");
      return;
    }

    setIsImporting(true);
    setErrorMessage(null);

    const res = await importBulkTransactions(targetAccountId, parseResult.rows);
    setIsImporting(false);

    if (!res.success) {
      setErrorMessage(res.message || "Gagal mengimpor mutasi");
    } else {
      setSuccessMessage(res.message || "Berhasil mengimpor mutasi!");
      router.refresh();
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl p-6 text-zinc-100 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center border bg-blue-500/10 border-blue-500/30 text-blue-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Import Mutasi Bank (CSV)
              </h2>
              <p className="text-xs text-zinc-400">
                Mendukung mutasi BCA, Mandiri, BRI, Bank Jago & CSV standar.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 1: Select Target Account */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">
            Pilih Rekening Tujuan Mutasi
          </label>
          <select
            value={targetAccountId}
            onChange={(e) => setTargetAccountId(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({formatRupiah(acc.balance)})
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Upload Dropzone */}
        {!parseResult && (
          <div className="relative border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-2xl p-8 text-center space-y-3 bg-zinc-950/50 transition-colors">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200">
                Pilih atau seret file <span className="text-blue-400 font-mono">.CSV</span> ke sini
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Format kolom: Tanggal, Keterangan, Nominal, Tipe (DB/CR)
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Step 3: Parsed Preview Table */}
        {parseResult && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Quick Summary Pill Bar */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 block">Total Baris</span>
                <span className="font-bold text-white">{parseResult.rows.length} Transaksi</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-500 block">Pemasukan</span>
                <span className="font-bold text-emerald-400 font-mono">
                  +{formatRupiah(parseResult.totalIncome)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-rose-500 block">Pengeluaran</span>
                <span className="font-bold text-rose-400 font-mono">
                  -{formatRupiah(parseResult.totalExpense)}
                </span>
              </div>
            </div>

            {/* Preview List (Max 5 items with scroll) */}
            <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950/40">
              <div className="p-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-semibold">
                <span>Pratinjau Hasil Parsing ({file?.name})</span>
                <button
                  type="button"
                  onClick={() => {
                    setParseResult(null);
                    setFile(null);
                  }}
                  className="text-blue-400 hover:underline text-[11px] cursor-pointer"
                >
                  Ganti File
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-zinc-800/60 text-xs">
                {parseResult.rows.map((row, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between hover:bg-zinc-900/50">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                          row.type === "INCOME"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {row.type === "INCOME" ? (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white truncate max-w-[200px] sm:max-w-xs">
                          {row.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                          <span>{new Date(row.date).toLocaleDateString("id-ID")}</span>
                          <span>•</span>
                          <span className="text-blue-400">{row.suggestedCategoryId}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`font-mono font-bold tabular-nums ${
                        row.type === "INCOME" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {row.type === "INCOME" ? "+" : "-"}
                      {formatRupiah(row.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isImporting}
          >
            Batal
          </Button>

          {parseResult && (
            <Button
              type="button"
              size="sm"
              onClick={handleImport}
              disabled={isImporting || parseResult.rows.length === 0}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              <span>{isImporting ? "Mengimpor Data..." : `Impor ${parseResult.rows.length} Transaksi`}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
