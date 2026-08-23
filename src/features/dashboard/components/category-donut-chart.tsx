"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CategoryExpensePoint } from "../actions";
import { formatRupiah } from "@/lib/currency";
import { PieChart as PieChartIcon, ShoppingBag } from "lucide-react";
import { usePrivacy } from "@/context/privacy-context";

interface CategoryDonutChartProps {
  categories: CategoryExpensePoint[];
  totalExpense: number;
}

const FALLBACK_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
  "#64748B",
];

export function CategoryDonutChart({
  categories,
  totalExpense,
}: CategoryDonutChartProps) {
  const { isPrivate } = usePrivacy();
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const chartData = categories.length > 0
    ? categories
    : [{ name: "Belum Ada Pengeluaran", amount: 1, color: "#27272a", percentage: 100 }];

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <PieChartIcon className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Kategori Pengeluaran
            </h3>
            <p className="text-xs text-zinc-400">Proporsi belanja bulan ini</p>
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="py-12 text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <p className="text-xs text-zinc-400">Belum ada catatan pengeluaran di bulan ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Donut Chart Canvas */}
          <div className="sm:col-span-5 h-[200px] relative flex items-center justify-center">
            {!isMounted ? (
              <div className="text-xs text-zinc-500 animate-pulse">Memuat grafik...</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      formatter={(value: unknown, name: unknown) => [
                        isPrivate ? "Rp •••••" : formatRupiah(Number(value) || 0),
                        String(name || ""),
                      ]}
                      contentStyle={{
                        backgroundColor: "#09090b",
                        borderColor: "#27272a",
                        borderRadius: "1rem",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    />
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={78}
                      paddingAngle={3}
                      dataKey="amount"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                          stroke="#18181b"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Summary */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-zinc-400 font-medium">Total Belanja</span>
                  <span className="text-xs sm:text-sm font-bold text-white font-mono tabular-nums">
                    {isPrivate ? "Rp •••" : formatRupiah(totalExpense)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Categories Legend List */}
          <div className="sm:col-span-7 space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {categories.slice(0, 5).map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || FALLBACK_COLORS[idx % FALLBACK_COLORS.length] }}
                    />
                    <span className="text-zinc-300 truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono text-zinc-200">
                    <span>{cat.percentage}%</span>
                    <span className="text-zinc-500 font-normal">
                      ({isPrivate ? "•••" : formatRupiah(cat.amount)})
                    </span>
                  </div>
                </div>

                {/* Bar meter */}
                <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
