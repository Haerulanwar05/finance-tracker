"use client";

import * as React from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  MoreVertical,
  Clock,
  Trophy,
} from "lucide-react";
import { formatRupiah } from "@/lib/currency";
import { usePrivacy } from "@/context/privacy-context";
import { GoalVaultWithRelations } from "../actions";
import { GoalIcon } from "./goal-icons";
import { Button } from "@/components/ui/button";

interface GoalCardProps {
  goal: GoalVaultWithRelations;
  onOpenDepositWithdraw: (goal: GoalVaultWithRelations, mode: "DEPOSIT" | "WITHDRAW") => void;
  onEdit: (goal: GoalVaultWithRelations) => void;
}

export function GoalCard({ goal, onOpenDepositWithdraw, onEdit }: GoalCardProps) {
  const { isPrivate } = usePrivacy();

  const progress = Math.min(
    100,
    goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0
  );
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const isAchieved = goal.status === "ACHIEVED" || progress >= 100;

  // Deadline & Pace Estimation
  let deadlineText: string | null = null;
  let monthlyPaceText: string | null = null;

  if (goal.deadline) {
    const deadlineDate = new Date(goal.deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      const months = Math.max(1, Math.ceil(diffDays / 30));
      deadlineText = `${diffDays} hari lagi (${deadlineDate.toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      })})`;

      if (!isAchieved && remaining > 0) {
        const pace = Math.ceil(remaining / months);
        monthlyPaceText = `~${formatRupiah(pace)} / bln`;
      }
    } else if (diffDays === 0) {
      deadlineText = "Batas waktu hari ini";
    } else {
      deadlineText = "Lewat batas waktu";
    }
  }

  const themeColor = goal.color || "#3B82F6";

  return (
    <div className="group relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950/95 backdrop-blur-2xl p-5 sm:p-6 transition-[transform,border-color,box-shadow] duration-200 hover:border-white/[0.2] hover:scale-[1.01] shadow-[0_12px_32px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] flex flex-col justify-between space-y-5 overflow-hidden">
      {/* Top ambient highlight */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none transition-opacity group-hover:opacity-35"
        style={{ backgroundColor: themeColor }}
      />

      {/* Header: Icon, Name & Status */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-105"
              style={{
                backgroundColor: `${themeColor}15`,
                borderColor: `${themeColor}35`,
                color: themeColor,
              }}
            >
              <GoalIcon name={goal.icon} className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{goal.name}</span>
                {isAchieved && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <Trophy className="h-3 w-3" />
                    <span>Tercapai!</span>
                  </span>
                )}
              </h3>

              {goal.linkedAccount ? (
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                  <Wallet className="h-3.5 w-3.5 text-zinc-500" />
                  <span>{goal.linkedAccount.name}</span>
                </div>
              ) : (
                <span className="text-[11px] text-zinc-500 mt-0.5 block">Tabungan Mandiri</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            title="Edit Target"
            aria-label={`Edit target ${goal.name}`}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar & Percentages */}
        <div className="space-y-2 pt-1">
          <div className="flex items-baseline justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 block">Terkumpul</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums">
                {isPrivate ? "Rp ••••••••" : formatRupiah(goal.currentAmount)}
              </span>
            </div>

            <div className="text-right space-y-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400 block">Target</span>
              <span className="text-sm font-semibold text-zinc-300 font-mono tabular-nums">
                {isPrivate ? "Rp ••••••••" : formatRupiah(goal.targetAmount)}
              </span>
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="relative h-2 w-full bg-zinc-800/90 rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out relative"
              style={{
                width: `${progress}%`,
                backgroundColor: themeColor,
              }}
            >
              {progress > 15 && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              )}
            </div>
          </div>

          {/* Progress Footnotes */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="font-bold font-mono text-zinc-200" style={{ color: themeColor }}>
              {progress}% Tercapai
            </span>

            {!isAchieved && remaining > 0 && (
              <span className="text-zinc-400 text-[11px]">
                Sisa:{" "}
                <span className="font-mono text-zinc-300">
                  {isPrivate ? "••••••" : formatRupiah(remaining)}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Deadline & Smart Pace Badge */}
      <div className="pt-2 border-t border-white/[0.07] flex items-center justify-between text-xs relative z-10">
        {deadlineText ? (
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-[11px] truncate max-w-[140px] sm:max-w-[180px]">
              {deadlineText}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-zinc-500">Tanpa batas waktu</span>
        )}

        {monthlyPaceText && !isAchieved && (
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25 font-medium">
            {isPrivate ? "••••/bln" : monthlyPaceText}
          </span>
        )}
      </div>

      {/* Action Buttons: Alokasi & Tarik Dana */}
      <div className="grid grid-cols-2 gap-2.5 pt-1 relative z-10">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onOpenDepositWithdraw(goal, "WITHDRAW")}
          disabled={goal.currentAmount <= 0}
          className="text-xs h-9"
        >
          <ArrowDownLeft className="h-3.5 w-3.5 text-zinc-400 mr-1" />
          <span>Tarik Uang</span>
        </Button>

        <Button
          type="button"
          variant="emerald"
          size="sm"
          onClick={() => onOpenDepositWithdraw(goal, "DEPOSIT")}
          className="text-xs h-9 font-bold"
        >
          <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
          <span>+ Isi Tabungan</span>
        </Button>
      </div>
    </div>
  );
}
