"use client";

import * as React from "react";
import Link from "next/link";
import {
  ReceiptText,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { RecentTransactionItem } from "../actions";
import { formatRupiah } from "@/lib/currency";
import { usePrivacy } from "@/context/privacy-context";
import { Button } from "@/components/ui/button";

interface RecentTransactionsWidgetProps {
  transactions: RecentTransactionItem[];
}

export function RecentTransactionsWidget({ transactions }: RecentTransactionsWidgetProps) {
  const { isPrivate } = usePrivacy();

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <ReceiptText className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Transaksi Terkini
            </h3>
            <p className="text-xs text-zinc-400">Aktivitas mutasi terbaru</p>
          </div>
        </div>

        <Link href="/transactions">
          <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300">
            <span>Lihat Semua</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <p className="text-xs text-zinc-400">Belum ada transaksi tercatat.</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/60">
          {transactions.map((tx) => {
            const isIncome = tx.type === "INCOME";
            const isExpense = tx.type === "EXPENSE";

            return (
              <div
                key={tx.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group hover:bg-zinc-800/20 px-2 rounded-xl transition-colors"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isIncome
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : isExpense
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : isExpense ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowRightLeft className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-zinc-100 truncate">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                      <span>{tx.account.name}</span>
                      <span>•</span>
                      <span>{new Date(tx.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                      {tx.receiptUrl && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-indigo-400 bg-indigo-500/10 px-1 rounded">
                            <Receipt className="h-2.5 w-2.5" />
                            <span>Struk</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Nominal */}
                <div className="text-right shrink-0">
                  <p
                    className={`text-xs sm:text-sm font-extrabold font-mono tabular-nums ${
                      isIncome
                        ? "text-emerald-400"
                        : isExpense
                        ? "text-zinc-100"
                        : "text-purple-400"
                    }`}
                  >
                    {isPrivate
                      ? "Rp •••••"
                      : isIncome
                      ? `+${formatRupiah(tx.amount)}`
                      : isExpense
                      ? `-${formatRupiah(tx.amount)}`
                      : formatRupiah(tx.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
