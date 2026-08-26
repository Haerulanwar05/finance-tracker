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

interface NavItem {
  label: string;
  shortLabel: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", shortLabel: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Transaksi", shortLabel: "Transaksi", href: "/transactions", icon: ArrowLeftRight },
  { label: "Analitik", shortLabel: "Analitik", href: "/analytics", icon: TrendingUp },
  { label: "Target Tabungan", shortLabel: "Tabungan", href: "/vaults", icon: Target },
  { label: "Rekening", shortLabel: "Rekening", href: "/accounts", icon: WalletCards },
  { label: "Pengaturan", shortLabel: "Pengaturan", href: "/settings", icon: SlidersHorizontal },
];

function DashboardShellInner({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { isPrivate, togglePrivacy } = usePrivacy();

  const isItemActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    if (href === "/vaults") {
      return pathname.startsWith("/vaults") || pathname.startsWith("/goals");
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-[#08080a] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-200 font-sans">
      {/* Subtle Architectural Vignette (Zero fuzzy AI-blobs) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(16,185,129,0.06),transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.03),transparent_50%)]" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col justify-between border-r border-white/[0.07] bg-[#09090c]/90 backdrop-blur-2xl p-5 sticky top-0 h-screen z-20">
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="px-2">
            <Link
              href="/dashboard"
              className="block hover:opacity-90 transition-opacity cursor-pointer"
              title="Menuju ke Overview"
            >
              <BrandLogo subtitle="Personal Wealth Hub" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = isItemActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    "relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-150 group cursor-pointer",
                    isActive
                      ? "bg-white/[0.08] border border-white/[0.12] text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-xl flex items-center justify-center transition-all duration-200",
                        isActive
                          ? "bg-emerald-500/20 text-emerald-400 shadow-sm"
                          : "bg-zinc-900/80 text-zinc-400 group-hover:text-zinc-200 group-hover:bg-zinc-800"
                      )}
                    >
                      <Icon className="h-4 w-4 transition-transform group-hover:scale-105" />
                    </div>
                    <span>{item.label}</span>
                  </div>

                  {isActive && (
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="pt-4 border-t border-white/[0.08] space-y-3">
          {/* Quick Install App Desktop Trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-pwa-install-modal"))}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all text-left cursor-pointer group shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Laptop className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">Pasang di Desktop</p>
                <p className="text-[10px] text-zinc-400 truncate">Aplikasi PC / Laptop</p>
              </div>
            </div>
            <Download className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0 mr-0.5" />
          </button>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative">
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/[0.1] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#09090c] shadow-xs" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-zinc-200 truncate">{user.name || "Pengguna"}</p>
                <p className="text-[10px] text-zinc-500 truncate font-mono">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Keluar"
              aria-label="Keluar dari akun"
              className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8 relative z-10">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/[0.07] bg-[#09090c]/85 backdrop-blur-2xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <Link href="/dashboard" className="flex items-center gap-2.5 md:hidden cursor-pointer">
            <BrandLogo size="sm" showText={true} />
          </Link>

          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistem Finansial Aktif • Halo,</span>
            <span className="text-zinc-100 font-semibold">{user.name || "Kawan"}</span>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePrivacy}
              title={isPrivate ? "Tampilkan Nominal Saldo" : "Sembunyikan Saldo"}
              aria-label={isPrivate ? "Tampilkan Nominal Saldo" : "Sembunyikan Saldo"}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer",
                isPrivate
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[inset_0_1px_0_rgba(245,158,11,0.2)]"
                  : "bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              )}
            >
              {isPrivate ? <EyeOff className="h-3.5 w-3.5 text-amber-400" /> : <Eye className="h-3.5 w-3.5 text-emerald-400" />}
              <span className="hidden sm:inline">{isPrivate ? "Saldo Disamarkan" : "Sembunyikan Saldo"}</span>
            </button>

            <Link
              href="/settings"
              className="md:hidden flex items-center justify-center h-8.5 w-8.5 rounded-2xl border border-white/[0.08] bg-zinc-900/90 text-zinc-400 hover:text-white transition-colors"
              title="Pengaturan"
              aria-label="Pengaturan"
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

      {/* Mobile Bottom Navigation Bar (Thumb Zone Dock) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[66px] pb-2 pt-1 bg-[#09090c]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 flex items-center justify-around z-30 shadow-[0_-8px_32px_rgba(0,0,0,0.8)]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-1 rounded-xl text-[10px] transition-all relative min-w-0 max-w-[62px] cursor-pointer active:scale-95",
                isActive
                  ? "font-bold text-white"
                  : "text-zinc-500 hover:text-zinc-300 font-medium"
              )}
            >
              <div
                className={cn(
                  "h-7 w-7 rounded-xl flex items-center justify-center transition-all duration-150",
                  isActive ? "bg-white/[0.1] text-emerald-400 shadow-sm" : ""
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="truncate w-full text-center px-0.5">{item.shortLabel}</span>
              {isActive && (
                <div className="absolute -bottom-1 h-0.5 w-4 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
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
