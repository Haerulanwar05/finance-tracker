"use client";

import * as React from "react";
import {
  Search,
  RotateCcw,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  Layers,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type PeriodFilterType = "ALL" | "THIS_MONTH" | "LAST_MONTH" | "LAST_3_MONTHS" | "THIS_YEAR" | "CUSTOM";

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  accountId: string;
  onAccountChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  period: PeriodFilterType;
  onPeriodChange: (period: PeriodFilterType) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  accounts: Array<{ id: string; name: string; type: string }>;
  categories: Array<{ id: string; name: string; type: string }>;
  onReset: () => void;
}

const PERIOD_PRESETS: Array<{ label: string; value: PeriodFilterType }> = [
  { label: "Semua", value: "ALL" },
  { label: "Bulan Ini", value: "THIS_MONTH" },
  { label: "Bulan Lalu", value: "LAST_MONTH" },
  { label: "3 Bulan Terakhir", value: "LAST_3_MONTHS" },
  { label: "Tahun Ini", value: "THIS_YEAR" },
  { label: "Kustom", value: "CUSTOM" },
];

export function TransactionFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  accountId,
  onAccountChange,
  categoryId,
  onCategoryChange,
  period,
  onPeriodChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  accounts,
  categories,
  onReset,
}: TransactionFiltersProps) {
  const isFiltered =
    !!search ||
    type !== "ALL" ||
    !!accountId ||
    !!categoryId ||
    period !== "ALL" ||
    !!startDate ||
    !!endDate;

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/85 via-zinc-900/50 to-zinc-950/90 backdrop-blur-2xl p-4 sm:p-5 space-y-4 text-zinc-100 shadow-[0_12px_36px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
      {/* Top Controls: Search & Selectors */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Cari transaksi (nama toko, deskripsi, atau rekening)..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9.5 bg-zinc-900/80 border-white/[0.08] text-xs h-9.5 rounded-2xl"
          />
        </div>

        {/* Account Selector */}
        <div className="w-full md:w-48">
          <select
            value={accountId}
            onChange={(e) => onAccountChange(e.target.value)}
            aria-label="Pilih Rekening"
            className="w-full h-9.5 px-3 rounded-2xl bg-zinc-900/80 border border-white/[0.08] text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 cursor-pointer shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
          >
            <option value="">Semua Rekening</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Selector */}
        <div className="w-full md:w-48">
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Pilih Kategori"
            className="w-full h-9.5 px-3 rounded-2xl bg-zinc-900/80 border border-white/[0.08] text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 cursor-pointer shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.type === "EXPENSE" ? "Keluar" : "Masuk"})
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onReset}
            className="h-9.5 px-3 text-xs text-zinc-400 hover:text-white rounded-2xl shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      {/* Middle Row: Period Filter Tabs & Custom Date Pickers */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-white/[0.07]">
        {/* Preset Period Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs -mx-1 px-1 touch-pan-x scrollbar-none">
          <span className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1 mr-1 shrink-0">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>Periode:</span>
          </span>
          {PERIOD_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onPeriodChange(preset.value)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all text-xs cursor-pointer shrink-0 ${
                period === preset.value
                  ? "bg-white/[0.08] text-white font-bold border border-white/[0.15] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                  : "bg-white/[0.02] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:bg-white/[0.05]"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Start & End Date Inputs */}
        {period === "CUSTOM" && (
          <div className="flex items-center gap-2 text-xs animate-in fade-in duration-200 flex-wrap">
            <div className="flex items-center gap-1 bg-zinc-900/80 border border-white/[0.08] rounded-xl px-2.5 py-1">
              <span className="text-[10px] text-zinc-400">Dari:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
              />
            </div>
            <span className="text-zinc-600">-</span>
            <div className="flex items-center gap-1 bg-zinc-900/80 border border-white/[0.08] rounded-xl px-2.5 py-1">
              <span className="text-[10px] text-zinc-400">Sampai:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row: Type Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-white/[0.07] -mx-1 px-1 touch-pan-x scrollbar-none">
        <button
          type="button"
          onClick={() => onTypeChange("ALL")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer shrink-0 ${
            type === "ALL"
              ? "bg-white/[0.08] text-white font-bold border border-white/[0.15] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
              : "bg-white/[0.02] text-zinc-400 hover:text-white border border-transparent hover:bg-white/[0.04]"
          }`}
        >
          <Layers className="h-3 w-3" />
          <span>Semua Tipe</span>
        </button>

        <button
          type="button"
          onClick={() => onTypeChange("EXPENSE")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer shrink-0 ${
            type === "EXPENSE"
              ? "bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30 shadow-[inset_0_1px_0_rgba(244,63,94,0.2)]"
              : "bg-white/[0.02] text-zinc-400 hover:text-white border border-transparent hover:bg-white/[0.04]"
          }`}
        >
          <ArrowDownRight className="h-3 w-3 text-rose-400" />
          <span>Pengeluaran</span>
        </button>

        <button
          type="button"
          onClick={() => onTypeChange("INCOME")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer shrink-0 ${
            type === "INCOME"
              ? "bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 shadow-[inset_0_1px_0_rgba(16,185,129,0.2)]"
              : "bg-white/[0.02] text-zinc-400 hover:text-white border border-transparent hover:bg-white/[0.04]"
          }`}
        >
          <ArrowUpRight className="h-3 w-3 text-emerald-400" />
          <span>Pemasukan</span>
        </button>

        <button
          type="button"
          onClick={() => onTypeChange("TRANSFER")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer shrink-0 ${
            type === "TRANSFER"
              ? "bg-violet-500/15 text-violet-300 font-bold border border-violet-500/30 shadow-[inset_0_1px_0_rgba(139,92,246,0.2)]"
              : "bg-white/[0.02] text-zinc-400 hover:text-white border border-transparent hover:bg-white/[0.04]"
          }`}
        >
          <ArrowRightLeft className="h-3 w-3 text-violet-400" />
          <span>Transfer</span>
        </button>
      </div>
    </div>
  );
}
