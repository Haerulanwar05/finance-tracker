"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutGrid,
  ArrowLeftRight,
  TrendingUp,
  Target,
  WalletCards,
  SlidersHorizontal,
  LogOut,
  Eye,
  EyeOff,
  Laptop,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PrivacyProvider, usePrivacy } from "@/context/privacy-context";
import { OfflineProvider } from "@/context/offline-context";
import { BrandLogo, BrandLogoIcon } from "@/components/shared/brand-logo";
import { PwaRegister } from "@/components/pwa/pwa-register";
import { PwaInstallBanner } from "@/components/pwa/pwa-install-banner";
import { OfflineIndicatorBanner } from "@/components/pwa/offline-indicator-banner";

interface DashboardShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid, color: "text-blue-400", activeBg: "bg-blue-600/15 border-blue-500/30 text-blue-400" },
  { label: "Transaksi", href: "/transactions", icon: ArrowLeftRight, color: "text-emerald-400", activeBg: "bg-emerald-600/15 border-emerald-500/30 text-emerald-400" },
  { label: "Analitik", href: "/analytics", icon: TrendingUp, color: "text-purple-400", activeBg: "bg-purple-600/15 border-purple-500/30 text-purple-400" },
  { label: "Target Tabungan", href: "/vaults", icon: Target, color: "text-amber-400", activeBg: "bg-amber-600/15 border-amber-500/30 text-amber-400" },
  { label: "Rekening", href: "/accounts", icon: WalletCards, color: "text-cyan-400", activeBg: "bg-cyan-600/15 border-cyan-500/30 text-cyan-400" },
  { label: "Pengaturan", href: "/settings", icon: SlidersHorizontal, color: "text-zinc-400", activeBg: "bg-zinc-800/60 border-zinc-700/60 text-zinc-200" },
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
          {/* Logo Brand (Navigasi langsung ke Overview saat sudah login) */}
          <div className="px-2">
            <Link
              href="/dashboard"
              className="block hover:opacity-90 transition-opacity cursor-pointer"
              title="Menuju ke Overview"
            >
              <BrandLogo subtitle="Personal Finance Hub" />
            </Link>
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
                  prefetch={true}
                  className={cn(
                    "relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all group cursor-pointer",
                    isActive
                      ? cn("border shadow-sm font-semibold", item.activeBg)
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-xl flex items-center justify-center transition-all duration-200",
                        isActive
                          ? "bg-white/10 shadow-sm"
                          : "bg-zinc-900/60 group-hover:bg-zinc-800"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-transform group-hover:scale-110",
                          isActive ? item.color : "text-zinc-400 group-hover:text-zinc-200"
                        )}
                      />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  {isActive && (
                    <div className="h-2 w-2 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          {/* Quick Install App Desktop Trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-pwa-install-modal"))}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/15 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Laptop className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">Pasang di Desktop</p>
                <p className="text-[10px] text-zinc-400 truncate">Aplikasi PC / Laptop</p>
              </div>
            </div>
            <Download className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0 mr-0.5" />
          </button>

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
        <header className="h-16 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl px-3.5 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <Link href="/dashboard" className="flex items-center gap-2.5 md:hidden cursor-pointer">
            <BrandLogo size="sm" showText={true} />
          </Link>

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
              <SlidersHorizontal className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-3.5 sm:p-8 pb-24 sm:pb-8 max-w-7xl w-full mx-auto relative z-0 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Thumb Zone) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] pb-1.5 pt-1 bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/80 px-1.5 flex items-center justify-between z-30 shadow-2xl shadow-black">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl text-[9px] font-medium transition-all relative min-w-0 max-w-[62px] cursor-pointer active:scale-95",
                isActive
                  ? cn("font-bold", item.color)
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <div
                className={cn(
                  "h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-200",
                  isActive ? "bg-white/10 shadow-sm" : ""
                )}
              >
                <Icon className={cn("h-4 w-4 transition-transform", isActive && "scale-115")} />
              </div>
              <span className="truncate w-full text-center px-0.5">{item.label.split(" ")[0]}</span>
              {isActive && (
                <div className="absolute -bottom-0.5 h-0.5 w-4 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* PWA Lifecycle & Floating Notifications */}
      <PwaRegister />
      <PwaInstallBanner />
      <OfflineIndicatorBanner />
    </div>
  );
}

export function DashboardShell(props: DashboardShellProps) {
  return (
    <PrivacyProvider>
      <OfflineProvider>
        <DashboardShellInner {...props} />
      </OfflineProvider>
    </PrivacyProvider>
  );
}
