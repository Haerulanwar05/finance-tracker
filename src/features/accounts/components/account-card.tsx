"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Landmark,
  Smartphone,
  Wallet,
  TrendingUp,
  CreditCard,
  MoreVertical,
  Archive,
  Pencil,
  ArrowRightLeft,
  Trash2,
  X,
  LucideIcon,
} from "lucide-react";
import { formatRupiah } from "@/lib/currency";
import { archiveAccount, deleteAccount } from "../actions";
import { usePrivacy } from "@/context/privacy-context";
import { Button } from "@/components/ui/button";

export interface AccountItem {
  id: string;
  name: string;
  type: string;
  balance: number | string | bigint | null;
  color?: string | null;
  icon?: string | null;
  accountNumber?: string | null;
}

interface AccountCardProps {
  account: AccountItem;
  onTransferFromThis: (accountId: string) => void;
  onEditAccount: (account: AccountItem) => void;
}

const TYPE_ICONS: Record<string, LucideIcon> = {
  BANK: Landmark,
  EWALLET: Smartphone,
  CASH: Wallet,
  INVESTMENT: TrendingUp,
  CREDIT_CARD: CreditCard,
};

const TYPE_LABELS: Record<string, string> = {
  BANK: "Rekening Bank",
  EWALLET: "E-Wallet",
  CASH: "Uang Tunai",
  INVESTMENT: "Aset Investasi",
  CREDIT_CARD: "Kartu Kredit",
};

export function AccountCard({
  account,
  onTransferFromThis,
  onEditAccount,
}: AccountCardProps) {
  const router = useRouter();
  const { isPrivate } = usePrivacy();
  const IconComponent = TYPE_ICONS[account.type] || Wallet;
  const cardColor = account.color || "#2563EB";
  const [isActionModalOpen, setIsActionModalOpen] = React.useState(false);
  const [isArchiving, setIsArchiving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleArchive() {
    if (!confirm(`Apakah Anda yakin ingin mengarsipkan akun "${account.name}"?`)) return;
    setIsArchiving(true);
    const res = await archiveAccount(account.id);
    setIsArchiving(false);
    setIsActionModalOpen(false);
    if (res.success) {
      router.refresh();
    }
  }

  async function handleDelete() {
    const confirmed = confirm(
      `⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus akun "${account.name}"?\n\nTindakan ini akan menghapus akun beserta SEMUA transaksi yang berkaitan dengan akun ini secara permanen!`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const res = await deleteAccount(account.id);
    setIsDeleting(false);
    setIsActionModalOpen(false);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message || "Gagal menghapus akun");
    }
  }

  return (
    <>
      <div
        className="group relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950/95 backdrop-blur-2xl p-5 sm:p-6 text-zinc-100 transition-[transform,border-color,box-shadow] duration-200 hover:border-white/[0.2] hover:scale-[1.01] shadow-[0_12px_32px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] flex flex-col justify-between min-h-[185px] overflow-hidden"
      >
        {/* Subtle Ambient Tint Glow */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-35"
          style={{ backgroundColor: cardColor }}
        />

        {/* Top Specular Rim */}
        <div
          className="absolute top-0 left-0 right-0 h-1 transition-opacity opacity-80 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${cardColor}, transparent)`,
          }}
        />

        {/* Card Header: Type Badge & Action Tools */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="h-9.5 w-9.5 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-105 shadow-sm"
              style={{
                backgroundColor: `${cardColor}18`,
                borderColor: `${cardColor}35`,
                color: cardColor,
              }}
            >
              <IconComponent className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">{account.name}</h3>
              <span className="text-[10px] font-medium text-zinc-400">
                {TYPE_LABELS[account.type] || account.type}
                {account.accountNumber && ` •••• ${account.accountNumber}`}
              </span>
            </div>
          </div>

          {/* Action Tools in Header */}
          <div className="flex items-center gap-1">
            {/* Quick Edit Icon */}
            <button
              type="button"
              onClick={() => onEditAccount(account)}
              title="Edit Akun"
              aria-label={`Edit akun ${account.name}`}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            {/* 3-Dots Action Sheet Opener */}
            <button
              type="button"
              onClick={() => setIsActionModalOpen(true)}
              title="Menu Akun Lengkap"
              aria-label={`Menu lengkap akun ${account.name}`}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Card Body: Balance Amount */}
        <div className="pt-4 pb-2 relative z-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Saldo Tersedia</p>
          <p className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono tabular-nums">
            {isPrivate ? "Rp ••••••••" : formatRupiah(account.balance)}
          </p>
        </div>

        {/* Card Footer: Quick Transfer Action */}
        <div className="pt-2.5 border-t border-white/[0.07] flex items-center justify-between text-xs relative z-10">
          <span className="text-[10px] text-zinc-400 font-mono">IDR • Aktif</span>
          <button
            type="button"
            onClick={() => onTransferFromThis(account.id)}
            className="text-xs font-semibold hover:underline transition-all cursor-pointer flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06]"
            style={{ color: cardColor }}
          >
            <span>Kirim Saldo</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Global Action Modal (Immune to CSS grid clipping & zero overlap bugs) */}
      {isActionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl p-5 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="h-8 w-8 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${cardColor}20`,
                    borderColor: `${cardColor}40`,
                    color: cardColor,
                  }}
                >
                  <IconComponent className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{account.name}</h4>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    {isPrivate ? "Rp ••••••••" : formatRupiah(account.balance)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsActionModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsActionModalOpen(false);
                  onEditAccount(account);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Pencil className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Edit Detail Akun</p>
                  <p className="text-[10px] text-zinc-400">Ubah nama, tipe dompet, warna aksen</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsActionModalOpen(false);
                  onTransferFromThis(account.id);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Transfer dari Akun Ini</p>
                  <p className="text-[10px] text-zinc-400">Pindahkan saldo ke rekening / dompet lain</p>
                </div>
              </button>

              <div className="border-t border-zinc-800/80 my-1" />

              <button
                type="button"
                onClick={handleArchive}
                disabled={isArchiving || isDeleting}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer"
              >
                <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Archive className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-amber-400">
                    {isArchiving ? "Sedang Mengarsipkan..." : "Arsipkan Akun"}
                  </p>
                  <p className="text-[10px] text-amber-400/70">Sembunyikan akun dari daftar aktif</p>
                </div>
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isArchiving || isDeleting}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <Trash2 className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-rose-400">
                    {isDeleting ? "Sedang Menghapus..." : "Hapus Akun & Seluruh Transaksinya"}
                  </p>
                  <p className="text-[10px] text-rose-400/70">Hapus permanen akun & seluruh riwayatnya</p>
                </div>
              </button>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsActionModalOpen(false)}
              className="w-full"
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
