"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CategoryExpensePoint } from "../actions";
import { formatRupiah } from "@/lib/currency";
import { PieChart as PieChartIcon, ShoppingBag, Sparkles } from "lucide-react";
import { usePrivacy } from "@/context/privacy-context";

interface CategoryDonutChartProps {
  categories: CategoryExpensePoint[];
  totalExpense: number;
}

const LUXURY_PALETTE = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#8b5cf6", // Violet
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#3b82f6", // Blue
];

interface CustomPieTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload?: {
      color?: string;
      percentage?: number;
    };
  }>;
  isPrivate: boolean;
}

function CustomPieTooltip({ active, payload, isPrivate }: CustomPieTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const color = item.payload?.color || "#6366f1";
  const percentage = item.payload?.percentage || 0;

  return (
    <div className="rounded-2xl border border-zinc-700/80 bg-zinc-950/95 backdrop-blur-2xl p-3.5 shadow-2xl space-y-1.5 min-w-[170px] select-none pointer-events-none">
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full shadow-sm"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }}
        />
        <span className="text-xs font-bold text-zinc-200 truncate">{item.name}</span>
      </div>
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-zinc-800/80 text-xs">
        <span className="font-mono font-bold text-white tabular-nums">
          {isPrivate ? "Rp •••••" : formatRupiah(Number(item.value) || 0)}
        </span>
        <span className="text-[11px] font-semibold text-zinc-400 font-mono">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export function CategoryDonutChart({
  categories,
  totalExpense,
}: CategoryDonutChartProps) {
  const { isPrivate } = usePrivacy();
  const [activeCategory, setActiveCategory] = React.useState<CategoryExpensePoint | null>(null);
  
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const chartData = categories.length > 0
    ? categories
    : [{ name: "Belum Ada Pengeluaran", amount: 1, color: "#27272a", percentage: 100 }];

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/80 via-zinc-900/50 to-zinc-950/90 backdrop-blur-xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/5">
            <PieChartIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Kategori Pengeluaran
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                <span>Proporsi</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400">Distribusi alokasi belanja bulan ini</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          {/* Donut Chart Canvas */}
          <div className="sm:col-span-5 h-[220px] relative flex items-center justify-center">
            {!isMounted ? (
              <div className="text-xs text-zinc-500 animate-pulse">Memuat grafik...</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart
                    accessibilityLayer={false}
                    style={{ outline: "none", userSelect: "none" }}
                  >
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={62}
                      outerRadius={88}
                      paddingAngle={3}
                      dataKey="amount"
                      style={{ outline: "none", cursor: "pointer" }}
                      onMouseEnter={(_, index) => {
                        if (categories[index]) setActiveCategory(categories[index]);
                      }}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      {chartData.map((entry, index) => {
                        const isHovered = activeCategory?.name === entry.name;
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color || LUXURY_PALETTE[index % LUXURY_PALETTE.length]}
                            stroke="#09090b"
                            strokeWidth={isHovered ? 3.5 : 2}
                            opacity={activeCategory && !isHovered ? 0.45 : 1}
                            style={{ outline: "none", transition: "all 0.2s ease" }}
                          />
                        );
                      })}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Dynamic Center Badge (No Overlap, Seamless Transition) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="h-[104px] w-[104px] rounded-full bg-zinc-950/90 border border-zinc-800/90 flex flex-col items-center justify-center shadow-inner shadow-black/80 backdrop-blur-lg p-1.5 transition-all duration-200">
                    {activeCategory ? (
                      <div className="flex flex-col items-center justify-center text-center px-1 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-1.5 max-w-[88px]">
                          <span
                            className="h-2 w-2 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: activeCategory.color || "#6366f1" }}
                          />
                          <span className="text-[10.5px] font-bold text-zinc-200 truncate">
                            {activeCategory.name}
                          </span>
                        </div>
                        <span className="text-[11px] sm:text-xs font-extrabold text-white font-mono tabular-nums leading-tight mt-1">
                          {isPrivate ? "Rp •••" : formatRupiah(activeCategory.amount)}
                        </span>
                        <span
                          className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-md mt-1 text-white border"
                          style={{
                            backgroundColor: `${activeCategory.color || "#6366f1"}25`,
                            borderColor: `${activeCategory.color || "#6366f1"}60`,
                            color: activeCategory.color || "#a5b4fc",
                          }}
                        >
                          {activeCategory.percentage}%
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center px-1 animate-in fade-in zoom-in-95 duration-150">
                        <span className="text-[9px] text-zinc-400 font-medium tracking-wide uppercase">
                          Total Belanja
                        </span>
                        <span className="text-[11px] sm:text-xs font-extrabold text-white font-mono tabular-nums leading-tight mt-0.5">
                          {isPrivate ? "Rp •••" : formatRupiah(totalExpense)}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-sans mt-0.5">
                          {categories.length} Kategori
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Categories Legend List */}
          <div className="sm:col-span-7 space-y-2 max-h-[230px] overflow-y-auto pr-1">
            {categories.slice(0, 5).map((cat, idx) => {
              const color = cat.color || LUXURY_PALETTE[idx % LUXURY_PALETTE.length];
              const isHovered = activeCategory?.name === cat.name;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveCategory(cat)}
                  onMouseLeave={() => setActiveCategory(null)}
                  className={`space-y-1.5 p-2 rounded-xl border transition-all duration-150 cursor-pointer ${
                    isHovered
                      ? "bg-zinc-800/80 border-zinc-600 scale-[1.02] shadow-md shadow-black/40"
                      : "bg-zinc-900/40 border-zinc-800/40 hover:bg-zinc-900/70 hover:border-zinc-700/60"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
                      />
                      <span className={`font-medium truncate ${isHovered ? "text-white font-semibold" : "text-zinc-200"}`}>
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono">
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md border ${
                        isHovered
                          ? "bg-white text-zinc-950 border-white"
                          : "bg-zinc-800/80 text-white border-zinc-700/60"
                      }`}>
                        {cat.percentage}%
                      </span>
                      <span className="text-zinc-400 font-normal text-[11px]">
                        {isPrivate ? "•••" : formatRupiah(cat.amount)}
                      </span>
                    </div>
                  </div>

                  {/* Bar meter with subtle gradient fill */}
                  <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: color,
                        boxShadow: isHovered ? `0 0 10px ${color}` : `0 0 6px ${color}40`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

