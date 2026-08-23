"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X, Landmark, Smartphone, Wallet, TrendingUp, Check, Sparkles, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAccount } from "../actions";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AccountTypeCategory = "BANK" | "EWALLET" | "CASH" | "INVESTMENT";

const ACCOUNT_TYPES: Array<{ id: AccountTypeCategory; label: string; icon: LucideIcon }> = [
  { id: "BANK", label: "Bank", icon: Landmark },
  { id: "EWALLET", label: "E-Wallet", icon: Smartphone },
  { id: "CASH", label: "Cash / Tunai", icon: Wallet },
  { id: "INVESTMENT", label: "Investasi", icon: TrendingUp },
];

const POPULAR_PRESETS = [
  { name: "BCA", type: "BANK" as const, color: "#2563EB" },
  { name: "Mandiri", type: "BANK" as const, color: "#0284C7" },
  { name: "BNI Bisnis", type: "BANK" as const, color: "#006B79" },
  { name: "BRI", type: "BANK" as const, color: "#0369A1" },
  { name: "BSI", type: "BANK" as const, color: "#00A39D" },
  { name: "Bank Jago", type: "BANK" as const, color: "#EA580C" },
  { name: "GoPay", type: "EWALLET" as const, color: "#06B6D4" },
  { name: "OVO", type: "EWALLET" as const, color: "#8B5CF6" },
  { name: "DANA", type: "EWALLET" as const, color: "#0284C7" },
  { name: "ShopeePay", type: "EWALLET" as const, color: "#F97316" },
  { name: "Dompet Tunai", type: "CASH" as const, color: "#D97706" },
  { name: "Bibit / Reksadana", type: "INVESTMENT" as const, color: "#10B981" },
];

const COLOR_PRESETS = [
  "#2563EB", // BCA Blue
  "#0284C7", // Mandiri Navy
  "#06B6D4", // GoPay Cyan
  "#8B5CF6", // OVO Purple
  "#F97316", // Shopee Orange
  "#10B981", // Emerald Green
  "#D97706", // Cash Amber
  "#E11D48", // Rose Red
];

export function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<AccountTypeCategory>("BANK");
  const [balance, setBalance] = React.useState("");
  const [color, setColor] = React.useState("#2563EB");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  if (!isOpen) return null;

  function applyPreset(preset: typeof POPULAR_PRESETS[0]) {
    setName(preset.name);
    setType(preset.type);
    setColor(preset.color);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const initialBalance = parseFloat(balance.replace(/[^0-9]/g, "")) || 0;

    const res = await createAccount({
      name,
      type,
      balance: initialBalance,
      color,
      icon: type.toLowerCase(),
      accountNumber: accountNumber ? accountNumber.slice(-4) : undefined,
    });

    setIsLoading(false);

    if (!res.success) {
      setError(res.message || "Gagal membuat akun");
    } else {
      setName("");
      setBalance("");
      setAccountNumber("");
      router.refresh();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl p-6 text-zinc-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Tambah Akun / Rekening Baru</h3>
            <p className="text-xs text-zinc-400">Hubungkan rekening bank, e-wallet, atau dompet tunai.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Pilihan Cepat Populer:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {POPULAR_PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 hover:text-white transition-all cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Type Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">Tipe Akun Aset</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ACCOUNT_TYPES.map((t) => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm"
                        : "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            label="Nama Akun / Bank"
            placeholder="misal: BCA Tahapan, GoPay Utama, Dompet Saku"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Saldo Awal (Rupiah)"
            type="text"
            placeholder="0"
            value={balance}
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9]/g, "");
              setBalance(val ? parseInt(val).toLocaleString("id-ID") : "");
            }}
          />

          <Input
            label="4 Digit Terakhir No. Rekening (Opsional)"
            placeholder="misal: 8821"
            maxLength={4}
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />

          {/* Color Preset Palette */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">Warna Aksen Kartu</label>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {COLOR_PRESETS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setColor(hex)}
                  className="h-7 w-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: hex }}
                >
                  {color === hex && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Batal
            </Button>
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Simpan Akun
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
