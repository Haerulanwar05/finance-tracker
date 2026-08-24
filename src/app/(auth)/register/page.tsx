"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/features/auth/actions";
import { BrandLogo } from "@/components/shared/brand-logo";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const result = await registerUser({ name, email, password });

      if (!result.success) {
        setError(result.message || "Gagal mendaftarkan akun.");
      } else {
        setSuccess("Pendaftaran berhasil! Mengarahkan ke login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  }

  // Google OAuth Sign Up
  async function handleGoogleSignUp() {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setError("Gagal menghubungkan akun Google");
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-2xl -translate-y-24" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo size="lg" subtitle="Create Your Wealth Engine" />
          <p className="text-xs text-zinc-400 max-w-xs">Daftar sekarang untuk mulai mengontrol keuangan harianmu.</p>
        </div>

        <Card className="border-zinc-800/80 bg-zinc-900/70 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Buat Akun Baru</CardTitle>
            <CardDescription>Akun baru otomatis dilengkapi 3 dompet awal dan 10 kategori finansial siap pakai.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 font-medium">
                {success}
              </div>
            )}

            {/* Google Sign Up Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-2.5 border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-100 text-xs h-10 rounded-xl font-semibold shadow-xs"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.45 7.37 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.55 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{isGoogleLoading ? "Menghubungkan..." : "Daftar dengan Google"}</span>
            </Button>

            <div className="relative flex items-center justify-center py-1">
              <div className="border-t border-zinc-800 w-full" />
              <span className="bg-zinc-900 px-2 text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                atau daftar dengan email
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Lengkap"
                placeholder="misal: Budi Santoso"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Email"
                type="email"
                placeholder="nama@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password (min. 6 karakter)"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Daftar Akun
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>

            <div className="mt-4 text-center text-xs text-zinc-400">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
                Masuk di Sini
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Data keuangan tersimpan aman & terenkripsi</span>
        </div>
      </div>
    </div>
  );
}
