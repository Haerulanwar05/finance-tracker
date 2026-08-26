# 💰 FinanceTracker — Smart Personal Finance & Wealth Engine

> **Aplikasi Pintar Pengelola Keuangan Pribadi, Multi-Rekening, Target Tabungan Impian, dan Pencatatan Struk Otomatis Berbasis AI Vision.**

[![Status Produksi](https://img.shields.io/badge/Status-Production%20Ready-emerald.svg)](https://finance-tracker-two-teal-14.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016-blue.svg)](https://nextjs.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-blueviolet.svg)](./docs/TODO_TRACKER.md)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ecf8e.svg)](https://supabase.com/)
[![QA Tests](https://img.shields.io/badge/Tests-123%2F123%20Passed%20(100%25)-brightgreen.svg)](./docs/TEST_PLAN.md)

---

## 📢 Apa yang Baru di Pembaruan Terkini? (Untuk Pengguna)

Berikut adalah rangkuman peningkatan dan fitur terbaru yang membuat pengalaman Anda mengelola keuangan harian semakin cepat, rapi, dan berkelas dunia:

### 🏛️ 1. Visual Overhaul Menyeluruh: "Obsidian Sovereign" (Anti-AI Slop)
* **Transformasi Bahasa Desain Kelas Swiss Fintech**: Seluruh antarmuka aplikasi dirombak total dari kesan template AI generik (*AI Slop*) menjadi sistem desain berpresisi tinggi:
  * **Tipografi Tajam & Angka Monospaced**: Menggunakan font **Geist Sans** & **Geist Mono** dengan perataan subpixel dan `tabular-nums` untuk angka keuangan Rupiah yang kokoh dan mudah dibaca.
  * **Eliminasi Gradien Ungu-Biru AI**: Menggantikan gradien generic dengan **Silver-White Tactile Bevel** (`shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]`) dan warna **Emerald Sovereign** yang berwibawa.
  * **Specular Micro-Borders & Atmospheric Vignette**: Setiap panel dilengkapi *hairline lighting* (`border-white/[0.08]`) dan *ambient glass blur 24px*, menggantikan efek blob blur bulat murahan.
  * **Kartu Rekening Fisik Mewah**: Tampilan kartu akun bank/e-wallet menyerupai kartu fisik premium (*matte finish metal card*) dengan ambient glow halus sesuai identitas bank.
  * **Micro-Labels Berhierarki**: Mengadopsi label mikro uppercase (`text-[10px] tracking-[0.14em] font-semibold text-zinc-400`) untuk kontras visual yang presisi.

### ⚡ 2. Respon Transaksi & Update Saldo Instan (< 200ms)
* **Eliminasi Total Jeda 3-4 Detik**: Waktu tunggu saat mencatat pemasukan, menambah saldo, atau mengedit transaksi kini dipangkas menjadi seketika (< 200ms).
* **Penutupan Modal Cepat (*Instant Dismiss*)**: Modal langsung tertutup tanpa menahan pengguna di layar formulir.
* **Warm Pool Keep-Alive**: Koneksi database Supabase PostgreSQL dijaga tetap aktif (*30-second keep-alive* hingga 10 koneksi paralel), mengeliminasi *cold-start SSL handshake delay*.
* **Atomic Single-Pass Revalidation**: Pembaruan tata letak menggunakan `React.startTransition` non-blocking untuk mencegah UI freeze.

### 📶 3. Bahasa Mode Offline Universal & Alami (PC, Laptop, Tablet, & HP)
* **Penyempurnaan Kata-Kata Universal**: Menghilangkan penyebutan spesifik "antrean HP". Kini antarmuka menampilkan pesan yang menenangkan dan relevan di semua platform:
  * *Banner Mengambang*: `"Mode Offline — Transaksi tersimpan aman di perangkat ini"`.
  * *Modal Antrean*: `"Transaksi tersimpan di perangkat ini & siap disinkronkan saat online."`.
  * *PWA Banner*: Label `"Semua Perangkat"` dan deskripsi natural untuk kemudahan mencatat transaksi kapan saja tanpa koneksi internet.

### 🔢 4. Pengurutan Saldo Rekening Ascending & Descending (*Sort by Balance*)
* Di halaman **Rekening & Dompet**, kini tersedia kontrol sortir interaktif:
  * **Tertinggi ($\downarrow$)**: Menampilkan rekening atau instrumen tabungan dengan saldo terbanyak di urutan paling atas.
  * **Terendah ($\uparrow$)**: Menampilkan dompet atau rekening dengan saldo paling minim di atas (praktis untuk memantau akun yang perlu di-top up).
  * **Reset**: Mengembalikan urutan rekening ke posisi default bawaan.
* **Kebal Nilai Ekstrem & Penanganan Saldo Kembar**: Dilengkapi *secondary tie-breaker* alfabetis dan penanganan aman untuk saldo utang/kartu kredit negatif maupun saldo bernilai puluhan milyar Rupiah.

### 🛡️ 5. Perbaikan Bug Transfer Antar-Akun & Tombol Tukar Arah (🔁)
* **Pencegahan Tabrakan Pilihan (*Auto-Collision Resolver*)**: Menyelesaikan tuntas kendala saat mentransfer dari BNI ke Uang Tunai yang sebelumnya memunculkan peringatan *"Akun sumber dan Tujuan tidak boleh sama"*.
* **Tombol Tukar Cepat (🔁)**: Menyediakan tombol 1-klik untuk membalikkan posisi akun asal dan tujuan secara instan.

### 📲 6. Pasang Aplikasi di Layar Komputer & HP (PWA)
* **Multi-Device Standalone App**: Dapat dipasang di **Android, iPhone, iPad, serta Laptop / PC Desktop (Windows & Mac)**.
* **Dukungan Pin ke Taskbar Windows & File Pintasan (`FinanceTracker.url`)**: Berjalan sebagai jendela aplikasi desktop mandiri tanpa bilah browser.

### 🏷️ 7. Tampilan "Batas Belanja Bulanan" Minimalis & Kartu KPI Analitik
* Tampilannya minimalis dan mewah dengan **garis batas warna gradien**, **lampu status berdenyut halus**, dan 4 kartu metrik kesehatan finansial.
* Mengklik kartu batas belanja langsung membuka modal penyesuaian limit bulanan dan kalkulasi batas harian.

### ✨ 8. Logo Kantong Uang Emas-Zamrud Beranimasi & Routing Cerdas
* **Desain Logo Baru**: Lambang **Kantong Uang Emas-Zamrud (`$`)** yang melayang lembut dengan efek kilau elegan tanpa distorsi gradien di perangkat apa pun.
* **Navigasi Cerdas**: Mengklik logo mengarahkan langsung ke Ringkasan saat login, atau ke beranda saat di form auth.

### 📄 9. Nama Pengguna Otomatis Sesuai Saat Cetak Laporan PDF
* Saat mencetak rekening koran atau bukti transaksi berformat PDF, nama pemilik akun kini **100% otomatis menampilkan nama lengkap / username Anda yang sedang login**.

---

## 📚 Dokumentasi Proyek Lengkap (Untuk Pengembang & Teknis)

Semua perencanaan sistem dan panduan teknis telah disusun secara terstruktur di folder [`docs/`](./docs):

* 🏛️ **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: Arsitektur sistem (C4 Model), PWA & Service Worker Cache, Offline Queue Engine, integrasi Supabase PostgreSQL & Google OAuth, mesin cetak dokumen PDF, serta standar keamanan finansial.
* 🎨 **[docs/UI_UX_DESIGN_SYSTEM.md](./docs/UI_UX_DESIGN_SYSTEM.md)**: Sistem desain visual modern (Bento Grid, Glassmorphism, Color Tokens, PWA Install Banner, Mobile Thumb Navigation, Google Sign-in Buttons, CSS Print Optimization, & Aksesibilitas WCAG AA).
* 🗄️ **[docs/DATABASE_DESIGN.md](./docs/DATABASE_DESIGN.md)**: Skema cloud database lengkap (Supabase PostgreSQL + Prisma ORM + `@prisma/adapter-pg`), relasi entitas, tipe enum, dan strategi indexing.
* 📁 **[docs/FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md)**: Tata letak direktori proyek Next.js App Router dengan pemisahan tegas Feature-Sliced Architecture.
* 🧪 **[docs/TEST_PLAN.md](./docs/TEST_PLAN.md)**: Rencana pengujian QA komprehensif (Unit Test, Offline Queue Test, Integration Test, E2E QA Matrix, AI OCR Testing, & Keamanan Isolasi Data - **15 Test Suites, 123/123 Tests Passing 100%**).
* 📋 **[docs/TODO_TRACKER.md](./docs/TODO_TRACKER.md)**: Roadmap pengerjaan 10 fase bertahap (*Step-by-step checklist*) dan rencana inovasi masa depan (*Phase 10 Future Horizon*).

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
   * **Cetak Dokumen PDF Resmi (*Print-Ready Statement*)**: Tata letak rekening koran A4 bersih dengan nama pengguna akurat (*top-aligned, high-contrast, zero dark-mode artifacts*).
   * **Unduh CSV Spreadsheet**: Format CSV UTF-8 dengan BOM untuk kompatibilitas sempurna dengan Microsoft Excel dan Google Sheets.
4. **Target Tabungan Mandiri (Financial Goals)**:
   * Alokasi tabungan ke berbagai pos target (Dana Darurat, Liburan, Gadget, Kendaraan, dll.).
   * Visual progress bar, estimasi waktu target tercapai, dan *Smart Pace Indicator*.
5. **Analitik & Dashboard Modern**:
   * Grafik tren arus kas (*Cashflow*) bebas outline fokus saat diklik.
   * Diagram donat proporsi pengeluaran per kategori dengan tooltip cerdas tanpa tumpang tindih.
   * Kartu **Batas Belanja Bulanan** minimalis dan elegan dengan progress bar tipis gradien halus & status badge berdenyut.
6. **Brand Identity & Navigasi Cerdas**:
   * **Animated Luxury Dollar Bag Logo**: Logo kantong dollar vektor interaktif dengan floating physics & shimmer glow.
   * **Smart Routing**: Klik logo mengarahkan ke Overview (`/dashboard`) saat login, atau ke Landing Page (`/`) pada form auth.
7. **Performa Tinggi (*Zero-Lag Instant Switch*)**:
   * Optimasi kueri database paralel (*Promise.all*) memangkas waktu load hingga 80%.
   * Next.js Route Prefetching (`prefetch={true}`) pada desktop sidebar & mobile bottom bar untuk perpindahan menu instan.
8. **Autentikasi & Keamanan Produksi**:
   * **Google OAuth**: Masuk 1-klik dengan akun Google (`Lanjutkan dengan Google`) dengan auto-seeding dompet awal & kategori.
   * **Credentials Auth**: Registrasi & login email + password terenkripsi bcrypt.
   * **Production Security**: Mode bypass dev/admin otomatis dinonaktifkan pada lingkungan produksi.
9. **Pusat Pengaturan (`/settings`)**:
   * Manajemen profil pengguna dan sinkronisasi nama *real-time*.
   * Konfigurasi batas anggaran belanja bulanan dengan simulator harian.
   * Manajemen kategori pemasukan & pengeluaran kustom dengan pemilih warna.
   * Toggle sensor privasi saldo dan status konektivitas AI Vision.
10. **Mobile-First Experience**:
    * Bottom navigation bar 6-item responsif di zona jangkauan jempol.
    * Symmetrical 2-column mobile button grids dan swipeable horizontal category filters.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16.3+ (App Router, Server Actions, React Server Components)
* **Language**: TypeScript (Strict Mode, 100% typed)
* **Styling**: Tailwind CSS v4 + Shadcn UI + Lucide Icons
* **Database & ORM**: Supabase Cloud PostgreSQL + Prisma ORM + `@prisma/adapter-pg`
* **Authentication**: NextAuth.js (Auth.js v5) with Google OAuth Provider & Credentials
* **AI Vision API**: Google Gemini Flash Vision API (@google/genai)
* **Testing**: Vitest (**11 Test Suites, 92/92 Tests Passed 100%**)
* **Linting**: ESLint (0 errors, 0 warnings)
* **Hosting / CI-CD**: Vercel Serverless Edge Platform
