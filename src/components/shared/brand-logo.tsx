import * as React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string;
}

export function BrandLogoIcon({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizeMap = {
    sm: "h-8 w-8 min-w-[32px]",
    md: "h-10 w-10 min-w-[40px]",
    lg: "h-12 w-12 min-w-[48px]",
    xl: "h-16 w-16 min-w-[64px]",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/25 via-teal-600/20 to-blue-600/20 border border-emerald-500/40 shadow-lg shadow-emerald-500/15 backdrop-blur-xl group transition-all duration-300 hover:border-emerald-400/70 hover:shadow-emerald-500/30 shrink-0",
        sizeMap[size],
        className
      )}
    >
      {/* Ambient Emerald/Cyan Neon Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/30 via-teal-500/25 to-blue-500/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Modern Minimalist Animated Money Bag ($) SVG */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4/5 w-4/5 relative z-10 drop-shadow-md transition-transform duration-300 animate-money-bag group-hover:scale-110 shrink-0"
      >
        {/* 1. Flared Ruffled Bag Collar (Top opening) */}
        <path
          d="M17 14L13.5 7.5C18.5 9 29.5 9 34.5 7.5L31 14"
          fill="#059669"
          fillOpacity="0.3"
          stroke="#6ee7b7"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Main Curved Money Bag Body */}
        <path
          d="M17 14.5C12.5 18.5 9.5 24 9.5 31.5C9.5 38.5 15.5 42 24 42C32.5 42 38.5 38.5 38.5 31.5C38.5 24 35.5 18.5 31 14.5"
          fill="#059669"
          fillOpacity="0.22"
          stroke="#34d399"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Golden Ribbon Drawstring & Hanging Beads */}
        <path
          d="M16 14.5C20.5 16.5 27.5 16.5 32 14.5"
          stroke="#fde047"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* Left tie cord */}
        <path
          d="M20.5 16L18 20.5"
          stroke="#fde047"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="18" cy="21" r="1.4" fill="#fbbf24" />
        {/* Right tie cord */}
        <path
          d="M27.5 16L30 20.5"
          stroke="#fde047"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="30" cy="21" r="1.4" fill="#fbbf24" />

        {/* 4. Minimalist Modern Dollar ($) Symbol */}
        <g className="animate-money-shimmer">
          {/* Vertical Dollar Spine Line */}
          <line
            x1="24"
            y1="22"
            x2="24"
            y2="37"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* S-Curves of Dollar */}
          <path
            d="M27.5 26.2C27.5 24.4 26 23.2 24 23.2C21.8 23.2 20.5 24.5 20.5 26.2C20.5 29.5 27.5 28.8 27.5 32.6C27.5 34.6 25.8 35.8 24 35.8C21.8 35.8 20.5 34.6 20.5 32.8"
            stroke="#6ee7b7"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 5. Ambient Wealth Sparkle Star (Top Right) */}
        <path
          d="M37 11L38 13.5L40.5 14.5L38 15.5L37 18L36 15.5L33.5 14.5L36 13.5Z"
          fill="#fde047"
          className="animate-pulse"
        />
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
    <div className={cn("flex items-center gap-2.5 sm:gap-3 select-none shrink-0", className)}>
      <BrandLogoIcon size={size} />
      {showText && (
        <div className="flex flex-col min-w-0">
          <span className="text-sm sm:text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent leading-tight truncate">
            Finance<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Tracker</span>
          </span>
          {subtitle && (
            <span className="hidden sm:inline text-[9.5px] sm:text-[10px] text-zinc-400 font-medium tracking-wide truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
