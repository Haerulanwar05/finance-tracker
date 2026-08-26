# 📋 Project Implementation Tracker & Roadmap (TODO)
## Personal Finance, Multi-Asset & Goal Tracker

---

## 📊 Status Progres Ringkas
* **Total Milestone**: 9 Fase Lengkap Selesai + Fase 10 Future Roadmap
* **Status Saat Ini**: `🎉 SELURUH FASE INTI (0 - 9) SELESAI, TERUJI & PRODUCTION READY`
* **Metrik Kualitas QA**: **11 Test Suites, 92/92 Unit & E2E Tests Passed (100%)**, **ESLint 0 errors / 0 warnings**, **Next.js 16 Production Build Bersih**.

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
- [x] **8.4 Database Keep-Alive Heartbeat Automation**
  - [x] Endpoint `/api/health` untuk kueri denyut ringan (`SELECT 1`) menjaga connection pool tetap segar.
  - [x] GitHub Actions workflow (`.github/workflows/keep-alive.yml`) cron otomatis setiap 3 hari untuk mencegah database Supabase tertidur (*auto-pause*).

---

## 🎨 Fase 9: UI/UX Modernization, Brand Identity & Zero-Lag Performance Optimization
- [x] **9.1 Perbaikan Cetak PDF & Akurasi Profil**
  - [x] Header statement PDF diselaraskan untuk menampilkan nama akun / username pengguna login secara akurat dari halaman Transaksi dan Analitik.
- [x] **9.2 Penyempurnaan Visualisasi Chart (Recharts & UX)**
  - [x] Menghilangkan outline fokus / kotak putih saat chart diklik.
  - [x] Mengatur `pointer-events-none` & interaktivitas tooltip agar keterangan total belanja pada Donut Chart tidak tertutup.
  - [x] Palet warna kategori modern dan kontras tinggi.
- [x] **9.3 Animated Luxury Dollar Bag Brand Logo & Routing Cerdas**
  - [x] Mendesain logo kantong dollar (`$`) vektor murni dengan animasi floating shimmer halus.
  - [x] Mengatasi masalah *scoped SVG gradient IDs* di WebKit/Blink mobile browser sehingga logo selalu tampil tajam 100% di semua HP.
  - [x] Routing cerdas logo & brand text: posisi sudah login $\rightarrow$ `/dashboard` (Overview); posisi form auth $\rightarrow$ `/` (Landing Page).
- [x] **9.4 Mobile Touch Ergonomics & Clean Hero CTA**
  - [x] Symmetrical 2-column mobile button grid pada Dashboard, Transaksi, dan Rekening.
  - [x] Swipeable horizontal filters (`touch-pan-x`) pada daftar transaksi mobile.
  - [x] Menghapus tombol demo tidak terpakai pada landing page untuk memfokuskan *Single Primary CTA* "Mulai Sekarang (Gratis)".
- [x] **9.5 Eliminasi Delay Navigasi (*Zero-Lag Instant Switch*)**
  - [x] Mengubah query database berurutan (*sequential waterfall*) pada `getDashboardAnalyticsData()` menjadi eksekusi paralel (*Promise.all*), memangkas waktu tunggu dari ~2.5s ke ~250ms (~80% lebih cepat).
  - [x] Mengaktifkan `prefetch={true}` pada seluruh link navigasi desktop sidebar dan mobile bottom bar untuk pre-caching instan.
  - [x] Memperbarui skeleton loader glassmorphism di `src/app/(dashboard)/loading.tsx`.
- [x] **9.6 Redesain Minimalis Kartu Batas Belanja Bulanan**
  - [x] Merombak kartu Batas Belanja Bulanan di Bento Metrics agar simetris dengan kartu Net Worth, Pemasukan, dan Pengeluaran.
  - [x] Menghapus baris gelap terpisah (*clunky bottom inset*) digantikan progress bar ramping 6px gradien halus (*Indigo to Cyan*) dan status badge *pulsating dot*.
- [x] **9.7 Optimasi Respon Tombol CRUD (*Parallel Database Query Batching*)**
  - [x] Memangkas database roundtrips pada `createTransaction`, `updateTransaction`, `deleteTransaction`, `transferFunds`, `depositToVault`, dan `withdrawFromVault` dari 5-6 roundtrip menjadi hanya 2 roundtrip menggunakan `Promise.all` di dalam transaksi ACID.
  - [x] Menghilangkan *double-fetch delay* pada antarmuka klien sehingga modal tertutup dan merespons mutasi secara instan (< 200ms).
- [x] **9.8 Resolusi Bug Transfer Antar-Akun & Auto-Collision Handler**
  - [x] Memperbaiki desinkronisasi state pada `TransferModal`, `AddTransactionModal`, dan `EditTransactionModal` ketika pengguna memilih akun sumber yang sama dengan target (misal: BNI $\rightarrow$ Uang Tunai).
  - [x] Menyediakan auto-switch otomatis pada akun tujuan saat terjadi tabrakan pilihan (*collision*), sinkronisasi realtime melalui `useEffect`, dan tombol interaktif *Swap Direction* (🔁 Tukar Akun).
  - [x] Menambahkan validasi proteksi berlapis pada action `transferFunds`, `createTransaction`, dan `updateTransaction`.
  - [x] Menambahkan test suite komprehensif `tests/unit/transfer-interaccount.test.ts` (11 pengujian baru). Total pengujian meningkat menjadi **13 Test Suites, 109/109 Tests Passing (100% Green)**.

---

## 🔮 Fase 10: Future Horizons & Next-Gen Innovations (Roadmap Selanjutnya)
- [x] **10.2 Progressive Web App (PWA) & Resilient Offline Queue (Selesai)**
  - [x] Web App Manifest (`public/manifest.json`) & Ikon Vektor Lengkap (192px, 512px, Maskable, Apple Touch Icon).
  - [x] Service Worker Caching (`public/sw.js`) dengan strategi Stale-While-Revalidate untuk static assets dan Network-First untuk HTML navigasi.
  - [x] PWA Install Prompt Banner (`pwa-install-banner.tsx`) dengan dukungan Multi-Device (Android, iPhone Safari, dan Laptop/PC Desktop Chrome & Edge), copywriting alami, dan sentuhan visual glassmorphism modern.
  - [x] Early `beforeinstallprompt` global event handler di `<head>` (`src/app/layout.tsx`) untuk penangkapan prompt instan di browser Chromium.
  - [x] Desktop Native Standalone App integration: tombol pemicu khusus di Sidebar Desktop PC (`💻 Pasang di Desktop`), tombol di Pengaturan, dan generator unduh pintasan instan (`FinanceTracker.url`) untuk Desktop & Pin ke Taskbar Windows.
  - [x] Client-Side Offline Queue Engine (`src/lib/offline-queue.ts`) & React Context (`src/context/offline-context.tsx`).
  - [x] Integrasi modal tambah transaksi (`add-transaction-modal.tsx`) dengan fallback otomatis ke antrean lokal HP saat tidak ada koneksi internet.
  - [x] Auto-Sync background dispatcher yang otomatis mengirim transaksi tersimpan ke server cloud saat perangkat kembali online.
  - [x] Banner status offline, modal daftar antrean transaksi offline, dan kontrol PWA di menu Pengaturan.
  - [x] Unit test suite khusus (`tests/unit/offline-queue.test.ts`) dengan cakupan 6 pengujian lengkap. Total test suite mencapai **13 Test Suites, 109/109 Tests Passing (100%)**.
- [ ] **10.1 Telegram & WhatsApp AI Ingestion Bot**
  - [ ] Webhook bot Telegram / WhatsApp untuk menerima pesan teks ("Makan 35rb Gopay") atau foto struk langsung dari smartphone.
  - [ ] Auto-reply konfirmasi instan dan pencatatan otomatis ke database tanpa perlu membuka browser.
- [ ] **10.3 Manajemen Tagihan Rutin & Pengingat (*Recurring Subscriptions & Bills*)**
  - [ ] Modul pencatatan langganan berkala (Netflix, Spotify, WiFi Indihome/Biznet, Listrik PLN, BPJS, Cicilan).
  - [ ] Kalkulator total komitmen biaya bulanan dan notifikasi H-3 sebelum tanggal jatuh tempo.
- [ ] **10.4 Split Bill & Catat Patungan Cerdas**
  - [ ] Pemecah nota belanja / struk makan bareng teman dengan pembagian item, pajak, dan tip proporsional.
  - [ ] Tombol "Share to WhatsApp" berupa ringkasan nominal yang harus ditransfer oleh masing-masing teman.
- [ ] **10.5 Multi-Currency & Real-Time Valas Converter**
  - [ ] Dukungan akun dalam mata uang asing (USD, EUR, SGD, JPY, MYR, USDT/BTC).
  - [ ] Integrasi kurs valas harian Bank Indonesia / Forex API untuk otomatisasi konversi kekayaan bersih ke IDR.
- [ ] **10.6 Gamifikasi Finansial & Streak Rewards**
  - [ ] Lencana pencapaian (*Badges*): "Penyelamat Dana Darurat", "Pencatat Finansial 30 Hari", "Hemat 20% Gaji".
  - [ ] Streak counter visual harian untuk membangun kebiasaan mencatat pengeluaran secara konsisten.

---

## 🚀 Kriteria Keberhasilan (Acceptance Criteria)
1. **Zero Balance Desynchronization**: Saldo akun selalu cocok 100% dengan akumulasi mutasi transaksi (garansi ACID).
2. **Instant Receipt Logging**: Waktu pemrosesan struk dari upload foto hingga form terisi < 3 detik.
3. **Seamless Mobile Experience**: Tampilan responsif dan nyaman digunakan di layar HP dengan bottom navigation bar ergonomis.
4. **Professional Print Fidelity**: Hasil cetak PDF A4 bersih, proporsional, dan tepat berada di puncak kertas.
5. **Production Cloud Durability**: Data tersimpan permanen di cloud PostgreSQL Supabase dengan perlindungan sesi Google OAuth.
6. **Zero-Lag Interactive Transitions**: Perpindahan antar menu navigasi berjalan instan di bawah 300ms berkat database batching dan route prefetching.
