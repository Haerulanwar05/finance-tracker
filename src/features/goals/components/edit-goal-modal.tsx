"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Target,
  Trash2,
  Calendar,
  Wallet,
  Palette,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/currency";
import { GOAL_COLORS, GOAL_ICONS } from "../schema";
import { updateGoal, deleteGoal, GoalVaultWithRelations } from "../actions";
import { GoalIcon } from "./goal-icons";

export interface AccountOption {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: GoalVaultWithRelations | null;
  accounts: AccountOption[];
}

export function EditGoalModal({ isOpen, onClose, goal, accounts }: EditGoalModalProps) {
  if (!isOpen || !goal) return null;

  return (
    <EditGoalModalContent
      key={goal.id}
      onClose={onClose}
      goal={goal}
      accounts={accounts}
    />
  );
}

function EditGoalModalContent({
  onClose,
  goal,
  accounts,
}: {
  onClose: () => void;
  goal: GoalVaultWithRelations;
  accounts: AccountOption[];
}) {
  const router = useRouter();

  const [name, setName] = React.useState(goal.name);
  const [targetAmount, setTargetAmount] = React.useState(
    goal.targetAmount.toLocaleString("id-ID")
  );
  const [deadline, setDeadline] = React.useState(
    goal.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : ""
  );
  const [linkedAccountId, setLinkedAccountId] = React.useState(goal.linkedAccountId || "");
  const [color, setColor] = React.useState<string>(goal.color || GOAL_COLORS[0]);
  const [icon, setIcon] = React.useState<string>(goal.icon || GOAL_ICONS[0].id);
  const [status, setStatus] = React.useState<"ACTIVE" | "ACHIEVED" | "PAUSED">(
    (goal.status as "ACTIVE" | "ACHIEVED" | "PAUSED") || "ACTIVE"
  );
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const numericTarget = parseFloat(targetAmount.replace(/[^0-9]/g, "")) || 0;
    if (numericTarget <= 0) {
      setError("Target nominal tabungan harus lebih dari 0.");
      return;
    }

    setIsSubmitting(true);

    const res = await updateGoal({
      id: goal.id,
      name: name.trim(),
      targetAmount: numericTarget,
      deadline: deadline || null,
      linkedAccountId: linkedAccountId || null,
      color,
      icon,
      status,
    });

    setIsSubmitting(false);

    if (res.success) {
      router.refresh();
      onClose();
    } else {
      setError(res.message || "Gagal memperbarui target tabungan.");
    }
  }

  async function handleDelete() {
    const confirmText =
      goal.currentAmount > 0
        ? `Target "${goal.name}" masih memiliki tabungan ${formatRupiah(goal.currentAmount)}. Yakin ingin menghapus target ini?`
        : `Yakin ingin menghapus target "${goal.name}"?`;

    if (!window.confirm(confirmText)) return;

    setIsDeleting(true);
    const res = await deleteGoal(goal.id);
    setIsDeleting(false);

    if (res.success) {
      router.refresh();
      onClose();
    } else {
      setError(res.message || "Gagal menghapus target tabungan.");
    }
  }

  const numericTarget = parseFloat(targetAmount.replace(/[^0-9]/g, "")) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl p-6 text-zinc-100 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Edit Target Tabungan</h2>
              <p className="text-xs text-zinc-400">Perbarui nominal, deadline, atau status capaian.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs text-rose-400 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Nama Target Tabungan</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-zinc-950/80 border-zinc-800 text-xs"
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">Target Nominal</label>
              {numericTarget > 0 && (
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                  {formatRupiah(numericTarget)}
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
                Rp
              </span>
              <Input
                type="text"
                value={targetAmount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  if (!raw) {
                    setTargetAmount("");
                    return;
                  }
                  const num = parseInt(raw, 10);
                  setTargetAmount(num.toLocaleString("id-ID"));
                }}
                required
                className="pl-11 text-lg font-mono font-bold bg-zinc-950/80 border-zinc-800 text-white"
              />
            </div>
          </div>

          {/* Status, Linked Account & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Status Target</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "ACTIVE" | "ACHIEVED" | "PAUSED")}
                className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="ACTIVE">🎯 Aktif Menabung</option>
                <option value="ACHIEVED">🏆 Tercapai (Selesai)</option>
                <option value="PAUSED">⏸️ Dijeda Sementara</option>
              </select>
            </div>

            {/* Linked Account */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-zinc-400" />
                <span>Rekening Terhubung</span>
              </label>
              <select
                value={linkedAccountId}
                onChange={(e) => setLinkedAccountId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Tanpa Rekening Khusus</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({formatRupiah(acc.balance)})
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                <span>Deadline</span>
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-zinc-950/80 border-zinc-800 text-xs"
              />
            </div>
          </div>

          {/* Color & Icon Picker */}
          <div className="space-y-3 pt-2">
            {/* Color */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-zinc-400" />
                <span>Warna Tema Target</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {GOAL_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="h-7 w-7 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                    style={{
                      backgroundColor: c,
                      transform: color === c ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    {color === c && <div className="h-2 w-2 rounded-full bg-white shadow-sm" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Pilih Ikon Target</label>
              <div className="grid grid-cols-5 gap-2">
                {GOAL_ICONS.map((ic) => (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setIcon(ic.id)}
                    className={`p-2 rounded-2xl border flex flex-col items-center gap-1 text-[11px] transition-all cursor-pointer ${
                      icon === ic.id
                        ? "bg-blue-600/20 border-blue-500 text-blue-300 font-semibold"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    <GoalIcon name={ic.id} className="h-5 w-5" />
                    <span className="truncate max-w-[65px]">{ic.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
              className="text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Hapus Target</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={isSubmitting}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-blue-900/30"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Simpan Perubahan</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
