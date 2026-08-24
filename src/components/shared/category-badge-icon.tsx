import * as React from "react";
import {
  UtensilsCrossed,
  CarFront,
  ShoppingBag,
  Zap,
  Film,
  HeartPulse,
  Banknote,
  Briefcase,
  TrendingUp,
  Coins,
  Gift,
  GraduationCap,
  ArrowLeftRight,
  Sparkles,
  Tag,
  Wallet,
  Coffee,
  Fuel,
  Store,
  Wifi,
  Gamepad2,
  Stethoscope,
  BookOpen,
  Receipt,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryBadgeIconProps {
  categoryName?: string | null;
  categoryIcon?: string | null;
  type?: "EXPENSE" | "INCOME" | "TRANSFER" | string;
  color?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

function resolveIconAndColors(
  categoryName?: string | null,
  categoryIcon?: string | null,
  type?: string,
  customColor?: string | null
): { Icon: LucideIcon; bgClass: string; borderClass: string; textClass: string; defaultColor: string } {
  const normName = (categoryName || "").toLowerCase();
  const normIcon = (categoryIcon || "").toLowerCase();

  // 1. Transfer
  if (type === "TRANSFER" || normName.includes("transfer") || normName.includes("pindah")) {
    return {
      Icon: ArrowLeftRight,
      bgClass: "bg-purple-500/15",
      borderClass: "border-purple-500/30",
      textClass: "text-purple-400",
      defaultColor: "#A855F7",
    };
  }

  // 2. Food & Beverage
  if (
    normIcon === "utensils" ||
    normIcon === "coffee" ||
    normName.includes("makan") ||
    normName.includes("minum") ||
    normName.includes("resto") ||
    normName.includes("cafe") ||
    normName.includes("kopi") ||
    normName.includes("snack")
  ) {
    return {
      Icon: normName.includes("kopi") || normName.includes("cafe") ? Coffee : UtensilsCrossed,
      bgClass: "bg-orange-500/15",
      borderClass: "border-orange-500/30",
      textClass: "text-orange-400",
      defaultColor: "#F97316",
    };
  }

  // 3. Transportation
  if (
    normIcon === "car" ||
    normIcon === "fuel" ||
    normName.includes("transpor") ||
    normName.includes("bensin") ||
    normName.includes("ojek") ||
    normName.includes("gojek") ||
    normName.includes("grab") ||
    normName.includes("parkir") ||
    normName.includes("tol")
  ) {
    return {
      Icon: normName.includes("bensin") || normName.includes("bbm") ? Fuel : CarFront,
      bgClass: "bg-blue-500/15",
      borderClass: "border-blue-500/30",
      textClass: "text-blue-400",
      defaultColor: "#3B82F6",
    };
  }

  // 4. Shopping & Groceries
  if (
    normIcon === "shopping-bag" ||
    normIcon === "shopping-cart" ||
    normName.includes("belanja") ||
    normName.includes("mart") ||
    normName.includes("pasar") ||
    normName.includes("baju") ||
    normName.includes("sepatu")
  ) {
    return {
      Icon: normName.includes("mart") || normName.includes("pasar") ? Store : ShoppingBag,
      bgClass: "bg-pink-500/15",
      borderClass: "border-pink-500/30",
      textClass: "text-pink-400",
      defaultColor: "#EC4899",
    };
  }

  // 5. Bills & Utilities
  if (
    normIcon === "zap" ||
    normName.includes("tagihan") ||
    normName.includes("listrik") ||
    normName.includes("air") ||
    normName.includes("pdam") ||
    normName.includes("wifi") ||
    normName.includes("internet") ||
    normName.includes("pulsa") ||
    normName.includes("paket data")
  ) {
    return {
      Icon: normName.includes("wifi") || normName.includes("internet") ? Wifi : Zap,
      bgClass: "bg-amber-500/15",
      borderClass: "border-amber-500/30",
      textClass: "text-amber-400",
      defaultColor: "#EAB308",
    };
  }

  // 6. Entertainment & Recreation
  if (
    normIcon === "film" ||
    normName.includes("hiburan") ||
    normName.includes("film") ||
    normName.includes("bioskop") ||
    normName.includes("game") ||
    normName.includes("netflix") ||
    normName.includes("spotify") ||
    normName.includes("rekreasi")
  ) {
    return {
      Icon: normName.includes("game") ? Gamepad2 : Film,
      bgClass: "bg-violet-500/15",
      borderClass: "border-violet-500/30",
      textClass: "text-violet-400",
      defaultColor: "#8B5CF6",
    };
  }

  // 7. Health & Medical
  if (
    normIcon === "heart-pulse" ||
    normName.includes("sehat") ||
    normName.includes("obat") ||
    normName.includes("dokter") ||
    normName.includes("klinik") ||
    normName.includes("apotek") ||
    normName.includes("rs")
  ) {
    return {
      Icon: normName.includes("dokter") || normName.includes("klinik") ? Stethoscope : HeartPulse,
      bgClass: "bg-rose-500/15",
      borderClass: "border-rose-500/30",
      textClass: "text-rose-400",
      defaultColor: "#EF4444",
    };
  }

  // 8. Education & Courses
  if (
    normIcon === "graduation-cap" ||
    normIcon === "book" ||
    normName.includes("edukasi") ||
    normName.includes("buku") ||
    normName.includes("kursus") ||
    normName.includes("kuliah") ||
    normName.includes("sekolah")
  ) {
    return {
      Icon: normName.includes("buku") ? BookOpen : GraduationCap,
      bgClass: "bg-teal-500/15",
      borderClass: "border-teal-500/30",
      textClass: "text-teal-400",
      defaultColor: "#14B8A6",
    };
  }

  // 9. Salary & Primary Income
  if (
    normIcon === "briefcase" ||
    normIcon === "banknote" ||
    normName.includes("gaji") ||
    normName.includes("salary") ||
    normName.includes("upah") ||
    normName.includes("thr")
  ) {
    return {
      Icon: normName.includes("gaji") ? Banknote : Briefcase,
      bgClass: "bg-emerald-500/15",
      borderClass: "border-emerald-500/30",
      textClass: "text-emerald-400",
      defaultColor: "#10B981",
    };
  }

  // 10. Business & Side Hustle
  if (
    normIcon === "trending-up" ||
    normName.includes("bisnis") ||
    normName.includes("usaha") ||
    normName.includes("freelance") ||
    normName.includes("proyek")
  ) {
    return {
      Icon: TrendingUp,
      bgClass: "bg-cyan-500/15",
      borderClass: "border-cyan-500/30",
      textClass: "text-cyan-400",
      defaultColor: "#06B6D4",
    };
  }

  // 11. Investment & Dividends
  if (
    normIcon === "coins" ||
    normIcon === "piggy-bank" ||
    normName.includes("invest") ||
    normName.includes("dividen") ||
    normName.includes("saham") ||
    normName.includes("reksadana") ||
    normName.includes("crypto")
  ) {
    return {
      Icon: Coins,
      bgClass: "bg-emerald-500/15",
      borderClass: "border-emerald-500/30",
      textClass: "text-emerald-400",
      defaultColor: "#10B981",
    };
  }

  // 12. Gift & Donation
  if (
    normIcon === "gift" ||
    normName.includes("hadiah") ||
    normName.includes("bonus") ||
    normName.includes("donasi") ||
    normName.includes("zakat") ||
    normName.includes("sedekah")
  ) {
    return {
      Icon: Gift,
      bgClass: "bg-indigo-500/15",
      borderClass: "border-indigo-500/30",
      textClass: "text-indigo-400",
      defaultColor: "#6366F1",
    };
  }

  // Fallback based on Transaction Type
  if (type === "INCOME") {
    return {
      Icon: Sparkles,
      bgClass: "bg-emerald-500/15",
      borderClass: "border-emerald-500/30",
      textClass: "text-emerald-400",
      defaultColor: "#10B981",
    };
  }

  if (type === "EXPENSE") {
    return {
      Icon: Tag,
      bgClass: "bg-rose-500/15",
      borderClass: "border-rose-500/30",
      textClass: "text-rose-400",
      defaultColor: "#F43F5E",
    };
  }

  return {
    Icon: Wallet,
    bgClass: "bg-zinc-800",
    borderClass: "border-zinc-700",
    textClass: "text-zinc-300",
    defaultColor: "#71717A",
  };
}

export function CategoryBadgeIcon({
  categoryName,
  categoryIcon,
  type,
  color,
  size = "md",
  className,
}: CategoryBadgeIconProps) {
  const { Icon, bgClass, borderClass, textClass, defaultColor } = resolveIconAndColors(
    categoryName,
    categoryIcon,
    type,
    color
  );

  const sizeMap = {
    xs: { container: "h-6 w-6 rounded-lg", icon: "h-3.5 w-3.5" },
    sm: { container: "h-8 w-8 rounded-xl", icon: "h-4 w-4" },
    md: { container: "h-10 w-10 rounded-2xl", icon: "h-5 w-5" },
    lg: { container: "h-12 w-12 rounded-2xl", icon: "h-6 w-6" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center border shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm",
        currentSize.container,
        bgClass,
        borderClass,
        textClass,
        className
      )}
      style={color ? { color: color, borderColor: `${color}40`, backgroundColor: `${color}1A` } : undefined}
    >
      <Icon className={cn(currentSize.icon, "drop-shadow-sm")} />
    </div>
  );
}
