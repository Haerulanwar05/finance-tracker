"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/currency";
import { depositToVault, withdrawFromVault, GoalVaultWithRelations } from "../actions";
import { GoalIcon } from "./goal-icons";

export interface AccountOption {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface DepositWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: GoalVaultWithRelations | null;
  initialMode: "DEPOSIT" | "WITHDRAW";
  accounts: AccountOption[];
}

export function DepositWithdrawModal({
  isOpen,
  onClose,
  goal,
  initialMode,
  accounts,
}: DepositWithdrawModalProps) {
  if (!isOpen || !goal) return null;

  return (
    <DepositWithdrawModalContent
      key={`${goal.id}-${initialMode}`}
      onClose={onClose}
      goal={goal}
      initialMode={initialMode}
      accounts={accounts}
    />
  );
}

function DepositWithdrawModalContent({
  onClose,
  goal,
  initialMode,
  accounts,
}: {
  onClose: () => void;
  goal: GoalVaultWithRelations;
  initialMode: "DEPOSIT" | "WITHDRAW";
  accounts: AccountOption[];
}) {
  const router = useRouter();

  const [mode, setMode] = React.useState<"DEPOSIT" | "WITHDRAW">(initialMode);
  const [selectedAccountId, setSelectedAccountId] = React.useState(
    goal.linkedAccountId && accounts.some((a) => a.id === goal.linkedAccountId)
      ? goal.linkedAccountId
      : accounts[0]?.id || ""
  );
  const [amount, setAmount] = React.useState("");
  const [note, setNote] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const numericAmount = parseFloat(amount.replace(/[^0-9]/g, "")) || 0;
  const remainingToTarget = Math.max(0, goal.targetAmount - goal.currentAmount);

  // Projected math
  const projectedSaved =
    mode === "DEPOSIT"
      ? goal.currentAmount + numericAmount
      : Math.max(0, goal.currentAmount - numericAmount);

  const projectedProgress = Math.min(
    100,
    goal.targetAmount > 0 ? Math.round((projectedSaved / goal.targetAmount) * 100) : 0
  );

  function handleQuickAddAmount(val: number) {
    const current = parseFloat(amount.replace(/[^0-9]/g, "")) || 0;
    const next = current + val;
    setAmount(next.toLocaleString("id-ID"));
  }

  function handleFillRemaining() {
    if (mode === "DEPOSIT") {
      setAmount(remainingToTarget.toLocaleString("id-ID"));
    } else {
      setAmount(goal.currentAmount.toLocaleString("id-ID"));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (numericAmount <= 0) {
      setError("Nominal transaksi harus lebih dari 0.");
      return;
    }

    if (!selectedAccountId) {
      setError("Silakan pilih rekening transaksi.");
      return;
    }

    if (mode === "DEPOSIT") {
      if (selectedAccount && selectedAccount.balance < numericAmount) {
        setError(
          `Saldo rekening ${selectedAccount.name} tidak mencukupi (Tersedia: ${formatRupiah(selectedAccount.balance)}).`
        );
        return;
      }

      setIsSubmitting(true);
      const res = await depositToVault({
        vaultId: goal.id,
        sourceAccountId: selectedAccountId,
        amount: numericAmount,
        note: note.trim() || undefined,
      });
      setIsSubmitting(false);

      if (res.success) {
        router.refresh();
        onClose();
      } else {
        setError(res.message || "Gagal mengalokasikan dana.");
      }
    } else {
      if (goal.currentAmount < numericAmount) {
        setError(
          `Saldo tabungan tidak mencukupi untuk ditarik (Terkumpul: ${formatRupiah(goal.currentAmount)}).`
        );
        return;
      }

      setIsSubmitting(true);
      const res = await withdrawFromVault({
        vaultId: goal.id,
        targetAccountId: selectedAccountId,
        amount: numericAmount,
        note: note.trim() || undefined,
      });
      setIsSubmitting(false);

      if (res.success) {
        router.refresh();
        onClose();
      } else {
        setError(res.message || "Gagal menarik dana tabungan.");
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl p-6 text-zinc-100 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-2xl flex items-center justify-center border shadow-inner"
              style={{
                backgroundColor: `${goal.color || "#3B82F6"}15`,
                borderColor: `${goal.color || "#3B82F6"}35`,
                color: goal.color || "#3B82F6",
              }}
            >
              <GoalIcon name={goal.icon} className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {goal.name}
              </h2>
              <p className="text-xs text-zinc-400">
                Terkumpul: <span className="text-zinc-200 font-mono font-semibold">{formatRupiah(goal.currentAmount)}</span> dari{" "}
                <span className="text-zinc-200 font-mono font-semibold">{formatRupiah(goal.targetAmount)}</span>
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

        {/* Dual Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950/80 rounded-2xl border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setMode("DEPOSIT");
              setError(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === "DEPOSIT"
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Isi Tabungan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("WITHDRAW");
              setError(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === "WITHDRAW"
                ? "bg-amber-600 text-white shadow-md shadow-amber-900/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ArrowDownLeft className="h-3.5 w-3.5" />
            <span>Tarik Uang</span>
          </button>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs text-rose-400 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-zinc-400" />
                <span>{mode === "DEPOSIT" ? "Ambil dari Rekening" : "Pindahkan ke Rekening"}</span>
              </span>
              {selectedAccount && (
                <span className="text-[11px] font-mono text-zinc-400">
                  Saldo: {formatRupiah(selectedAccount.balance)}
                </span>
              )}
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              required
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({formatRupiah(acc.balance)})
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                {mode === "DEPOSIT" ? "Nominal yang Ditabung" : "Nominal yang Ditarik"}
              </label>
              {numericAmount > 0 && (
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
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
                placeholder="500.000"
                required
                className="pl-11 text-lg font-mono font-bold bg-zinc-950/80 border-zinc-800 text-white"
              />
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[100000, 500000, 1000000, 2500000, 5000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-lg border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  +{formatRupiah(val)}
                </button>
              ))}

              <button
                type="button"
                onClick={handleFillRemaining}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-colors cursor-pointer"
              >
                {mode === "DEPOSIT" ? "Isi Sisa Target" : "Tarik Semua"}
              </button>
            </div>
          </div>

          {/* Projected Progress Preview */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Proyeksi Tabungan Setelah Transaksi</span>
              <span className="font-mono font-bold text-white">
                {projectedProgress}% ({formatRupiah(projectedSaved)})
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${projectedProgress}%`,
                  backgroundColor: goal.color || "#3B82F6",
                }}
              />
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Catatan (Opsional)</label>
            <Input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Sisihan gaji bulanan, bonus project"
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
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              className={`font-semibold flex items-center gap-1.5 shadow-md ${
                mode === "DEPOSIT"
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30"
                  : "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{mode === "DEPOSIT" ? "Simpan ke Tabungan" : "Tarik ke Rekening"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
