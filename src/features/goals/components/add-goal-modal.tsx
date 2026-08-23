"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Target,
  Plus,
  Sparkles,
  Calendar,
  Wallet,
  Palette,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/currency";
import { GOAL_COLORS, GOAL_ICONS } from "../schema";
import { createGoal } from "../actions";
import { GoalIcon } from "./goal-icons";

export interface AccountOption {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: AccountOption[];
}

const PRESET_GOALS = [
  { name: "Dana Darurat", icon: "shield", color: "#10B981", target: 30000000 },
  { name: "Liburan", icon: "plane", color: "#06B6D4", target: 15000000 },
  { name: "Beli Rumah", icon: "home", color: "#8B5CF6", target: 100000000 },
  { name: "Gadget Baru", icon: "laptop", color: "#3B82F6", target: 20000000 },
  { name: "Modal Usaha", icon: "briefcase", color: "#F59E0B", target: 50000000 },
  { name: "Kendaraan", icon: "car", color: "#EC4899", target: 25000000 },
];

export function AddGoalModal({ isOpen, onClose, accounts }: AddGoalModalProps) {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [targetAmount, setTargetAmount] = React.useState("");
  const [deadline, setDeadline] = React.useState("");
  const [linkedAccountId, setLinkedAccountId] = React.useState("");
  const [color, setColor] = React.useState<string>(GOAL_COLORS[0]);
  const [icon, setIcon] = React.useState<string>(GOAL_ICONS[0].id);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function resetForm() {
    setName("");
    setTargetAmount("");
    setDeadline("");
    setLinkedAccountId("");
    setColor(GOAL_COLORS[0]);
    setIcon(GOAL_ICONS[0].id);
    setError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleApplyPreset(preset: (typeof PRESET_GOALS)[number]) {
    setName(preset.name);
    setIcon(preset.icon);
    setColor(preset.color);
    setTargetAmount(preset.target.toLocaleString("id-ID"));
  }

  function handleQuickAddAmount(added: number) {
    const current = parseFloat(targetAmount.replace(/[^0-9]/g, "")) || 0;
    const next = current + added;
    setTargetAmount(next.toLocaleString("id-ID"));
  }

  function handleDeadlineShortcut(months: number) {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    setDeadline(d.toISOString().split("T")[0]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const numericTarget = parseFloat(targetAmount.replace(/[^0-9]/g, "")) || 0;
    if (numericTarget <= 0) {
      setError("Target nominal tabungan harus lebih dari 0.");
      return;
    }

    if (!name.trim()) {
      setError("Nama target tabungan wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    const res = await createGoal({
      name: name.trim(),
      targetAmount: numericTarget,
      deadline: deadline || null,
      linkedAccountId: linkedAccountId || null,
      color,
      icon,
    });

    setIsSubmitting(false);

    if (res.success) {
      router.refresh();
      handleClose();
    } else {
      setError(res.message || "Gagal membuat target tabungan.");
    }
  }

  if (!isOpen) return null;

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
              <h2 className="text-base sm:text-lg font-bold text-white">Buat Target Tabungan</h2>
              <p className="text-xs text-zinc-400">
                Tentukan target nominal dan mulai menabung secara bertahap.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
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

        {/* Quick Presets */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Pilihan Cepat</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_GOALS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-xs px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <GoalIcon name={p.icon} className="h-3.5 w-3.5 text-blue-400" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Nama Target Tabungan</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dana Darurat 2026, Liburan ke Bali"
              required
              className="bg-zinc-950/80 border-zinc-800 text-xs"
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">Target Nominal yang Ingin Dicapai</label>
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
                placeholder="10.000.000"
                required
                className="pl-11 text-lg font-mono font-bold bg-zinc-950/80 border-zinc-800 text-white"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[1000000, 5000000, 10000000, 25000000, 50000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-lg border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  +{formatRupiah(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Linked Account & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Linked Account */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-zinc-400" />
                <span>Hubungkan Rekening (Opsional)</span>
              </label>
              <select
                value={linkedAccountId}
                onChange={(e) => setLinkedAccountId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Tanpa Rekening Khusus (Virtual)</option>
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
                <span>Target Tanggal (Deadline)</span>
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-zinc-950/80 border-zinc-800 text-xs"
              />
              <div className="flex gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleDeadlineShortcut(3)}
                  className="text-[10px] px-2 py-0.5 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                >
                  +3 Bln
                </button>
                <button
                  type="button"
                  onClick={() => handleDeadlineShortcut(6)}
                  className="text-[10px] px-2 py-0.5 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                >
                  +6 Bln
                </button>
                <button
                  type="button"
                  onClick={() => handleDeadlineShortcut(12)}
                  className="text-[10px] px-2 py-0.5 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
                >
                  +1 Thn
                </button>
              </div>
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
                      outline: color === c ? "2px solid white" : "none",
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
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
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
              <Plus className="h-4 w-4" />
              <span>Simpan Target</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
