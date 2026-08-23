"use client";

import * as React from "react";
import { ReceiptText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionItem } from "./transaction-item";
import { TransactionWithRelations } from "../actions";

interface TransactionListProps {
  transactions: TransactionWithRelations[];
  onEdit: (tx: TransactionWithRelations) => void;
  onOpenAddModal: () => void;
}

function formatDateGroupHeader(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Hari Ini";
  if (isYesterday) return "Kemarin";

  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function TransactionList({
  transactions,
  onEdit,
  onOpenAddModal,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-800 p-12 text-center space-y-4 bg-zinc-900/30">
        <div className="h-14 w-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mx-auto text-zinc-400">
          <ReceiptText className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Belum Ada Riwayat Transaksi</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Mulai catat pengeluaran, pemasukan harian, atau impor file mutasi rekening Anda sekarang.
          </p>
        </div>
        <Button onClick={onOpenAddModal} size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Catat Transaksi Pertama</span>
        </Button>
      </div>
    );
  }

  // Group transactions by date string (YYYY-MM-DD)
  const grouped = transactions.reduce((acc, tx) => {
    const key = new Date(tx.date).toISOString().split("T")[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(tx);
    return acc;
  }, {} as Record<string, TransactionWithRelations[]>);

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => {
        const items = grouped[dateKey];
        return (
          <div key={dateKey} className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {formatDateGroupHeader(dateKey)}
              </h3>
              <span className="text-[11px] text-zinc-500 font-mono">
                {items.length} transaksi
              </span>
            </div>

            <div className="space-y-2">
              {items.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} onEdit={onEdit} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
