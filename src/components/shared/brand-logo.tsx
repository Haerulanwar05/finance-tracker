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
    sm: "h-7 w-7",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 via-blue-600/15 to-teal-500/20 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 backdrop-blur-xl group transition-all duration-300 hover:border-emerald-400/60 hover:shadow-emerald-500/25",
        sizeMap[size],
        className
      )}
    >
      {/* Ambient Emerald/Cyan Neon Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/30 via-teal-500/20 to-blue-500/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Modern Minimalist Animated Money Bag ($) SVG */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-3/4 w-3/4 relative z-10 drop-shadow-md transition-transform duration-300 animate-money-bag group-hover:scale-110"
      >
        <defs>
          {/* Money Bag Pouch Gradient */}
          <linearGradient id="bagPouchGrad" x1="12" y1="12" x2="36" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
          </linearGradient>

          {/* Bag Stroke Gradient */}
          <linearGradient id="bagStrokeGrad" x1="10" y1="8" x2="38" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="45%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Dollar Sign Luxury Gradient */}
          <linearGradient id="dollarGrad" x1="20" y1="20" x2="28" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Ribbon Gold/Amber Accent */}
          <linearGradient id="ribbonGrad" x1="16" y1="13" x2="32" y2="17" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        {/* 1. Flared Ruffled Bag Collar (Top cinched opening) */}
        <path
          d="M17 14L14 7.5C18.5 9 29.5 9 34 7.5L31 14"
          fill="url(#bagPouchGrad)"
          stroke="url(#bagStrokeGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Main Curved Money Bag Body */}
        <path
          d="M17.2 14.5C13 18.5 10 24 10 31.5C10 38.5 16 42 24 42C32 42 38 38.5 38 31.5C38 24 35 18.5 30.8 14.5"
          fill="url(#bagPouchGrad)"
          stroke="url(#bagStrokeGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 3. Golden Ribbon Drawstring & Hanging Tie Beads */}
        <path
          d="M16.5 14.5C21 16.2 27 16.2 31.5 14.5"
          stroke="url(#ribbonGrad)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* Left tie cord */}
        <path
          d="M21 15.8L18.5 20.5"
          stroke="url(#ribbonGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="18.5" cy="21" r="1.4" fill="#fbbf24" />
        {/* Right tie cord */}
        <path
          d="M27 15.8L29.5 20.5"
          stroke="url(#ribbonGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="29.5" cy="21" r="1.4" fill="#fbbf24" />

        {/* 4. Minimalist Modern Dollar ($) Symbol */}
        <g className="animate-money-shimmer">
          {/* Vertical Dollar Spine Line */}
          <line
            x1="24"
            y1="23"
            x2="24"
            y2="36"
            stroke="url(#dollarGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* S-Curves of Dollar */}
          <path
            d="M26.8 26.2C26.8 24.8 25.6 24 24 24C22.2 24 21.2 25 21.2 26.4C21.2 29.2 26.8 28.5 26.8 32C26.8 33.8 25.5 34.8 24 34.8C22.2 34.8 21.2 33.8 21.2 32.4"
            stroke="url(#dollarGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 5. Ambient Wealth Sparkle Star (Top Right) */}
        <path
          d="M37 12L38 14.5L40.5 15.5L38 16.5L37 19L36 16.5L33.5 15.5L36 14.5Z"
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
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <BrandLogoIcon size={size} />
      {showText && (
        <div className="flex flex-col">
          <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent leading-tight">
            Finance<span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Tracker</span>
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
