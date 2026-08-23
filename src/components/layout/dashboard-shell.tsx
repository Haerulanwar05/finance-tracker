"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ReceiptText,
  WalletCards,
  PiggyBank,
  PieChart,
  Settings,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PrivacyProvider, usePrivacy } from "@/context/privacy-context";

interface DashboardShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transaksi", href: "/transactions", icon: ReceiptText },
  { label: "Analitik", href: "/analytics", icon: PieChart },
  { label: "Target Tabungan", href: "/vaults", icon: PiggyBank },
  { label: "Rekening", href: "/accounts", icon: WalletCards },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];

function DashboardShellInner({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { isPrivate, togglePrivacy } = usePrivacy();

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[700px] h-[700px] bg-blue-600/5 rounded-full blur-[140px]" />
        <div className="w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-40" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col justify-between border-r border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl p-5 sticky top-0 h-screen z-20">
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <WalletCards className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Finance Tracker</h2>
              <p className="text-[10px] text-zinc-500 font-medium">Catatan Keuangan Pribadi</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all group",
                    isActive
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/25 shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-110",
                        isActive ? "text-blue-400" : "text-zinc-400 group-hover:text-zinc-200"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative">
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-blue-500/20">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-sm" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-zinc-200 truncate">{user.name || "Pengguna"}</p>
                <p className="text-[10px] text-zinc-500 truncate font-mono">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Keluar"
              className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 md:hidden">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <WalletCards className="h-4 w-4 text-blue-400" />
            </div>
            <span className="font-bold text-sm text-white">Finance Tracker</span>
          </div>

          <div className="hidden md:block">
            <p className="text-xs text-zinc-400">Halo, <span className="text-zinc-100 font-semibold">{user.name || "Kawan"}</span> 👋</p>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePrivacy}
              title={isPrivate ? "Tampilkan Nominal Saldo" : "Sembunyikan Saldo"}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer",
                isPrivate
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-300 shadow-sm"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              )}
            >
              {isPrivate ? <EyeOff className="h-3.5 w-3.5 text-amber-400" /> : <Eye className="h-3.5 w-3.5 text-blue-400" />}
              <span className="hidden sm:inline">{isPrivate ? "Saldo Tersembunyi" : "Sembunyikan Saldo"}</span>
            </button>

            <Link
              href="/settings"
              className="md:hidden flex items-center justify-center h-8 w-8 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              title="Pengaturan"
            >
              <Settings className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 pb-24 sm:p-8 max-w-7xl w-full mx-auto relative z-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Thumb Zone) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/80 px-1 flex items-center justify-around z-30 shadow-2xl shadow-black">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl text-[9px] font-medium transition-all relative min-w-[48px]",
                isActive
                  ? "text-blue-400 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <Icon className={cn("h-4 w-4 transition-transform", isActive && "scale-110 text-blue-400")} />
              <span className="truncate max-w-[50px]">{item.label.split(" ")[0]}</span>
              {isActive && (
                <div className="absolute -bottom-1 h-0.5 w-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardShell(props: DashboardShellProps) {
  return (
    <PrivacyProvider>
      <DashboardShellInner {...props} />
    </PrivacyProvider>
  );
}
