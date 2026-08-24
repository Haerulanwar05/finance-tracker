import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Landmark, ScanLine, Target, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/shared/typewriter-text";
import { BrandLogo } from "@/components/shared/brand-logo";

const TYPING_WORDS = [
  "Catat Pengeluaran Tanpa Ribet",
  "Tinggal Foto Struk Belanja",
  "Semua Tabungan Lebih Rapi",
  "Pantau Uangmu Kapan Saja",
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[650px] h-[650px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-32" />
      </div>

      {/* Navbar */}
      <header className="w-full max-w-6xl flex items-center justify-between py-4 relative z-10">
        <BrandLogo subtitle="Financial Freedom Platform" />

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-900/80">
              Masuk
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/20">
              Daftar Gratis
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-4xl flex flex-col items-center text-center my-auto py-12 relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800/80 text-xs font-medium text-zinc-300 shadow-lg backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span>Simpel, Cepat & Cerdas</span>
        </div>

        <div className="w-full space-y-3">
          <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Atur Keuangan & Capai Impianmu
          </h1>
          {/* Safe height container with zero vertical layout shifts */}
          <div className="min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center">
            <div className="text-xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-normal py-1 px-2">
              <TypewriterText
                words={TYPING_WORDS}
                typingSpeed={50}
                deletingSpeed={25}
                pauseDuration={1200}
              />
            </div>
          </div>
        </div>

        <p className="max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed">
          Catat pengeluaran harian cukup dengan foto struk belanja otomatis, satukan semua saldo bank & e-wallet, dan kumpulkan tabungan impian dengan target yang terukur.
        </p>

        <div className="flex items-center justify-center pt-2">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-xl shadow-blue-500/25 rounded-2xl cursor-pointer group">
              Mulai Sekarang (Gratis)
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* 3 Feature Highlights with Modern Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 w-full text-left">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-2.5 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02] shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-sm shadow-blue-500/10">
              <Landmark className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Semua Rekening Jadi Satu</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pantau total uang di Bank (BCA, Mandiri, BNI), E-Wallet (GoPay, OVO), hingga uang tunai dalam 1 layar.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-2.5 hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02] shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
              <ScanLine className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">AI Scan Struk Praktis</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cukup foto struk belanja Anda, teknologi AI otomatis membaca item belanja, kategori, dan nominal total.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-2.5 hover:border-amber-500/40 transition-all duration-300 hover:scale-[1.02] shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/10">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100">Target Tabungan Impian</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Kumpulkan dana darurat, liburan impian, atau tabungan rumah dengan kalkulasi estimasi waktu otomatis.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 border-t border-zinc-900/80 relative z-10 gap-3">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Data Aman, Terisolasi & Terenkripsi</span>
        </div>
        <p>© 2026 FinanceTracker. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}
