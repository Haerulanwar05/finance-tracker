"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Camera,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Wallet,
  Tag,
  RotateCcw,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/currency";
import { ParsedReceiptData, ReceiptItem } from "../types";
import { saveReceiptTransaction } from "../actions";

export interface AccountOption {
  id: string;
  name: string;
  type: string;
  balance: number;
}

export interface CategoryOption {
  id: string;
  name: string;
  type: string;
}

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: AccountOption[];
  categories: CategoryOption[];
}

type ScanStep = "UPLOAD" | "SCANNING" | "REVIEW";

export function ReceiptScannerModal({
  isOpen,
  onClose,
  accounts,
  categories,
}: ReceiptScannerModalProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  const [step, setStep] = React.useState<ScanStep>("UPLOAD");
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Parsed Form States
  const [merchant, setMerchant] = React.useState("");
  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = React.useState("");
  const [accountId, setAccountId] = React.useState(accounts[0]?.id || "");
  const [categoryId, setCategoryId] = React.useState(
    categories.find((c) => c.type === "EXPENSE")?.id || ""
  );
  const [items, setItems] = React.useState<ReceiptItem[]>([]);
  const [rawOcrJson, setRawOcrJson] = React.useState("");
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = React.useState<string | undefined>();

  function handleResetAndClose() {
    setStep("UPLOAD");
    setPreviewUrl(null);
    setError(null);
    setIsSaving(false);
    onClose();
  }

  if (!isOpen) return null;

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setError(null);

    // Auto-trigger scanning
    await executeScan(file);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Harap unggah file foto/gambar struk belanja (JPEG, PNG, WEBP).");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setError(null);

    await executeScan(file);
  }

  async function executeScan(file: File) {
    setStep("SCANNING");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ocr/receipt", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal mengekstrak struk belanja.");
      }

      const data = json.data as ParsedReceiptData;
      setMerchant(data.merchant || "Struk Belanja");
      setDate(data.date || new Date().toISOString().split("T")[0]);
      setAmount(data.totalAmount ? data.totalAmount.toLocaleString("id-ID") : "0");
      setItems(data.items || []);
      setRawOcrJson(JSON.stringify(data));
      setUploadedReceiptUrl(data.receiptUrl);

      // Auto-match category
      const matchedCat = categories.find(
        (c) =>
          c.type === "EXPENSE" &&
          (c.name.toLowerCase().includes(data.suggestedCategory?.toLowerCase() || "") ||
            (data.suggestedCategory?.toLowerCase() || "").includes(c.name.toLowerCase()))
      );

      if (matchedCat) {
        setCategoryId(matchedCat.id);
      } else {
        const defaultCat = categories.find((c) => c.type === "EXPENSE");
        setCategoryId(defaultCat?.id || "");
      }

      setStep("REVIEW");
    } catch (err: unknown) {
      console.error("Scan error:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses gambar.");
      setStep("UPLOAD");
    }
  }

  async function handleConfirmSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, "")) || 0;
    if (numericAmount <= 0) {
      setError("Total nominal transaksi harus lebih dari 0.");
      return;
    }

    if (!accountId) {
      setError("Silakan pilih akun sumber pembayaran.");
      return;
    }

    setIsSaving(true);

    const res = await saveReceiptTransaction({
      accountId,
      categoryId: categoryId || undefined,
      amount: numericAmount,
      date,
      description: merchant.trim() || "Struk Belanja AI",
      receiptUrl: uploadedReceiptUrl,
      rawOcrJson,
    });

    setIsSaving(false);

    if (res.success) {
      router.refresh();
      onClose();
    } else {
      setError(res.message || "Gagal menyimpan transaksi struk.");
    }
  }

  const numericAmount = parseFloat(amount.replace(/[^0-9]/g, "")) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-2xl p-6 text-zinc-100 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Foto & Pindai Struk</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium">
                  Otomatis
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Ambil atau unggah foto struk, rincian transaksi akan terisi sendiri.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs text-rose-400 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: UPLOAD DROPZONE & CAMERA */}
        {step === "UPLOAD" && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="group border-2 border-dashed border-zinc-800 hover:border-indigo-500/60 rounded-3xl p-8 text-center space-y-4 transition-all cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/80"
            >
              <div className="h-16 w-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-zinc-200">
                  Tarik & Lepas foto struk ke sini, atau klik untuk memilih file
                </p>
                <p className="text-xs text-zinc-500">Mendukung format JPEG, PNG, WEBP hingga 10MB</p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-5"
              >
                <Camera className="h-4 w-4 text-indigo-400" />
                <span>Ambil Foto Kamera</span>
              </Button>
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-5 bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Pilih dari Galeri</span>
              </Button>
            </div>

            {/* Hidden Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        )}

        {/* STEP 2: SCANNING LASER ANIMATION */}
        {step === "SCANNING" && (
          <div className="py-8 space-y-6 text-center">
            <div className="relative mx-auto w-48 h-64 rounded-2xl overflow-hidden border border-indigo-500/40 bg-zinc-950 shadow-2xl">
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Receipt Preview"
                  className="w-full h-full object-cover opacity-60 filter blur-[0.5px]"
                />
              )}
              {/* Laser Line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce" />
              <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[1px] flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-cyan-300 animate-spin" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
                <span>Membaca Rincian Struk...</span>
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Sedang mengenali nama toko, tanggal, daftar belanja, dan total biaya.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & CONFIRM */}
        {step === "REVIEW" && (
          <form onSubmit={handleConfirmSave} className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Struk terbaca! Periksa kembali sebelum disimpan.</span>
              </div>
              <button
                type="button"
                onClick={() => setStep("UPLOAD")}
                className="text-xs underline text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Foto Ulang</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Merchant / Store */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Nama Toko / Merchant</span>
                </label>
                <Input
                  type="text"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="Nama toko"
                  required
                  className="bg-zinc-950/80 border-zinc-800 text-xs"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Tanggal Struk</span>
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="bg-zinc-950/80 border-zinc-800 text-xs"
                />
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300">Total Pembayaran</label>
                {numericAmount > 0 && (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                    {formatRupiah(numericAmount)}
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
                  Rp
                </span>
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    if (!raw) {
                      setAmount("");
                      return;
                    }
                    const num = parseInt(raw, 10);
                    setAmount(num.toLocaleString("id-ID"));
                  }}
                  required
                  className="pl-11 text-lg font-mono font-bold bg-zinc-950/80 border-zinc-800 text-white"
                />
              </div>
            </div>

            {/* Account & Category Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Payment Account */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Dibayar Menggunakan</span>
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  required
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({formatRupiah(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Kategori Pengeluaran</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  required
                >
                  {categories
                    .filter((c) => c.type === "EXPENSE")
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Detected Line Items breakdown (if any) */}
            {items.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Rincian Item Belanja ({items.length})
                  </span>
                </div>
                <div className="max-h-32 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950/60 p-2 space-y-1.5">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-zinc-900/40 text-zinc-300"
                    >
                      <span className="truncate pr-2">
                        {item.qty}x {item.name}
                      </span>
                      <span className="font-mono text-zinc-400 shrink-0 font-medium">
                        {formatRupiah(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetAndClose}
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={isSaving}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Simpan Transaksi</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
