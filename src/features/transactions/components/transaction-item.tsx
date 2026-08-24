"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  Receipt,
  MoreVertical,
  X,
} from "lucide-react";
import { formatRupiah } from "@/lib/currency";
import { usePrivacy } from "@/context/privacy-context";
import { deleteTransaction, TransactionWithRelations } from "../actions";
import { CategoryBadgeIcon } from "@/components/shared/category-badge-icon";

interface TransactionItemProps {
  transaction: TransactionWithRelations;
  onEdit: (tx: TransactionWithRelations) => void;
}

export function TransactionItem({ transaction, onEdit }: TransactionItemProps) {
  const router = useRouter();
  const { isPrivate } = usePrivacy();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = React.useState(false);
  const [isReceiptPreviewOpen, setIsReceiptPreviewOpen] = React.useState(false);

  const isExpense = transaction.type === "EXPENSE";
  const isIncome = transaction.type === "INCOME";
  const isTransfer = transaction.type === "TRANSFER";

  async function handleDelete() {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini? Saldo akun akan dikembalikan secara otomatis.")) {
      return;
    }

    setIsDeleting(true);
    const res = await deleteTransaction(transaction.id);
    setIsDeleting(false);
    setIsActionModalOpen(false);

    if (res.success) {
      router.refresh();
    }
  }

  return (
    <>
      <div className="group flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 hover:border-zinc-700/80 hover:bg-zinc-900/80 transition-all duration-200 gap-2">
        {/* Left: Type Icon & Info */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          <CategoryBadgeIcon
            categoryName={transaction.category?.name}
            categoryIcon={transaction.category?.icon}
            type={transaction.type}
            color={transaction.category?.color}
            size="md"
          />

          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-semibold text-white truncate">
              {transaction.description ||
                (isTransfer
                  ? `Transfer ke ${transaction.targetAccount?.name || "Tujuan"}`
                  : transaction.category?.name || "Transaksi")}
            </p>
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-zinc-400 mt-0.5">
              {/* Account badge */}
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700/50 font-medium text-[10px] truncate max-w-[120px]">
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: transaction.account.color || "#3B82F6" }}
                />
                <span className="text-zinc-300 truncate">{transaction.account.name}</span>
                {isTransfer && transaction.targetAccount && (
                  <>
                    <span className="text-zinc-500">&rarr;</span>
                    <span className="text-zinc-300 truncate">{transaction.targetAccount.name}</span>
                  </>
                )}
              </span>

              {/* Category badge */}
              {transaction.category && !isTransfer && (
                <span className="px-1.5 py-0.5 rounded-md bg-zinc-800/80 text-zinc-400 text-[10px] truncate max-w-[110px]">
                  {transaction.category.name}
                </span>
              )}

              {/* Has Receipt Attachment Indicator */}
              {transaction.receiptUrl && (
                <button
                  type="button"
                  onClick={() => setIsReceiptPreviewOpen(true)}
                  title="Lihat Foto Struk Belanja"
                  className="flex items-center gap-1 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-1.5 py-0.5 rounded-md text-[9.5px] font-semibold transition-colors cursor-pointer shrink-0"
                >
                  <Receipt className="h-3 w-3" />
                  <span>Foto Struk</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Amount & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-1 sm:ml-3">
          <div className="text-right">
            <p
              className={`text-xs sm:text-base font-extrabold font-mono tabular-nums tracking-tight whitespace-nowrap ${
                isIncome
                  ? "text-emerald-400"
                  : isExpense
                  ? "text-zinc-100"
                  : "text-purple-400"
              }`}
            >
              {isPrivate
                ? "Rp ••••••••"
                : isIncome
                ? `+${formatRupiah(transaction.amount)}`
                : isExpense
                ? `-${formatRupiah(transaction.amount)}`
                : formatRupiah(transaction.amount)}
            </p>
            <span className="text-[9.5px] sm:text-[10px] text-zinc-500 block">
              {new Date(transaction.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(transaction)}
              title="Edit Transaksi"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsActionModalOpen(true)}
              title="Pilihan Lainnya"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Action Modal */}
      {isActionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl p-5 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">Kelola Transaksi</h4>
                <p className="text-xs text-zinc-400 font-mono">
                  {formatRupiah(transaction.amount)} • {transaction.account.name}
                </p>
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
                  onEdit(transaction);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Pencil className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Edit Transaksi</p>
                  <p className="text-[10px] text-zinc-400">Ubah nominal, akun atau tanggal</p>
                </div>
              </button>

              <div className="border-t border-zinc-800/80 my-1" />

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <Trash2 className="h-3.5 w-3.5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-rose-400">
                    {isDeleting ? "Menghapus..." : "Hapus Transaksi"}
                  </p>
                  <p className="text-[10px] text-rose-400/70">
                    Saldo akun otomatis dikembalikan (refund)
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Receipt Image Lightbox Preview */}
      {isReceiptPreviewOpen && transaction.receiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl p-5 text-zinc-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Foto Struk Belanja</h4>
                  <p className="text-[11px] text-zinc-400">
                    {transaction.description} • {formatRupiah(transaction.amount)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReceiptPreviewOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Image display */}
            <div className="max-h-[65vh] overflow-auto rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={transaction.receiptUrl}
                alt="Receipt Full Preview"
                className="max-h-[60vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <span>Tanggal: {new Date(transaction.date).toLocaleDateString("id-ID")}</span>
              <a
                href={transaction.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline text-xs"
              >
                Buka Gambar Asli &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
