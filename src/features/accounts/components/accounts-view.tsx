"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  WalletCards,
  Plus,
  Archive,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Trash2,
  Landmark,
  Smartphone,
  Wallet,
  TrendingUp,
  CreditCard,
  LucideIcon,
} from "lucide-react";
import { NetWorthCard } from "./net-worth-card";
import { AccountCard, AccountItem } from "./account-card";
import { AddAccountModal } from "./add-account-modal";
import { EditAccountModal } from "./edit-account-modal";
import { TransferModal } from "./transfer-modal";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/currency";
import { usePrivacy } from "@/context/privacy-context";
import { unarchiveAccount, deleteAccount } from "../actions";

interface AccountsViewProps {
  initialAccounts: AccountItem[];
  initialArchivedAccounts?: AccountItem[];
  initialNetWorth: number;
}

const TYPE_ICONS: Record<string, LucideIcon> = {
  BANK: Landmark,
  EWALLET: Smartphone,
  CASH: Wallet,
  INVESTMENT: TrendingUp,
  CREDIT_CARD: CreditCard,
};

export function AccountsView({
  initialAccounts,
  initialArchivedAccounts = [],
  initialNetWorth,
}: AccountsViewProps) {
  const router = useRouter();
  const { isPrivate } = usePrivacy();
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isTransferOpen, setIsTransferOpen] = React.useState(false);
  const [editingAccount, setEditingAccount] = React.useState<AccountItem | null>(null);
  const [selectedSourceId, setSelectedSourceId] = React.useState<string | undefined>();
  const [isArchivedSectionOpen, setIsArchivedSectionOpen] = React.useState(false);
  const [processingId, setProcessingId] = React.useState<string | null>(null);

  function handleOpenTransfer(sourceId?: string) {
    setSelectedSourceId(sourceId);
    setIsTransferOpen(true);
  }

  async function handleRestoreAccount(account: AccountItem) {
    setProcessingId(account.id);
    const res = await unarchiveAccount(account.id);
    setProcessingId(null);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message || "Gagal memulihkan akun");
    }
  }

  async function handleDeletePermanently(account: AccountItem) {
    const confirmed = confirm(
      `⚠️ PERINGATAN: Apakah Anda yakin ingin menghapus akun "${account.name}"?\n\nTindakan ini akan menghapus akun beserta SEMUA transaksi yang berkaitan dengan akun ini secara permanen!`
    );
    if (!confirmed) return;

    setProcessingId(account.id);
    const res = await deleteAccount(account.id);
    setProcessingId(null);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.message || "Gagal menghapus akun");
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Rekening & Dompet
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Kelola saldo bank, e-wallet, uang tunai, dan investasi Anda.
        </p>
      </div>

      {/* Hero Bento Net Worth Card */}
      <NetWorthCard
        netWorth={initialNetWorth}
        accountsCount={initialAccounts.length}
        onOpenAddModal={() => setIsAddOpen(true)}
        onOpenTransferModal={() => handleOpenTransfer()}
      />

      {/* Active Accounts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-100 tracking-tight">Daftar Rekening</h2>
          <span className="text-xs text-zinc-500">{initialAccounts.length} akun aktif</span>
        </div>

        {initialAccounts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-800 p-12 text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <WalletCards className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Belum ada akun aktif</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Tambahkan rekening bank atau dompet tunai pertamamu sekarang.
              </p>
            </div>
            <Button onClick={() => setIsAddOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Akun Baru
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onTransferFromThis={(id) => handleOpenTransfer(id)}
                onEditAccount={(acc) => setEditingAccount(acc)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Archived Accounts Section (Collapsible) */}
      {initialArchivedAccounts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={() => setIsArchivedSectionOpen(!isArchivedSectionOpen)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/60 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Archive className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <span>Akun yang Diarsipkan</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                    {initialArchivedAccounts.length}
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Akun yang dinonaktifkan sementara dan disembunyikan dari total saldo aktif
                </p>
              </div>
            </div>
            <div className="text-zinc-400 p-1">
              {isArchivedSectionOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </button>

          {isArchivedSectionOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
              {initialArchivedAccounts.map((account) => {
                const Icon = TYPE_ICONS[account.type] || Wallet;
                const isProcessing = processingId === account.id;

                return (
                  <div
                    key={account.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 flex flex-col justify-between min-h-[145px] opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-300">{account.name}</h4>
                          <span className="text-[10px] text-amber-400/80 font-medium">Diarsipkan</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-400">
                        {isPrivate ? "Rp ••••••••" : formatRupiah(account.balance)}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleRestoreAccount(account)}
                        disabled={isProcessing}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Pulihkan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePermanently(account)}
                        disabled={isProcessing}
                        className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Hapus Permanen</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddAccountModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditAccountModal
        key={editingAccount?.id || "edit-modal"}
        isOpen={!!editingAccount}
        account={editingAccount}
        onClose={() => setEditingAccount(null)}
      />
      <TransferModal
        key={selectedSourceId || "transfer-modal"}
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        accounts={initialAccounts}
        defaultSourceId={selectedSourceId}
      />
    </div>
  );
}
