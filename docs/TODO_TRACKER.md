# 📋 Project Implementation Tracker & Roadmap (TODO)
## Personal Finance, Multi-Asset & Goal Tracker

---

## 📊 Status Progres Ringkas
* **Total Milestone**: 8 Fase Lengkap
* **Status Saat Ini**: `🎉 SELURUH FASE (0 - 8) SELESAI, TERUJI & PRODUCTION READY`
* **Metrik Kualitas QA**: **11 Test Suites, 90/90 Unit & E2E Tests Passed (100%)**, **ESLint 0 errors / 0 warnings**, **Next.js 16 Production Build Bersih**.

---

## 🎯 Fase 0: Project Setup & Baseline Tooling
- [x] **0.1 Inisialisasi Proyek Next.js 16 (App Router & Turbopack)**
  - [x] Setup Next.js App Router dengan TypeScript & Tailwind CSS v4.
  - [x] Instalasi paket esensial (`lucide-react`, `clsx`, `tailwind-merge`, `zod`, `@prisma/client`, `next-auth`, `recharts`, `@prisma/adapter-pg`, `pg`).
  - [x] Setup helper format Rupiah (`lib/currency.ts`) dan utils Tailwind (`cn`).
  - [x] Konfigurasi testing suite Vitest & Unit Test baseline passing (`tests/unit/currency.test.ts`).
- [x] **0.2 Setup Database & ORM**
  - [x] Konfigurasi environment template di `.env.example` dan `.env`.
  - [x] Inisialisasi skema lengkap di `prisma/schema.prisma` (User, Account, Category, Transaction, GoalVault, VaultAllocation, Budget).
  - [x] Konfigurasi Prisma Client singleton dengan adapter `@prisma/adapter-pg` di `lib/prisma.ts`.

---

## 🔐 Fase 1: Autentikasi & Akun Pengguna
- [x] **1.1 Setup NextAuth.js (Auth.js v5)**
  - [x] Konfigurasi Google OAuth Provider & Credentials Provider (Email & Password Hash bcrypt) di `src/lib/auth.ts`.
  - [x] Route handler API di `src/app/api/auth/[...nextauth]/route.ts`.
- [x] **1.2 Halaman Auth & Auto-Seeder**
  - [x] Validasi Zod form login & register di `src/features/auth/schema.ts`.
  - [x] Server Action registrasi atomik di `src/features/auth/actions.ts` (otomatis membuat 3 dompet awal + 10 kategori finansial).
  - [x] Halaman `/login` dan `/register` dengan tombol Google Sign-In & Dark Bento Glassmorphism.
  - [x] Unit Test schema validasi (`tests/unit/auth-schema.test.ts`) lolos 100%.

---

## 💳 Fase 2: Manajemen Multi-Akun & Aset (Accounts Module)
- [x] **2.1 CRUD Akun & Dompet**
  - [x] Server Action: Tambah akun baru (`createAccount` - Bank, E-Wallet, Cash, Investasi).
  - [x] Server Action: Edit & Arsipkan akun (`updateAccount`, `archiveAccount`).
  - [x] Validasi Zod skema akun di `src/features/accounts/schema.ts`.
- [x] **2.2 Fitur Transfer Antar-Akun**
  - [x] Server Action transfer saldo atomik (`transferFunds` via `prisma.$transaction`).
  - [x] Modal transfer dana interaktif (`TransferModal`) dengan proteksi saldo tidak mencukupi & akun sama.
- [x] **2.3 Komponen UI Akun & Dashboard Shell**
  - [x] Kartu virtual akun ATM/E-Wallet (`AccountCard`) dengan warna aksen bank & menu aksi modal bebas overlap.
  - [x] Hero Bento Net Worth Card (`NetWorthCard`) dengan kalkulasi otomatis seluruh aset.
  - [x] Dashboard Shell (`DashboardShell`) dengan navigasi Desktop Sidebar & Mobile Bottom Navigation 6-item.
  - [x] Global Sensor Saldo Privasi (`PrivacyProvider`) dengan `useSyncExternalStore`.
  - [x] Halaman `/accounts` dan `/dashboard` overview.
  - [x] QA Suite (`tests/unit/account-schema.test.ts` & `qa-matrix.test.ts`).

---

## 📝 Fase 3: Pencatatan Transaksi Harian & Import Mutasi CSV
- [x] **3.1 Modul Transaksi Standar**
  - [x] Form Input Transaksi Cepat (`AddTransactionModal` - Pemasukan, Pengeluaran, Transfer).
  - [x] Chips nominal instan (+10rb, +25rb, +50rb, +100rb, +500rb) & selector kategori visual.
  - [x] List Riwayat Transaksi (`TransactionList` & `TransactionItem`) dikelompokkan per tanggal.
  - [x] Server Action CRUD transaksi (`createTransaction`, `updateTransaction`, `deleteTransaction`) dengan sinkronisasi saldo akun otomatis & garansi ACID.
- [x] **3.2 Fitur Import Mutasi (CSV Bank)**
  - [x] Parser file mutasi bank Indonesia (`csv-parser.ts` - BCA, Mandiri, BRI, Bank Jago, generic format).
  - [x] Modal Import Mutasi (`ImportCsvModal`) dengan drag-and-drop dropzone & instant preview table.
  - [x] Auto-categorization pintar berdasarkan kata kunci merchant perbankan Indonesia.
  - [x] Bulk atomic import (`importBulkTransactions`) dengan perhitungan saldo instan.
  - [x] Unit test suite (`tests/unit/transactions.test.ts`).

---

## 🤖 Fase 4: Smart OCR Receipt Ingestion (AI Vision)
- [x] **4.1 Integrasi Gemini Vision API (@google/genai)**
  - [x] Service endpoint `/api/ocr/receipt` yang menerima multipart gambar struk (JPEG, PNG, WEBP).
  - [x] Penyimpanan lokal foto struk ke `public/uploads/receipts/` dengan penamaan file aman.
  - [x] Prompt rekayasa AI Vision terstruktur yang mengembalikan JSON `{ merchant, date, totalAmount, items[], suggestedCategory, confidence }`.
  - [x] Penanganan fallback cerdas jika `GEMINI_API_KEY` belum terisi.
- [x] **4.2 UI Scanner Struk Interaktif**
  - [x] Modal upload foto / kamera struk belanja (`ReceiptScannerModal`).
  - [x] State loading interaktif dengan animasi laser scanner menyala saat AI mengekstrak data.
  - [x] Auto-fill form transaksi dengan rincian item belanja & tombol *Review & Confirm*.
  - [x] Server Action atomik (`saveReceiptTransaction`) yang memotong saldo akun secara instan.
  - [x] Unit test suite (`tests/unit/ocr.test.ts`).

---

## 🎯 Fase 5: Financial Goals (Target Tabungan Mandiri)
- [x] **5.1 Manajemen Target Finansial**
  - [x] Pembuatan Target Tabungan (Nama, Target Nominal, Target Tanggal/Deadline, Warna, Ikon).
  - [x] Hubungkan target ke rekening fisik tertentu (opsional/virtual).
  - [x] Preset target instan: *Dana Darurat*, *Liburan*, *Beli Rumah*, *Gadget Baru*, *Modal Usaha*, *Kendaraan*.
- [x] **5.2 Alokasi Dana Tabungan Otomatis & Real-time (ACID)**
  - [x] Server Action `depositToVault`: Alokasi dana dari rekening ke target dengan validasi saldo & mutasi log.
  - [x] Server Action `withdrawFromVault`: Penarikan dana dari target kembali ke saldo bebas rekening.
  - [x] Transisi status otomatis ke `ACHIEVED` saat tabungan $\ge$ target.
- [x] **5.3 Visual Progress & Milestone**
  - [x] Progress bar persentase pencapaian dengan gradien warna dinamis.
  - [x] Estimasi waktu target tercapai & kalkulasi kebutuhan tabungan bulanan (*Smart Pace Indicator*).
  - [x] Unit test suite (`tests/unit/goals.test.ts`).

---

## 📈 Fase 6: Dashboard Overview & Analitik
- [x] **6.1 Dashboard Utama**
  - [x] Ringkasan Saldo Net Worth, Pemasukan Bulan Ini, Pengeluaran Bulan Ini.
  - [x] Kartu jalan pintas (*Quick Action*: Tambah Transaksi, Scan Struk, Transfer).
  - [x] Widget 5 Transaksi Terakhir & Target Tabungan Teratas.
- [x] **6.2 Visualisasi Data (Charts)**
  - [x] Grafik Bar: Tren Cashflow 6 bulan terakhir dengan perbandingan Pemasukan vs Pengeluaran.
  - [x] Donut Chart: Proporsi pengeluaran berdasarkan kategori dengan persentase & warna unik.
- [x] **6.3 Fitur "Safe-to-Spend" (Opsi 2: Standar Rata-rata 30 Hari)**
  - [x] Kalkulator otomatis batas belanja harian: $\text{Batas Belanja Bulanan} \div 30$.
  - [x] Indikator status risiko (*Aman / Hati-hati / Kritis*).
  - [x] Halaman `/analytics` khusus untuk analisis mendalam.
  - [x] Unit test suite (`tests/unit/analytics.test.ts`).

---

## ⚙️ Fase 7: Pengaturan (Settings Hub), Filter Kalender & Ekspor Dokumen (PDF & CSV)
- [x] **7.1 Modul Pengaturan (`/settings`)**
  - [x] Server Actions: `getSettingsData`, `updateProfile`, `createCustomCategory`, `deleteCustomCategory`.
  - [x] Form profil pengguna dengan sinkronisasi *real-time* ke header dan sidebar via revalidasi Prisma di layout.
  - [x] Manajemen batas anggaran bulanan dengan tombol preset nominal instan.
  - [x] CRUD kategori kustom pengguna dengan tab Masuk/Keluar dan palet 8 warna.
  - [x] Status konektivitas AI Vision dan tombol Logout aman.
- [x] **7.2 Filter Rentang Waktu Interaktif & Kalender**
  - [x] Filter preset cepat: *Semua, Bulan Ini, Bulan Lalu, 3 Bulan Terakhir, Tahun Ini*.
  - [x] Filter kustom kalender: *Tanggal Mulai (Dari) s/d Tanggal Selesai (Sampai)*.
  - [x] Rekapitulasi otomatis banner summary (Pemasukan, Pengeluaran, Net Cashflow) sesuai rentang aktif.
- [x] **7.3 Ekspor Dokumen Keuangan (Print-Ready PDF & CSV)**
  - [x] Isolated Print Engine (`printFinancialStatement`): Cetak dokumen A4 resmi berstandar rekening koran bank (*top-aligned, high-contrast, zero dark-mode artifacts*).
  - [x] Ekspor CSV Spreadsheet (`exportTransactionsToCsv`) dengan UTF-8 BOM untuk kompatibilitas Excel dan Google Sheets.
  - [x] Modal pratinjau interaktif (`ExportStatementModal`) di halaman Transaksi dan tombol cetak di Analitik.
- [x] **7.4 Mobile Ergonomics & QA Test Suite**
  - [x] Navigasi mobile bottom bar 6-item (`Overview`, `Transaksi`, `Analitik`, `Target`, `Rekening`, `Pengaturan`).
  - [x] Header mobile quick gear shortcut dan `pb-24` bottom padding.
  - [x] Unit test suite: `tests/unit/settings.test.ts`, `tests/unit/export-statement.test.ts`, dan `tests/unit/e2e-comprehensive-qa.test.ts`.

---

## ☁️ Fase 8: Cloud PostgreSQL Migration (Supabase), Google OAuth & Production Vercel CI/CD
- [x] **8.1 Migrasi Cloud Database Supabase (PostgreSQL)**
  - [x] Setup proyek cloud database Supabase di Region Singapore (`ap-southeast-1`).
  - [x] Pembaruan `prisma/schema.prisma` dengan provider `postgresql` dan driver adapter `@prisma/adapter-pg`.
  - [x] Eksekusi `prisma db push` langsung ke server cloud dan auto-sinkronisasi 7 tabel utama.
- [x] **8.2 Integrasi Google OAuth & Production Auth**
  - [x] Konfigurasi Google Cloud OAuth 2.0 Client ID dan Secret di `src/lib/auth.ts`.
  - [x] Tombol UI *"Lanjutkan dengan Google"* di `/login` dan `/register` dengan auto-seeding dompet awal & kategori.
  - [x] Guarding mode bypass admin/dev otomatis dinonaktifkan di production (`NODE_ENV === "production"`).
- [x] **8.3 Vercel Build Pipeline & Type Resilience**
  - [x] Konfigurasi `"postinstall": "prisma generate"` dan `"build": "prisma generate && next build"` di `package.json`.
  - [x] Anotasi tipe eksplisit pada seluruh transaksi Prisma (`Prisma.TransactionClient`) dan array callbacks.
  - [x] Sinkronisasi repositori GitHub (`https://github.com/Haerulanwar05/finance-tracker.git`).

---

## 🚀 Kriteria Keberhasilan (Acceptance Criteria)
1. **Zero Balance Desynchronization**: Saldo akun selalu cocok 100% dengan akumulasi mutasi transaksi (garansi ACID).
2. **Instant Receipt Logging**: Waktu pemrosesan struk dari upload foto hingga form terisi < 3 detik.
3. **Seamless Mobile Experience**: Tampilan responsif dan nyaman digunakan di layar HP dengan bottom navigation bar ergonomis.
4. **Professional Print Fidelity**: Hasil cetak PDF A4 bersih, proporsional, dan tepat berada di puncak kertas.
5. **Production Cloud Durability**: Data tersimpan permanen di cloud PostgreSQL Supabase dengan perlindungan sesi Google OAuth.
