import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  showPasswordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, label, id, showPasswordToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={inputId}
            type={actualType}
            ref={ref}
            className={cn(
              "w-full rounded-2xl bg-zinc-900/80 border border-white/[0.08] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition-all focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50",
              isPassword && showPasswordToggle && "pr-10",
              error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30",
              className
            )}
            {...props}
          />
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-zinc-400 hover:text-zinc-200" />
              ) : (
                <Eye className="h-4 w-4 text-zinc-400 hover:text-zinc-200" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-rose-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

