import * as React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string;
}

export function BrandLogoIcon({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizeMap = {
    sm: "h-7 w-7",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 via-blue-600/15 to-emerald-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/10 backdrop-blur-xl group transition-all duration-300 hover:border-blue-400/50 hover:shadow-blue-500/20",
        sizeMap[size],
        className
      )}
    >
      {/* Ambient Neon Backlight Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-emerald-400/30 blur-md opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Modern Dynamic Geometric SVG Brandmark */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-3/5 w-3/5 relative z-10 drop-shadow-md transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="logoPrimaryGrad" x1="4" y1="8" x2="44" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="logoAccentGrad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Outer Hex-Orbit Ring */}
        <path
          d="M24 6L39.5885 15V33L24 42L8.41154 33V15L24 6Z"
          stroke="url(#logoPrimaryGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-90"
        />

        {/* Dynamic Wealth Growth Chevron (Ascending Prism) */}
        <path
          d="M16 26L24 18L32 26"
          stroke="url(#logoAccentGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Core Glowing Emerald Pulse Node */}
        <circle cx="24" cy="29" r="3.2" fill="#10b981" className="animate-pulse" />
      </svg>
    </div>
  );
}

export function BrandLogo({
  className,
  size = "md",
  showText = true,
  subtitle,
}: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <BrandLogoIcon size={size} />
      {showText && (
        <div className="flex flex-col">
          <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent leading-tight">
            Finance<span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Tracker</span>
          </span>
          {subtitle && (
            <span className="text-[10px] text-zinc-400 font-medium tracking-wide">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
