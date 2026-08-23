"use client";

import * as React from "react";
import Link from "next/link";
import {
  WalletCards,
  ArrowRightLeft,
  Plus,
  ReceiptText,
  PiggyBank,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/currency";
import { usePrivacy } from "@/context/privacy-context";

interface DashboardOverviewProps {
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    balance: number | string | bigint | null;
    color?: string | null;
    icon?: string | null;
  }>;
  netWorth: number;
}

export function DashboardOverview({ accounts, netWorth }: DashboardOverviewProps) {
  const { isPrivate } = usePrivacy();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Ringkasan Keuangan
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Kekayaan bersih, dompet aktif, dan transaksi terkini dalam satu pandangan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/accounts">
            <Button variant="secondary" size="sm">
              <WalletCards className="h-4 w-4 text-blue-400" />
              <span>Kelola Akun ({accounts.length})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Bento Net Worth Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-full relative overflow-hidden rounded-3xl border border-zinc-800/90 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950/80 backdrop-blur-2xl p-6 sm:p-8 text-zinc-100 shadow-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Status Likuiditas Aktif</span>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-zinc-400 font-medium">Total Kekayaan Bersih (Net Worth)</p>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-mono tabular-nums">
                  {isPrivate ? "Rp ••••••••" : formatRupiah(netWorth)}
                </h2>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-6 border-t border-zinc-800/60 mt-6">
              <Link href="/accounts" className="w-full">
                <Button variant="glass" size="sm" className="w-full justify-start text-xs font-medium">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-purple-400 mr-1.5" />
                  Transfer Dana
                </Button>
              </Link>
              <Link href="/transactions" className="w-full">
                <Button variant="glass" size="sm" className="w-full justify-start text-xs font-medium">
                  <ReceiptText className="h-3.5 w-3.5 text-rose-400 mr-1.5" />
                  + Catat Transaksi
                </Button>
              </Link>
              <Link href="/vaults" className="w-full col-span-2 sm:col-span-1">
                <Button variant="glass" size="sm" className="w-full justify-start text-xs font-medium">
                  <PiggyBank className="h-3.5 w-3.5 text-blue-400 mr-1.5" />
                  Target Tabungan
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mini Highlights Card */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md p-6 flex flex-col justify-between space-y-6">
          <h3 className="text-sm font-bold text-zinc-200 tracking-tight">Kesehatan Arus Kas</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-800/40 border border-zinc-800/60">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <ArrowDownLeft className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium">Pemasukan Bulan Ini</p>
                  <p className="text-sm font-bold text-emerald-400 font-mono">
                    {isPrivate ? "Rp •••••" : "Rp 0"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-800/40 border border-zinc-800/60">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium">Pengeluaran Bulan Ini</p>
                  <p className="text-sm font-bold text-rose-400 font-mono">
                    {isPrivate ? "Rp •••••" : "Rp 0"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
            Data akan otomatis terisi saat transaksi harian dicatat atau struk belanja di-scan.
          </p>
        </div>
      </div>

      {/* Account Balances Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WalletCards className="h-4 w-4 text-blue-400" />
            <h2 className="text-base font-bold text-zinc-100 tracking-tight">Dompet & Rekening Terdaftar</h2>
          </div>
          <Link href="/accounts" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
            Lihat Semua &rarr;
          </Link>
        </div>

        {accounts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-800 p-8 text-center space-y-3">
            <p className="text-xs text-zinc-400">Belum ada akun aset terdaftar.</p>
            <Link href="/accounts">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Tambah Akun
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.slice(0, 3).map((account) => (
              <div
                key={account.id}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-4 space-y-2"
                style={{ borderLeft: `3px solid ${account.color || "#2563EB"}` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200 truncate">{account.name}</span>
                  <span className="text-[10px] text-zinc-400 font-medium">{account.type}</span>
                </div>
                <p className="text-lg font-bold text-white font-mono">
                  {isPrivate ? "Rp ••••••••" : formatRupiah(account.balance)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
