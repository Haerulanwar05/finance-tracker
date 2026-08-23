"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRightLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/currency";
import { transferFunds } from "../actions";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    balance: number | string | bigint | null;
    color?: string | null;
  }>;
  defaultSourceId?: string;
}

export function TransferModal({
  isOpen,
  onClose,
  accounts,
  defaultSourceId,
}: TransferModalProps) {
  const router = useRouter();
  const initialSource = defaultSourceId || accounts[0]?.id || "";
  const initialTarget = accounts.find((a) => a.id !== initialSource)?.id || "";

  const [sourceId, setSourceId] = React.useState(initialSource);
  const [targetId, setTargetId] = React.useState(initialTarget);
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  if (!isOpen) return null;

  const sourceAccount = accounts.find((a) => a.id === sourceId);

  function handleSetMaxAmount() {
    if (!sourceAccount) return;
    const maxVal = Math.max(0, Number(sourceAccount.balance));
    setAmount(maxVal.toLocaleString("id-ID"));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, "")) || 0;
    if (numericAmount <= 0) {
      setError("Nominal transfer harus lebih dari 0");
      return;
    }

    if (sourceId === targetId) {
      setError("Akun sumber dan tujuan tidak boleh sama");
      return;
    }

    if (sourceAccount && Number(sourceAccount.balance) < numericAmount) {
      setError(`Saldo ${sourceAccount.name} (${formatRupiah(sourceAccount.balance)}) tidak cukup.`);
      return;
    }

    setIsLoading(true);
    const res = await transferFunds({
      sourceAccountId: sourceId,
      targetAccountId: targetId,
      amount: numericAmount,
      date: new Date(),
      description: description || undefined,
    });

    setIsLoading(false);

    if (!res.success) {
      setError(res.message || "Gagal melakukan transfer");
    } else {
      setAmount("");
      setDescription("");
      router.refresh();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl p-6 text-zinc-100 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ArrowRightLeft className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Transfer Antar-Akun</h3>
              <p className="text-xs text-zinc-400">Pindahkan saldo antar rekening / dompet secara instan.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {accounts.length < 2 ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-300 space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4" />
              <span>Membutuhkan Minimal 2 Akun</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Anda saat ini baru memiliki {accounts.length} akun. Tambahkan setidaknya 1 rekening bank atau e-wallet lagi untuk menggunakan fitur transfer saldo.
            </p>
            <Button onClick={onClose} variant="outline" size="sm" className="w-full">
              Tutup
            </Button>
          </div>
        ) : (
          <>
            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Source Account Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-zinc-300">Dari Akun (Sumber Dana)</label>
                  {sourceAccount && (
                    <span className="text-zinc-400">
                      Saldo: <span className="text-zinc-200 font-mono">{formatRupiah(sourceAccount.balance)}</span>
                    </span>
                  )}
                </div>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatRupiah(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Account Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-300">Ke Akun (Tujuan)</label>
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  {accounts
                    .filter((acc) => acc.id !== sourceId)
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({formatRupiah(acc.balance)})
                      </option>
                    ))}
                </select>
              </div>

              {/* Nominal Transfer + Max Button */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-medium text-zinc-300">Nominal Transfer (Rupiah)</label>
                  <button
                    type="button"
                    onClick={handleSetMaxAmount}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    Gunakan Semua Saldo
                  </button>
                </div>
                <Input
                  type="text"
                  placeholder="0"
                  required
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setAmount(val ? parseInt(val).toLocaleString("id-ID") : "");
                  }}
                />
              </div>

              <Input
                label="Catatan Transfer (Opsional)"
                placeholder="misal: Tarik tunai ATM, Top up GoPay"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex items-center gap-3 pt-3">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Batal
                </Button>
                <Button type="submit" isLoading={isLoading} className="flex-1">
                  Kirim Saldo
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
