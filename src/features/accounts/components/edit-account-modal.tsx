"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { X, Landmark, Smartphone, Wallet, TrendingUp, Check, Trash2, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAccount, deleteAccount } from "../actions";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: {
    id: string;
    name: string;
    type: string;
    color?: string | null;
    icon?: string | null;
    accountNumber?: string | null;
  } | null;
}

type AccountTypeCategory = "BANK" | "EWALLET" | "CASH" | "INVESTMENT";

const ACCOUNT_TYPES: Array<{ id: AccountTypeCategory; label: string; icon: LucideIcon }> = [
  { id: "BANK", label: "Bank", icon: Landmark },
  { id: "EWALLET", label: "E-Wallet", icon: Smartphone },
  { id: "CASH", label: "Cash / Tunai", icon: Wallet },
  { id: "INVESTMENT", label: "Investasi", icon: TrendingUp },
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

export function EditAccountModal({ isOpen, onClose, account }: EditAccountModalProps) {
  const router = useRouter();
  const [name, setName] = React.useState(account?.name || "");
  const [type, setType] = React.useState<AccountTypeCategory>((account?.type as AccountTypeCategory) || "BANK");
  const [color, setColor] = React.useState(account?.color || "#2563EB");
  const [accountNumber, setAccountNumber] = React.useState(account?.accountNumber || "");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  if (!isOpen || !account) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!account) return;
    setError(null);
    setIsLoading(true);

    const res = await updateAccount({
      id: account.id,
      name,
      type,
      color,
      icon: type.toLowerCase(),
      accountNumber: accountNumber ? accountNumber.slice(-4) : undefined,
    });

    setIsLoading(false);

    if (!res.success) {
      setError(res.message || "Gagal memperbarui akun");
    } else {
      router.refresh();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl p-6 text-zinc-100 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Edit Detail Akun</h3>
            <p className="text-xs text-zinc-400">Ubah nama rekening, warna identitas, atau tipe akun.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
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
            placeholder="misal: BCA Tahapan, GoPay Utama"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
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

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={async () => {
                if (!account) return;
                const confirmed = confirm(
                  `⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus akun "${account.name}"?\n\nTindakan ini akan menghapus akun beserta SEMUA riwayat transaksinya secara permanen!`
                );
                if (!confirmed) return;
                setIsLoading(true);
                const res = await deleteAccount(account.id);
                setIsLoading(false);
                if (res.success) {
                  router.refresh();
                  onClose();
                } else {
                  setError(res.message || "Gagal menghapus akun");
                }
              }}
              disabled={isLoading}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1.5 cursor-pointer py-2 px-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Hapus Akun & Transaksi</span>
            </button>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                Batal
              </Button>
              <Button type="submit" size="sm" isLoading={isLoading}>
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
