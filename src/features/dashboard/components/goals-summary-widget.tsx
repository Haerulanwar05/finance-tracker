"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { TopGoalItem } from "../actions";
import { formatRupiah } from "@/lib/currency";
import { usePrivacy } from "@/context/privacy-context";
import { Button } from "@/components/ui/button";
import { GoalIcon } from "@/features/goals/components/goal-icons";

interface GoalsSummaryWidgetProps {
  goals: TopGoalItem[];
}

export function GoalsSummaryWidget({ goals }: GoalsSummaryWidgetProps) {
  const { isPrivate } = usePrivacy();

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Target className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Target Tabungan
            </h3>
            <p className="text-xs text-zinc-400">Progres impian finansial</p>
          </div>
        </div>

        <Link href="/vaults">
          <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300">
            <span>Kelola Target</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <p className="text-xs text-zinc-400">Belum ada target tabungan dibuat.</p>
          <Link href="/vaults">
            <Button size="sm" variant="secondary" className="text-xs">
              + Buat Target Pertama
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {goals.map((goal) => {
            const themeColor = goal.color || "#3B82F6";

            return (
              <div
                key={goal.id}
                className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${themeColor}15`,
                        borderColor: `${themeColor}30`,
                        color: themeColor,
                      }}
                    >
                      <GoalIcon name={goal.icon} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-200 truncate">{goal.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {isPrivate ? "Rp •••" : formatRupiah(goal.currentAmount)} / {formatRupiah(goal.targetAmount)}
                      </p>
                    </div>
                  </div>

                  <span
                    className="font-mono font-bold text-xs shrink-0"
                    style={{ color: themeColor }}
                  >
                    {goal.progressPercentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${goal.progressPercentage}%`,
                      backgroundColor: themeColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
