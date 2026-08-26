"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MonthlyCashflowPoint } from "../actions";
import { formatCompactRupiah, formatRupiah } from "@/lib/currency";
import { BarChart3, TrendingUp } from "lucide-react";
import { usePrivacy } from "@/context/privacy-context";

interface CashflowChartProps {
  data: MonthlyCashflowPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    dataKey?: string;
  }>;
  label?: string;
  isPrivate: boolean;
}

function CustomTooltip({ active, payload, label, isPrivate }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const income = payload.find((p) => p.dataKey === "pemasukan")?.value || 0;
  const expense = payload.find((p) => p.dataKey === "pengeluaran")?.value || 0;
  const net = income - expense;

  return (
    <div className="rounded-2xl border border-white/[0.12] bg-[#09090c]/95 backdrop-blur-2xl p-4 shadow-2xl space-y-2.5 min-w-[210px] select-none pointer-events-none">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
        <span className="text-xs font-bold text-zinc-200">
          Bulan {label}
        </span>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono ${
            net >= 0
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
          }`}
        >
          {net >= 0 ? "+Surplus" : "-Defisit"}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Pemasukan</span>
          </span>
          <span className="font-mono font-bold text-emerald-400">
            {isPrivate ? "Rp •••••" : formatRupiah(income)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span>Pengeluaran</span>
          </span>
          <span className="font-mono font-bold text-zinc-200">
            {isPrivate ? "Rp •••••" : formatRupiah(expense)}
          </span>
        </div>

        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-3">
          <span className="text-zinc-400 text-[11px]">Net Tabungan</span>
          <span
            className={`font-mono font-extrabold text-xs ${
              net >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isPrivate ? "Rp •••••" : `${net >= 0 ? "+" : ""}${formatRupiah(net)}`}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CashflowChart({ data }: CashflowChartProps) {
  const { isPrivate } = usePrivacy();
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/85 via-zinc-900/50 to-zinc-950/90 backdrop-blur-2xl p-5 sm:p-6 space-y-4 shadow-[0_12px_36px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)] flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8.5 w-8.5 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-zinc-200 flex items-center justify-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Tren Arus Kas (6 Bulan)
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                <TrendingUp className="h-3 w-3" />
                <span>Cashflow</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Perbandingan pertumbuhan pemasukan vs pengeluaran
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-xl self-start sm:self-auto shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-300 font-medium text-[11px]">Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-400" />
            <span className="text-zinc-300 font-medium text-[11px]">Pengeluaran</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[270px] w-full pt-2">
        {!isMounted ? (
          <div className="h-full w-full flex items-center justify-center text-xs text-zinc-500 animate-pulse">
            Memuat grafik arus kas...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={6}
              accessibilityLayer={false}
              style={{ outline: "none", userSelect: "none" }}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.85} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" stopOpacity={1} />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity={0.85} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                strokeOpacity={0.4}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) =>
                  isPrivate ? "•••" : formatCompactRupiah(val).replace("Rp ", "")
                }
              />
              <Tooltip
                content={<CustomTooltip isPrivate={isPrivate} />}
                cursor={{ fill: "rgba(255, 255, 255, 0.03)", radius: 10 }}
              />
              <Bar
                dataKey="pemasukan"
                name="Pemasukan"
                fill="url(#incomeGradient)"
                radius={[6, 6, 2, 2]}
                maxBarSize={32}
                activeBar={false}
              />
              <Bar
                dataKey="pengeluaran"
                name="Pengeluaran"
                fill="url(#expenseGradient)"
                radius={[6, 6, 2, 2]}
                maxBarSize={32}
                activeBar={false}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
