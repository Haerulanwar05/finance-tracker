"use client";

import * as React from "react";
import {
  PiggyBank,
  Plus,
  Target,
  Trophy,
  TrendingUp,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/currency";
import { usePrivacy } from "@/context/privacy-context";
import { GoalVaultWithRelations } from "../actions";
import { GoalCard } from "./goal-card";
import { AddGoalModal } from "./add-goal-modal";
import { EditGoalModal } from "./edit-goal-modal";
import { DepositWithdrawModal } from "./deposit-withdraw-modal";

export interface AccountOption {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface GoalsViewProps {
  initialGoals: GoalVaultWithRelations[];
  summary: {
    totalTarget: number;
    totalSaved: number;
    overallProgress: number;
    activeCount: number;
    achievedCount: number;
  };
  accounts: AccountOption[];
}

export function GoalsView({ initialGoals, summary, accounts }: GoalsViewProps) {
  const { isPrivate } = usePrivacy();

  // Filter States
  const [filter, setFilter] = React.useState<"ALL" | "ACTIVE" | "ACHIEVED">("ALL");
  const [search, setSearch] = React.useState("");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<GoalVaultWithRelations | null>(null);
  const [activeDepositWithdraw, setActiveDepositWithdraw] = React.useState<{
    goal: GoalVaultWithRelations;
    mode: "DEPOSIT" | "WITHDRAW";
  } | null>(null);

  const filteredGoals = React.useMemo(() => {
    return initialGoals.filter((g) => {
      if (filter === "ACTIVE" && (g.status === "ACHIEVED" || g.currentAmount >= g.targetAmount)) {
        return false;
      }
      if (filter === "ACHIEVED" && g.status !== "ACHIEVED" && g.currentAmount < g.targetAmount) {
        return false;
      }
      if (search) {
        const query = search.toLowerCase();
        const matchName = g.name.toLowerCase().includes(query);
        const matchAccount = g.linkedAccount?.name.toLowerCase().includes(query);
        if (!matchName && !matchAccount) return false;
      }
      return true;
    });
  }, [initialGoals, filter, search]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Target Tabungan</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
              Target Impian
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Sisihkan uang untuk berbagai kebutuhan dan impian Anda.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/30 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Buat Target Baru</span>
        </Button>
      </div>

      {/* Bento Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Terkumpul */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Tabungan Terkumpul</span>
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
            {isPrivate ? "Rp ••••••••" : formatRupiah(summary.totalSaved)}
          </p>
          <p className="text-[11px] text-zinc-500">Dari seluruh target tabungan</p>
        </div>

        {/* Total Target */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Total Target Impian</span>
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-zinc-200 font-mono tracking-tight">
            {isPrivate ? "Rp ••••••••" : formatRupiah(summary.totalTarget)}
          </p>
          <p className="text-[11px] text-zinc-500">Akumulasi seluruh target</p>
        </div>

        {/* Overall Progress */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Rata-rata Pencapaian</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono tracking-tight">
            {summary.overallProgress}%
          </p>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${summary.overallProgress}%` }}
            />
          </div>
        </div>

        {/* Goals Count */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Status Target</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              {summary.achievedCount}
            </span>
            <span className="text-xs text-zinc-400">Tercapai / {initialGoals.length} Total</span>
          </div>
          <p className="text-[11px] text-zinc-500">{summary.activeCount} target sedang berjalan</p>
        </div>
      </div>

      {/* Toolbar Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900/80 rounded-2xl border border-zinc-800/80 w-fit">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Semua ({initialGoals.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("ACTIVE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === "ACTIVE"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-900/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            🎯 Aktif ({summary.activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("ACHIEVED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === "ACHIEVED"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-900/30"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            🏆 Tercapai ({summary.achievedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari target tabungan..."
            className="pl-9 h-9 text-xs bg-zinc-900/80 border-zinc-800 text-white"
          />
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onOpenDepositWithdraw={(g, mode) => setActiveDepositWithdraw({ goal: g, mode })}
              onEdit={(g) => setEditingGoal(g)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center space-y-4">
          <div className="h-16 w-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
            <PiggyBank className="h-8 w-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-white">Belum Ada Target Tabungan</h3>
            <p className="text-xs text-zinc-400">
              Mulai buat target finansial pertama Anda (seperti Dana Darurat, Liburan, atau DP Rumah).
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/30"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Buat Target Sekarang</span>
          </Button>
        </div>
      )}

      {/* Modals */}
      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        accounts={accounts}
      />

      <EditGoalModal
        isOpen={!!editingGoal}
        onClose={() => setEditingGoal(null)}
        goal={editingGoal}
        accounts={accounts}
      />

      <DepositWithdrawModal
        isOpen={!!activeDepositWithdraw}
        onClose={() => setActiveDepositWithdraw(null)}
        goal={activeDepositWithdraw?.goal || null}
        initialMode={activeDepositWithdraw?.mode || "DEPOSIT"}
        accounts={accounts}
      />
    </div>
  );
}
