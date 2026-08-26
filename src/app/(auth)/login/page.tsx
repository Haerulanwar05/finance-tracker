"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldCheck, ArrowRight, ArrowLeft, Sparkles, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ensureDemoAdminAccount } from "@/features/auth/actions";
import { BrandLogo } from "@/components/shared/brand-logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDemoLoading, setIsDemoLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau password salah");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Terjadi kesalahan saat masuk");
    } finally {
      setIsLoading(false);
    }
  }

  // Google OAuth Login
  async function handleGoogleLogin() {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("Gagal menghubungkan akun Google");
      setIsGoogleLoading(false);
    }
  }

  // 1-Click Instant Admin / Demo Bypass Login (Hanya aktif di localhost/dev)
  async function handleInstantAdminLogin() {
    setError(null);
    setIsDemoLoading(true);

    try {
      const creds = await ensureDemoAdminAccount();
      const res = await signIn("credentials", {
        email: creds.email,
        password: creds.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Gagal masuk mode demo");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Terjadi kesalahan saat masuk mode demo");
    } finally {
      setIsDemoLoading(false);
    }
  }

  const isDev = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENABLE_DEMO === "true";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-2xl -translate-y-24" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header with Link back to Landing Page */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link
            href="/"
            className="hover:opacity-90 transition-opacity cursor-pointer flex flex-col items-center"
            title="Kembali ke Landing Page Finance Tracker"
          >
            <BrandLogo size="lg" subtitle="Personal Financial Freedom" />
          </Link>
          <p className="text-xs text-zinc-400 max-w-xs">Kelola aset, pantau target tabungan & scan struk belanja.</p>
        </div>

        <Card className="border-zinc-800/80 bg-zinc-900/70 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Masuk ke Dashboard</CardTitle>
              {isDev && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Sparkles className="h-3 w-3" />
                  Dev Ready
                </span>
              )}
            </div>
            <CardDescription>
              Masuk dengan akun Google atau masukkan email dan password Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 font-medium">
                {error}
              </div>
            )}

            {/* Google OAuth Login Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading || isDemoLoading}
              className="w-full flex items-center justify-center gap-2.5 border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-100 text-xs h-10 rounded-xl font-semibold shadow-xs"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.45 7.37 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.55 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{isGoogleLoading ? "Menghubungkan..." : "Lanjutkan dengan Google"}</span>
            </Button>

            {/* 1-Click Instant Admin / Demo Mode Button (Hanya tampil di localhost/dev) */}
            {isDev && (
              <button
                type="button"
                onClick={handleInstantAdminLogin}
                disabled={isDemoLoading || isLoading || isGoogleLoading}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-300 text-xs font-semibold transition-all group active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">⚡ Masuk Instan (Mode Admin / Dev)</p>
                    <p className="text-[10px] text-emerald-400/80">Langsung bypass ke dashboard tanpa mengetik</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}

            {/* Divider Tepat di Atas Form Input Email */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-zinc-900 px-3 text-zinc-400 font-semibold tracking-wider">
                  atau masuk dengan email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="nama@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Masuk dengan Akun
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>

            <div className="mt-4 text-center text-xs text-zinc-400">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
                Daftar Akun Baru
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security badge & Back to Home */}
        <div className="flex flex-col items-center gap-3 pt-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Halaman Utama</span>
          </Link>

          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Isolasi data privat per sesi pengguna</span>
          </div>
        </div>
      </div>
    </div>
  );
}
