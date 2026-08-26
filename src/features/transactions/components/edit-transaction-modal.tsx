"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  X,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  Calendar,
  Tag,
  Wallet,
  FileText,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/currency";
import { updateTransaction, TransactionWithRelations } from "../actions";
import { TransactionType } from "../schema";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionWithRelations | null;
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
}

export function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  accounts,
  categories,
}: EditTransactionModalProps) {
  const router = useRouter();

  const [type, setType] = React.useState<TransactionType>(
    (transaction?.type as TransactionType) || "EXPENSE"
  );
  const [amount, setAmount] = React.useState(
    transaction ? Number(transaction.amount).toLocaleString("id-ID") : ""
  );
  const [accountId, setAccountId] = React.useState(transaction?.accountId || accounts[0]?.id || "");
  const [targetAccountId, setTargetAccountId] = React.useState(transaction?.targetAccountId || "");
  const [categoryId, setCategoryId] = React.useState(transaction?.categoryId || "");
  const [date, setDate] = React.useState(
    transaction?.date
      ? new Date(transaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = React.useState(transaction?.description || "");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Synchronize targetAccountId whenever type is TRANSFER
  React.useEffect(() => {
    if (type === "TRANSFER" && accounts.length >= 2) {
      const availableTargets = accounts.filter((a) => a.id !== accountId);
      if (
        availableTargets.length > 0 &&
        (!targetAccountId || targetAccountId === accountId || !availableTargets.some((a) => a.id === targetAccountId))
      ) {
        setTargetAccountId(availableTargets[0].id);
      }
    }
  }, [type, accountId, targetAccountId, accounts]);

  function handleSourceAccountChange(newAccId: string) {
    setAccountId(newAccId);
    setError(null);
    if (type === "TRANSFER" && newAccId === targetAccountId) {
      const nextTarget = accounts.find((a) => a.id !== newAccId);
      if (nextTarget) {
        setTargetAccountId(nextTarget.id);
      }
    }
  }

  function handleTargetAccountChange(newTargetId: string) {
    setTargetAccountId(newTargetId);
    setError(null);
    if (newTargetId === accountId) {
      const nextSource = accounts.find((a) => a.id !== newTargetId);
      if (nextSource) {
        setAccountId(nextSource.id);
      }
    }
  }

  function handleSwapTransferAccounts() {
    if (accounts.length < 2) return;
    setError(null);
    const prevSource = accountId;
    const prevTarget = targetAccountId;
    setAccountId(prevTarget);
    setTargetAccountId(prevSource);
  }

  if (!isOpen || !transaction) return null;

  const numericAmount = parseFloat(amount.replace(/[^0-9]/g, "")) || 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!transaction) return;
    setError(null);

    if (numericAmount <= 0) {
      setError("Nominal transaksi harus lebih dari 0");
      return;
    }

    if (!accountId) {
      setError("Silakan pilih akun sumber");
      return;
    }

    if (type === "TRANSFER" && (!targetAccountId || targetAccountId === accountId)) {
      setError("Pilih akun tujuan transfer yang berbeda dari akun sumber");
      return;
    }

    if (type !== "TRANSFER" && !categoryId) {
      setError("Silakan pilih kategori transaksi");
      return;
    }

    setIsLoading(true);

    const res = await updateTransaction({
      id: transaction.id,
      accountId,
      targetAccountId: type === "TRANSFER" ? targetAccountId : undefined,
      categoryId: type !== "TRANSFER" ? categoryId : undefined,
      type,
      amount: numericAmount,
      date: new Date(date),
      description: description.trim() || undefined,
    });

    if (!res.success) {
      setIsLoading(false);
      setError(res.message || "Gagal memperbarui transaksi");
    } else {
      setIsLoading(false);
      onClose();
      React.startTransition(() => {
        router.refresh();
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl p-6 text-zinc-100 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center border ${
                type === "EXPENSE"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : type === "INCOME"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-purple-500/10 border-purple-500/30 text-purple-400"
              }`}
            >
              {type === "EXPENSE" ? (
                <ArrowDownRight className="h-5 w-5" />
              ) : type === "INCOME" ? (
                <ArrowUpRight className="h-5 w-5" />
              ) : (
                <ArrowRightLeft className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Edit Transaksi</h2>
              <p className="text-xs text-zinc-400">Ubah data transaksi & sinkronisasi saldo otomatis.</p>
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

        {/* Transaction Type Segmented Toggle */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-zinc-950 border border-zinc-800">
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              type === "EXPENSE"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ArrowDownRight className="h-3.5 w-3.5" />
            <span>Pengeluaran</span>
          </button>

          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              type === "INCOME"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Pemasukan</span>
          </button>

          <button
            type="button"
            onClick={() => setType("TRANSFER")}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              type === "TRANSFER"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>Transfer</span>
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">Nominal Transaksi (IDR)</label>
              {numericAmount > 0 && (
                <span className="text-xs font-mono font-bold text-white bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-700">
                  {formatRupiah(numericAmount)}
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
                Rp
              </span>
              <Input
                type="text"
                value={amount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  if (!raw) {
                    setAmount("");
                    return;
                  }
                  const num = parseInt(raw, 10);
                  setAmount(num.toLocaleString("id-ID"));
                }}
                required
                className="pl-11 text-lg font-mono font-bold bg-zinc-950/80 border-zinc-800"
              />
            </div>
          </div>

          {/* Account Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Akun Sumber</span>
                </label>
                <select
                  value={accountId}
                  onChange={(e) => handleSourceAccountChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatRupiah(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Account (Only for TRANSFER) */}
              {type === "TRANSFER" ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <ArrowRightLeft className="h-3.5 w-3.5 text-purple-400" />
                      <span>Akun Tujuan</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleSwapTransferAccounts}
                      className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 hover:underline cursor-pointer"
                      title="Tukar akun sumber dan tujuan"
                    >
                      <ArrowRightLeft className="h-2.5 w-2.5" />
                      <span>Tukar Arah</span>
                    </button>
                  </div>
                  <select
                    value={targetAccountId}
                    onChange={(e) => handleTargetAccountChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                  >
                    {accounts
                      .filter((a) => a.id !== accountId)
                      .map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} ({formatRupiah(acc.balance)})
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
              /* Category Selector */
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Kategori</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    const newCatId = e.target.value;
                    setCategoryId(newCatId);
                    const selected = categories.find((c) => c.id === newCatId);
                    if (selected && selected.type !== type) {
                      setType(selected.type as TransactionType);
                    }
                  }}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <optgroup label="── Kategori Pemasukan ──">
                    {categories
                      .filter((c) => c.type === "INCOME")
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          🟢 {cat.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="── Kategori Pengeluaran ──">
                    {categories
                      .filter((c) => c.type === "EXPENSE")
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          🔴 {cat.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              <span>Tanggal Transaksi</span>
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-zinc-950/80 border-zinc-800 text-xs"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-zinc-400" />
              <span>Keterangan</span>
            </label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-950/80 border-zinc-800 text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || numericAmount <= 0}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Check className="h-4 w-4 mr-1.5" />
              <span>{isLoading ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
