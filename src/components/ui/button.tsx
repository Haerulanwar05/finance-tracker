import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "glass" | "emerald";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-2xl transition-[transform,background-color,border-color,box-shadow,color] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";

    const variants = {
      primary:
        "bg-gradient-to-b from-white to-zinc-200 hover:from-zinc-100 hover:to-zinc-300 text-zinc-950 font-bold border border-white/50 shadow-[0_4px_16px_-2px_rgba(255,255,255,0.18),inset_0_1px_0_0_rgba(255,255,255,0.8)]",
      emerald:
        "bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-zinc-950 font-bold border border-emerald-300/40 shadow-[0_4px_16px_-2px_rgba(16,185,129,0.35),inset_0_1px_0_0_rgba(255,255,255,0.3)]",
      secondary:
        "bg-zinc-900/90 hover:bg-zinc-800/90 text-zinc-200 border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-white/[0.15]",
      outline:
        "bg-transparent hover:bg-white/[0.05] text-zinc-300 hover:text-white border border-white/[0.1] hover:border-white/[0.2] shadow-xs",
      ghost:
        "bg-transparent hover:bg-white/[0.05] text-zinc-400 hover:text-white",
      danger:
        "bg-gradient-to-b from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold shadow-[0_4px_16px_-2px_rgba(225,29,72,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] border border-rose-500/40",
      glass:
        "bg-zinc-900/60 hover:bg-zinc-800/80 backdrop-blur-xl text-zinc-100 border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
    };

    const sizes = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5 h-8.5",
      md: "text-xs sm:text-sm px-4 py-2 gap-2 h-10",
      lg: "text-sm sm:text-base px-5 py-2.5 gap-2.5 h-11",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
