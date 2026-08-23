"use client";

import * as React from "react";
import { X, Sparkles, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/currency";
import { updateMonthlySpendingLimit } from "../actions";
import { useRouter } from "next/navigation";

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLimit: number;
  daysRemaining?: number;
}

const PRESET_BUDGETS = [
  { label: "Rp 3 Juta", value: 3000000 },
  { label: "Rp 5 Juta", value: 5000000 },
  { label: "Rp 7.5 Juta", value: 7500000 },
  { label: "Rp 10 Juta", value: 10000000 },
  { label: "Rp 15 Juta", value: 15000000 },
];

export function EditBudgetModal({
  isOpen,
  onClose,
  currentLimit,
}: EditBudgetModalProps) {
  const router = useRouter();
  const [amountStr, setAmountStr] = React.useState(
    currentLimit > 0 ? currentLimit.toString() : "5000000"
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const numericAmount = Math.max(0, parseInt(amountStr.replace(/\D/g, ""), 10) || 0);
  const simulatedDaily = Math.max(0, Math.floor(numericAmount / 30));

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    setAmountStr(rawVal);
  };

  const handlePresetClick = (val: number) => {
    setAmountStr(val.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (numericAmount <= 0) {
        setError("Masukkan nominal batas belanja bulanan yang valid.");
        setIsLoading(false);
        return;
      }

      await updateMonthlySpendingLimit(numericAmount);
      router.refresh();
      onClose();
    } catch {
      setError("Gagal menyimpan batas belanja. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl shadow-black space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Sliders className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Atur Batas Belanja Bulanan
              </h3>
              <p className="text-xs text-zinc-400">
                Tentukan batas maksimal belanja per bulan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Nominal */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">
              Target Batas Belanja Bulanan
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
                Rp
              </span>
              <input
                type="text"
                value={numericAmount > 0 ? numericAmount.toLocaleString("id-ID") : ""}
                onChange={handleAmountChange}
                placeholder="5.000.000"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl pl-12 pr-4 py-3 text-lg font-bold text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-zinc-400 font-medium">Pilihan Cepat:</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_BUDGETS.map((preset) => {
                const isSelected = numericAmount === preset.value;
                return (
                  <button
                    type="button"
                    key={preset.value}
                    onClick={() => handlePresetClick(preset.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Safe-to-Spend Preview Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-zinc-900/60 to-zinc-950/80 border border-indigo-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Simulasi Batas Harian Otomatis:</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-xl font-bold font-mono text-white tabular-nums">
                {formatRupiah(simulatedDaily)}
                <span className="text-xs font-normal text-zinc-400 font-sans"> / hari</span>
              </p>
              <span className="text-[11px] text-zinc-400">
                (Rata-rata 30 hari)
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || numericAmount <= 0}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-900/30"
            >
              {isLoading ? "Menyimpan..." : "Simpan Batas Belanja"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
