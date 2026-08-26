"use client";

import * as React from "react";
import Link from "next/link";
import {
  ReceiptText,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { RecentTransactionItem } from "../actions";
import { formatRupiah } from "@/lib/currency";
import { usePrivacy } from "@/context/privacy-context";
import { Button } from "@/components/ui/button";
import { CategoryBadgeIcon } from "@/components/shared/category-badge-icon";

interface RecentTransactionsWidgetProps {
  transactions: RecentTransactionItem[];
}

export function RecentTransactionsWidget({ transactions }: RecentTransactionsWidgetProps) {
  const { isPrivate } = usePrivacy();

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/85 via-zinc-900/50 to-zinc-950/90 backdrop-blur-2xl p-5 sm:p-6 space-y-4 shadow-[0_12px_36px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8.5 w-8.5 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-zinc-200 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
            <ReceiptText className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Transaksi Terkini
            </h3>
            <p className="text-xs text-zinc-400">Aktivitas mutasi terbaru</p>
          </div>
        </div>

        <Link href="/transactions">
          <Button variant="ghost" size="sm" className="text-xs text-zinc-300 hover:text-white">
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
        <div className="divide-y divide-white/[0.06]">
          {transactions.map((tx) => {
            const isIncome = tx.type === "INCOME";
            const isExpense = tx.type === "EXPENSE";

            return (
              <div
                key={tx.id}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group hover:bg-white/[0.03] px-2 rounded-xl transition-colors"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-3 min-w-0">
                  <CategoryBadgeIcon
                    categoryName={tx.category?.name}
                    categoryIcon={tx.category?.icon}
                    type={tx.type}
                    color={tx.category?.color}
                    size="sm"
                  />

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-zinc-100 truncate">
                      {tx.description || tx.category?.name || "Transaksi"}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                      <span>{tx.account?.name || "Akun"}</span>
                      <span>•</span>
                      <span>
                        {tx.date
                          ? new Date(tx.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                          : "-"}
                      </span>
                      {tx.receiptUrl && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-semibold text-[9px]">
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
                        : "text-violet-400"
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
