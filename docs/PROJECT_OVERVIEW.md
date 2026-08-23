# 💰 Personal Finance, Multi-Asset & Goal Tracker

Aplikasi modern *full-stack* pencatatan keuangan harian, manajemen multi-aset (bank, e-wallet, cash, investasi), target tabungan finansial (*financial goals*), input pintar berbasis **AI Vision OCR** untuk struk belanja, ekspor laporan keuangan profesional, serta siap produksi dengan **Cloud Database Supabase & Google OAuth**.

---

## 📚 Dokumentasi Proyek Lengkap

Semua perencanaan sistem dan panduan teknis telah disusun secara terstruktur di folder [`docs/`](./docs):

* 🏛️ **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: Arsitektur sistem (C4 Model), Tech Stack Decision Matrix, Data Flow transaksi & OCR, integrasi Supabase PostgreSQL & Google OAuth, mesin cetak dokumen PDF, serta standar keamanan finansial.
* 🎨 **[docs/UI_UX_DESIGN_SYSTEM.md](./docs/UI_UX_DESIGN_SYSTEM.md)**: Sistem desain visual modern (Bento Grid, Glassmorphism, Color Tokens, Mobile Thumb Navigation, Google Sign-in Buttons, CSS Print Optimization, & Aksesibilitas WCAG AA).
* 🗄️ **[docs/DATABASE_DESIGN.md](./docs/DATABASE_DESIGN.md)**: Skema cloud database lengkap (Supabase PostgreSQL + Prisma ORM + `@prisma/adapter-pg`), relasi entitas, tipe enum, dan strategi indexing.
* 📁 **[docs/FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md)**: Tata letak direktori proyek Next.js App Router dengan pemisahan tegas Feature-Sliced Architecture.
* 🧪 **[docs/TEST_PLAN.md](./docs/TEST_PLAN.md)**: Rencana pengujian QA komprehensif (Unit Test, Integration Test, E2E QA Matrix, AI OCR Testing, & Keamanan Isolasi Data - **11 Test Suites, 90/90 Tests Passing 100%**).
* 📋 **[docs/TODO_TRACKER.md](./docs/TODO_TRACKER.md)**: Roadmap pengerjaan 8 fase bertahap (*Step-by-step checklist*) beserta kriteria penerimaan (*acceptance criteria*).

---

## 🚀 Fitur Utama

1. **Multi-Account & Net Worth**:
   * Kelola rekening bank (BCA, Mandiri, dll.), dompet digital (GoPay, OVO, DANA), uang tunai, dan aset investasi.
   * Transfer antar-rekening dengan pencatatan mutasi otomatis dan saldo terjaga atomik (ACID).
   * Kalkulasi *real-time* total kekayaan bersih (*Net Worth*).
2. **Pencatatan Harian & Smart Ingestion**:
   * Input cepat transaksi pemasukan, pengeluaran, dan mutasi.
   * **AI Vision OCR**: Foto struk belanja $\rightarrow$ otomatis ekstrak nominal, tanggal, toko, dan kategori via Google Gemini.
   * **Import CSV**: Upload mutasi bank untuk pencatatan transaksi sekaligus dengan auto-categorization pintar.
3. **Filter Waktu & Ekspor Laporan Dokumen (PDF & CSV)**:
   * **Filter Rentang Tanggal**: Pilihan instan (*Bulan Ini, Bulan Lalu, 3 Bulan, Tahun Ini*) dan kustom rentang tanggal kalender.
   * **Cetak Dokumen PDF Resmi (*Print-Ready Statement*)**: Tata letak rekening koran A4 bersih (*top-aligned, high-contrast, zero dark-mode artifacts*).
   * **Unduh CSV Spreadsheet**: Format CSV UTF-8 dengan BOM untuk kompatibilitas sempurna dengan Microsoft Excel dan Google Sheets.
4. **Target Tabungan Mandiri (Financial Goals)**:
   * Alokasi tabungan ke berbagai pos target (Dana Darurat, Liburan, Gadget, Kendaraan, dll.).
   * Visual progress bar, estimasi waktu target tercapai, dan *Smart Pace Indicator*.
5. **Analitik & Dashboard**:
   * Grafik tren arus kas (*Cashflow*) dan diagram donat proporsi pengeluaran per kategori.
   * Indikator *Safe-to-Spend* (batas aman belanja harian berbasis rata-rata 30 hari standar).
6. **Autentikasi & Keamanan Produksi**:
   * **Google OAuth**: Masuk 1-klik dengan akun Google (`Lanjutkan dengan Google`) dengan auto-seeding dompet awal & kategori.
   * **Credentials Auth**: Registrasi & login email + password terenkripsi bcrypt.
   * **Production Security**: Mode bypass dev/admin otomatis dinonaktifkan pada lingkungan produksi.
7. **Pusat Pengaturan (`/settings`)**:
   * Manajemen profil pengguna dan sinkronisasi nama *real-time*.
   * Konfigurasi batas anggaran belanja bulanan dengan simulator harian.
   * Manajemen kategori pemasukan & pengeluaran kustom dengan pemilih warna.
   * Toggle sensor privasi saldo dan status konektivitas AI Vision.
8. **Mobile-First Experience**:
   * Bottom navigation bar 6-item responsif di zona jangkauan jempol.
   * Header shortcut dan safe-area padding (`pb-24`).

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16.3+ (App Router, Server Actions, React Server Components)
* **Language**: TypeScript (Strict Mode, 100% typed)
* **Styling**: Tailwind CSS v4 + Shadcn UI + Lucide Icons
* **Database & ORM**: Supabase Cloud PostgreSQL + Prisma ORM + `@prisma/adapter-pg`
* **Authentication**: NextAuth.js (Auth.js v5) with Google OAuth Provider & Credentials
* **AI Vision API**: Google Gemini Flash Vision API (@google/genai)
* **Testing**: Vitest (**11 Test Suites, 90/90 Tests Passed 100%**)
* **Linting**: ESLint (0 errors, 0 warnings)
* **Hosting / CI-CD**: Vercel Serverless Edge Platform
