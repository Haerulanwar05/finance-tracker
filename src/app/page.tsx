import Link from "next/link";
import { Wallet, ArrowRight, ShieldCheck, Sparkles, Receipt, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/shared/typewriter-text";

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
        <div className="w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-2xl -translate-y-32" />
      </div>

      {/* Navbar */}
      <header className="w-full max-w-6xl flex items-center justify-between py-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Wallet className="h-5 w-5 text-blue-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Finance Tracker</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Masuk
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">
              Daftar Gratis
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-4xl flex flex-col items-center text-center my-auto py-12 relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-medium text-zinc-300 shadow-sm backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>Simpel, Cepat & Otomatis</span>
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
          Catat pengeluaran harian cukup dengan foto struk, satukan semua saldo bank & e-wallet, dan kumpulkan tabungan impian dengan target yang jelas.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto px-8">
              Mulai Sekarang (Gratis)
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
              Buka Dashboard Demo
            </Button>
          </Link>
        </div>

        {/* 3 Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 w-full text-left">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-2">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Wallet className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Semua Rekening Jadi Satu</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Pantau total uang di Bank (BCA, Mandiri), E-Wallet (GoPay, OVO), hingga uang tunai.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Receipt className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Foto Struk Praktis</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cukup foto struk belanja, rincian pengeluaran dan total harga langsung terisi sendiri.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md space-y-2">
            <div className="h-9 w-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <PiggyBank className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-100">Target Tabungan Impian</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bagi tabungan untuk dana darurat, liburan, atau gadget baru dengan progres yang jelas.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl py-6 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-900 relative z-10">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Data Aman & Terenkripsi</span>
        </div>
        <p>© 2026 Finance Tracker. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}
