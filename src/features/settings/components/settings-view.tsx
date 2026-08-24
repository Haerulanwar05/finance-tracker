"use client";

import * as React from "react";
import {
  Sliders,
  Tag,
  Shield,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Wallet,
  Receipt,
  PiggyBank,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Smartphone,
  CloudOff,
  Wifi,
  RefreshCw,
  Layers,
  Download,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrivacy } from "@/context/privacy-context";
import { useOffline } from "@/context/offline-context";
import { OfflineQueueModal } from "@/components/pwa/offline-queue-modal";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CategoryBadgeIcon } from "@/components/shared/category-badge-icon";
import {
  SettingsData,
  updateProfile,
  createCustomCategory,
  deleteCustomCategory,
  setUserPassword,
} from "../actions";

interface SettingsViewProps {
  data: SettingsData;
}

const PRESET_BUDGETS = [
  { label: "Rp 3 Juta", value: 3000000 },
  { label: "Rp 5 Juta", value: 5000000 },
  { label: "Rp 7.5 Juta", value: 7500000 },
  { label: "Rp 10 Juta", value: 10000000 },
  { label: "Rp 15 Juta", value: 15000000 },
];

const CATEGORY_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
  "#EF4444",
];

export function SettingsView({ data }: SettingsViewProps) {
  const router = useRouter();
  const { isPrivate, togglePrivacy } = usePrivacy();
  const { isOnline, offlineCount, isSyncing, syncNow } = useOffline();
  const [isOfflineModalOpen, setIsOfflineModalOpen] = React.useState(false);

  // Profile & Budget state
  const [name, setName] = React.useState(data.user.name || "");
  const [budgetStr, setBudgetStr] = React.useState(
    data.user.monthlySpendingLimit > 0
      ? data.user.monthlySpendingLimit.toString()
      : "5000000"
  );
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [profileMessage, setProfileMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // New category form state
  const [catName, setCatName] = React.useState("");
  const [catType, setCatType] = React.useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [catColor, setCatColor] = React.useState(CATEGORY_COLORS[0]);
  const [isCreatingCat, setIsCreatingCat] = React.useState(false);
  const [catMessage, setCatMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Category filter state
  const [catFilter, setCatFilter] = React.useState<"ALL" | "EXPENSE" | "INCOME">("ALL");

  // Password management state
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSavingPassword, setIsSavingPassword] = React.useState(false);
  const [hasPassword, setHasPassword] = React.useState(Boolean(data.user.hasPassword));
  const [passwordMessage, setPasswordMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const numericBudget = Math.max(0, parseInt(budgetStr.replace(/\D/g, ""), 10) || 0);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password minimal harus 6 karakter." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }

    setIsSavingPassword(true);
    const res = await setUserPassword(newPassword);
    setIsSavingPassword(false);

    if (res.success) {
      setPasswordMessage({ type: "success", text: res.message });
      setHasPassword(true);
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
    } else {
      setPasswordMessage({ type: "error", text: res.message });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);

    const res = await updateProfile({
      name,
      monthlySpendingLimit: numericBudget,
    });

    setIsSavingProfile(false);
    if (res.success) {
      setProfileMessage({ type: "success", text: res.message });
      router.refresh();
    } else {
      setProfileMessage({ type: "error", text: res.message });
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    setIsCreatingCat(true);
    setCatMessage(null);

    const res = await createCustomCategory({
      name: catName.trim(),
      type: catType,
      color: catColor,
      icon: "tag",
    });

    setIsCreatingCat(false);
    if (res.success) {
      setCatName("");
      setCatMessage({ type: "success", text: res.message });
    } else {
      setCatMessage({ type: "error", text: res.message });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const res = await deleteCustomCategory(id);
    if (res.success) {
      setCatMessage({ type: "success", text: "Kategori berhasil dihapus." });
    } else {
      setCatMessage({ type: "error", text: res.message });
    }
  };

  const filteredCategories = data.categories.filter((c) => {
    if (catFilter === "ALL") return true;
    return c.type === catFilter;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <span>Pengaturan & Preferensi</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
            Account Hub
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Kelola profil akun, batas belanja bulanan, kategori transaksi, dan privasi.
        </p>
      </div>

      {/* 1. Profil & Ringkasan Akun */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
          <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-base">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Profil Pengguna</h2>
            <p className="text-xs text-zinc-400">Informasi identitas dan akun Anda</p>
          </div>
        </div>

        {/* Quick User Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Rekening Terdaftar</p>
              <p className="text-lg font-bold text-white font-mono">{data.stats.accountsCount} Rekening</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Total Transaksi</p>
              <p className="text-lg font-bold text-white font-mono">{data.stats.transactionsCount} Mutasi</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <PiggyBank className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Target Tabungan</p>
              <p className="text-lg font-bold text-white font-mono">{data.stats.goalsCount} Target</p>
            </div>
          </div>
        </div>

        {/* Form Edit Profil & Batas Belanja */}
        <form onSubmit={handleProfileSubmit} className="space-y-5 pt-2">
          {profileMessage && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-center gap-2 border ${
                profileMessage.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-300"
              }`}
            >
              {profileMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-400" />
              )}
              <span>{profileMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Email (Read only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Alamat Email</label>
              <input
                type="email"
                value={data.user.email || ""}
                disabled
                className="w-full bg-zinc-950/60 border border-zinc-800/60 rounded-2xl px-4 py-2.5 text-xs text-zinc-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Batas Belanja Bulanan Section */}
          <div className="space-y-3 pt-3 border-t border-zinc-800/60">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-blue-400" />
                  <span>Batas Belanja Bulanan (Target Anggaran)</span>
                </label>
                <p className="text-[11px] text-zinc-400">
                  Digunakan untuk menghitung batas belanja harian aman secara otomatis
                </p>
              </div>
            </div>

            <div className="relative max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                Rp
              </span>
              <input
                type="text"
                value={numericBudget > 0 ? numericBudget.toLocaleString("id-ID") : ""}
                onChange={(e) => setBudgetStr(e.target.value.replace(/\D/g, ""))}
                placeholder="5.000.000"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-12 pr-4 py-2.5 text-sm font-bold text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_BUDGETS.map((preset) => (
                <button
                  type="button"
                  key={preset.value}
                  onClick={() => setBudgetStr(preset.value.toString())}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    numericBudget === preset.value
                      ? "bg-blue-600 text-white font-bold shadow-sm"
                      : "bg-zinc-950 border border-zinc-800 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isSavingProfile}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-900/30"
            >
              {isSavingProfile ? "Menyimpan..." : "Simpan Profil & Batas Belanja"}
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Kata Sandi & Keamanan Masuk */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Kata Sandi & Keamanan Masuk</h2>
                {hasPassword ? (
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    ● Password Aktif
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                    Akun Google (Tanpa Password Manual)
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                {hasPassword
                  ? "Anda bisa masuk lewat Google atau menggunakan Email & Kata Sandi manual"
                  : "Buat kata sandi agar akun Google ini juga bisa login lewat form email & password biasa"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          {passwordMessage && (
            <div
              className={`p-3 rounded-2xl text-xs flex items-center gap-2 border ${
                passwordMessage.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-300"
              }`}
            >
              {passwordMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={hasPassword ? "Kata Sandi Baru" : "Buat Kata Sandi Baru"}
              type="password"
              placeholder="Minimal 6 karakter"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              label="Konfirmasi Kata Sandi"
              type="password"
              placeholder="Ketik ulang password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              disabled={isSavingPassword || !newPassword}
              className="bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-900/30"
            >
              {isSavingPassword ? "Menyimpan..." : hasPassword ? "Perbarui Kata Sandi" : "Simpan Kata Sandi Akun"}
            </Button>
          </div>
        </form>
      </div>

      {/* 3. Kelola Kategori Transaksi */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Kategori Transaksi</h2>
              <p className="text-xs text-zinc-400">Atur dan tambahkan kategori belanja kustom Anda</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-xl self-start sm:self-auto">
            {(["ALL", "EXPENSE", "INCOME"] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setCatFilter(filterKey)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  catFilter === filterKey
                    ? "bg-zinc-800 text-white font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {filterKey === "ALL" ? "Semua" : filterKey === "EXPENSE" ? "Pengeluaran" : "Pemasukan"}
              </button>
            ))}
          </div>
        </div>

        {/* Form Tambah Kategori Baru */}
        <form onSubmit={handleCreateCategory} className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-4">
          <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-blue-400" />
            <span>Tambah Kategori Kustom Baru</span>
          </h3>

          {catMessage && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                catMessage.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-300"
              }`}
            >
              <span>{catMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Nama Kategori */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-400">Nama Kategori</label>
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="misal: Hobi & Game"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Tipe Transaksi */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-400">Tipe</label>
              <select
                value={catType}
                onChange={(e) => setCatType(e.target.value as "INCOME" | "EXPENSE")}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="EXPENSE">🔴 Pengeluaran</option>
                <option value="INCOME">🟢 Pemasukan</option>
              </select>
            </div>

            {/* Warna Tag */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-400">Warna Tag</label>
              <div className="flex items-center gap-1.5 pt-1">
                {CATEGORY_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCatColor(c)}
                    className="h-6 w-6 rounded-lg transition-transform cursor-pointer flex items-center justify-center"
                    style={{
                      backgroundColor: c,
                      outline: catColor === c ? "2px solid white" : "none",
                      transform: catColor === c ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    {catColor === c && <Check className="h-3 w-3 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={isCreatingCat || !catName.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
            >
              {isCreatingCat ? "Menambahkan..." : "+ Tambah Kategori"}
            </Button>
          </div>
        </form>

        {/* Categories List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/80 flex items-center justify-between gap-2.5 group hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <CategoryBadgeIcon
                  categoryName={cat.name}
                  categoryIcon={cat.icon}
                  type={cat.type}
                  color={cat.color}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-200 truncate">{cat.name}</p>
                  <p className="text-[10px] text-zinc-500">
                    {cat.type === "INCOME" ? "Pemasukan" : "Pengeluaran"} • {cat._count?.transactions || 0} mutasi
                  </p>
                </div>
              </div>

              {cat.isDefault ? (
                <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md shrink-0">
                  Sistem
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                  title="Hapus Kategori"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Privasi & Keamanan Sistem */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Privasi & Sistem</h2>
            <p className="text-xs text-zinc-400">Kontrol privasi visual dan status integrasi sistem</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Privacy toggle card */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                {isPrivate ? <EyeOff className="h-4 w-4 text-amber-400" /> : <Eye className="h-4 w-4 text-emerald-400" />}
                <p className="text-xs font-bold text-white">Sembunyikan Saldo (Sensor Privasi)</p>
              </div>
              <p className="text-[11px] text-zinc-400">
                Samarkan seluruh angka saldo dan mutasi dengan karakter sensor (••••) saat di tempat umum.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={togglePrivacy}
              className={`text-xs cursor-pointer ${
                isPrivate
                  ? "border-amber-500/40 text-amber-300 bg-amber-500/10"
                  : "border-zinc-700 text-zinc-300"
              }`}
            >
              {isPrivate ? "Sensor Aktif" : "Sensor Nonaktif"}
            </Button>
          </div>

          {/* AI Scanner Engine status */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <p className="text-xs font-bold text-white">Google Gemini AI Vision Scanner</p>
              </div>
              <p className="text-[11px] text-zinc-400">
                Pindai otomatis foto struk belanja untuk mengekstrak nominal, toko, dan tanggal instan.
              </p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
              ● Aktif & Siap
            </span>
          </div>

          {/* PWA & Offline Sync Engine status */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-400" />
                <p className="text-xs font-bold text-white">Aplikasi Mandiri (HP & Laptop) & Catat Offline</p>
              </div>
              <p className="text-[11px] text-zinc-400">
                Pasang di layar HP atau PC/Laptop untuk akses cepat dan tetap bisa mencatat pengeluaran tanpa internet.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.dispatchEvent(new CustomEvent("open-pwa-install-modal"))}
                className="text-xs border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                <span>Pasang Aplikasi</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOfflineModalOpen(true)}
                className="text-xs border-zinc-800 hover:bg-zinc-900 rounded-xl cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
                <span>{offlineCount} Antrean</span>
              </Button>

              {offlineCount > 0 && isOnline && (
                <Button
                  type="button"
                  size="sm"
                  disabled={isSyncing}
                  onClick={() => syncNow()}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>Sync</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Offline Queue Modal */}
      <OfflineQueueModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
      />

      {/* 4. Keluar dari Akun */}
      <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-950/20 via-zinc-900/60 to-zinc-950/80 backdrop-blur-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>Keluar dari Akun</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Akhiri sesi Anda pada perangkat ini dengan aman.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          variant="danger"
          size="sm"
          className="text-xs bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-950/50 self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          <span>Keluar Akun</span>
        </Button>
      </div>
    </div>
  );
}
