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
import { BarChart3 } from "lucide-react";
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
  }>;
  label?: string;
  isPrivate: boolean;
}

function CustomTooltip({ active, payload, label, isPrivate }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl p-3.5 shadow-2xl space-y-2 min-w-[180px]">
      <p className="text-xs font-bold text-zinc-200 border-b border-zinc-800/80 pb-1.5">
        Bulan {label}
      </p>
      <div className="space-y-1.5 text-xs">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}</span>
            </span>
            <span className="font-mono font-bold text-white tabular-nums">
              {isPrivate ? "Rp •••••" : formatRupiah(entry.value)}
            </span>
          </div>
        ))}
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
    <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <BarChart3 className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Tren Arus Kas (6 Bulan)
            </h3>
            <p className="text-xs text-zinc-400">
              Perbandingan pemasukan dan pengeluaran per bulan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            <span className="text-zinc-400">Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
            <span className="text-zinc-400">Pengeluaran</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[260px] w-full pt-2">
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
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
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
                cursor={{ fill: "rgba(255, 255, 255, 0.03)", radius: 8 }}
              />
              <Bar
                dataKey="pemasukan"
                name="Pemasukan"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="pengeluaran"
                name="Pengeluaran"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
