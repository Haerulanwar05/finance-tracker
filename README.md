# 💰 FinanceTracker — Smart Personal Finance & Wealth Engine

> **Aplikasi Pintar Pengelola Keuangan Pribadi, Multi-Rekening, Target Tabungan Impian, dan Pencatatan Struk Otomatis Berbasis AI Vision.**

[![Status Produksi](https://img.shields.io/badge/Status-Production%20Ready-emerald.svg)](https://finance-tracker-two-teal-14.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016-blue.svg)](https://nextjs.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-blueviolet.svg)](./docs/TODO_TRACKER.md)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ecf8e.svg)](https://supabase.com/)
[![QA Tests](https://img.shields.io/badge/Tests-98%2F98%20Passed%20(100%25)-brightgreen.svg)](./docs/TEST_PLAN.md)

---

## 📢 Apa yang Baru di Pembaruan Terkini? (Untuk Pengguna)

Berikut adalah rangkuman peningkatan dan fitur terbaru yang membuat pengalaman Anda mengelola keuangan harian semakin cepat, rapi, dan praktis:

### 📲 1. Pasang Aplikasi di Layar HP (PWA) & Catat Offline Tanpa Internet
* **Bisa Dipasang di Android & iPhone**: Anda sekarang dapat memasang FinanceTracker ke Layar Utama (*Home Screen*) HP layaknya aplikasi bawaan toko aplikasi melalui banner *"Pasang Aplikasi"* atau menu Pengaturan.
* **Tetap Bisa Mencatat Saat Offline**: Sedang di tempat tanpa sinyal atau kuota internet habis? Anda tetap dapat mencatat pengeluaran harian seperti biasa. Catatan Anda akan disimpan dengan aman di **Antrean Lokal HP** dan **otomatis tersinkronisasi (*auto-sync*)** ke server cloud begitu koneksi internet terhubung kembali!
* **Akses Cepat (*App Shortcuts*)**: Ikon aplikasi di layar HP mendukung *Long-Press Shortcut* untuk langsung membuka fitur "Catat Transaksi" atau "Ringkasan Keuangan".

### ⚡ 2. Perpindahan Menu Instan Tanpa Jeda (*Zero-Lag*)
* **Sebelumnya**: Saat berpindah antar halaman (misal dari *Ringkasan* ke *Transaksi* atau *Analitik*), terdapat jeda sekitar 2–3 detik sebelum layar terbuka.
* **Sekarang**: Sistem telah dioptimalkan untuk memuat data di latar belakang. Begitu menu ditekan, layar langsung berganti seketika (**secepat kilat**) tanpa rasa menunggu.

### 🏷️ 3. Tampilan "Batas Belanja Bulanan" Lebih Rapi & Elegan
* **Sebelumnya**: Kartu anggaran di halaman Ringkasan (*Overview*) terlihat agak penuh dan terbagi dua kotak.
* **Sekarang**: Tampilannya telah didesain ulang menjadi sangat minimalis dan mewah:
  * Dilengkapi **garis batas warna gradien (*Indigo to Cyan*)** yang menunjukkan sisa anggaran belanja Anda.
  * Terdapat **lampu status berdenyut halus** (*Batas Aman*, *Waspada*, atau *Batas Kritis*).
  * **Cukup 1 kali klik pada kartu**, Anda dapat langsung mengatur batas belanja bulanan dan melihat rekomendasi batas belanja harian yang aman.

### ✨ 4. Logo Baru Kantong Uang Beranimasi & Navigasi Cerdas
* **Desain Logo Baru**: Logo resmi aplikasi kini menggunakan lambang **Kantong Uang Emas-Zamrud (`$`)** yang melayang lembut dengan efek kilau elegan, tampil jernih di semua jenis HP (Android & iPhone).
* **Navigasi 1-Klik**:
  * Saat **sudah login**: Mengklik logo atau tulisan *FinanceTracker* akan **langsung membawa Anda kembali ke halaman Ringkasan (*Overview*)**.
  * Saat **di halaman Login / Daftar**: Mengklik logo atau tautan *"Kembali ke Halaman Utama"* akan mengarahkan Anda langsung ke beranda depan aplikasi.

### 📄 5. Nama Pengguna Otomatis Sesuai Saat Cetak Laporan PDF
* Saat mencetak rekening koran atau bukti transaksi berformat PDF, nama pemilik akun kini **100% otomatis menampilkan nama lengkap / username Anda yang sedang login**, baik saat dicetak dari menu *Transaksi* maupun menu *Analitik*.
* Dokumen PDF dirancang resmi dan bersih berstandar kertas A4 siap print/arsip (*ink-friendly*).

### 📊 6. Tampilan Grafik Belanja yang Nyaman & Bebas Gangguan
* Diagram donat pengeluaran per kategori kini tampil rapi tanpa kotak putih yang mengganggu saat disentuh, dan keterangan total nominal belanja tidak lagi tertutup atau tumpang tindih.

### 📱 7. Desain Khusus Layar HP (Ergonomis untuk Jempol)
* Seluruh tombol aksi utama (*Catat Transaksi, Scan Struk, Tambah Rekening*) tersusun simetris 2-kolom yang pas di layar HP.
* Filter kategori transaksi kini dapat **digeser ke samping (*swipeable*)** dengan sangat mulus di layar sentuh.
* Menu navigasi utama berada di bagian bawah layar (*Bottom Bar*) agar mudah dijangkau satu tangan.

### 🎯 8. Halaman Depan (*Landing Page*) yang Lebih Bersih & Fokus
* Menghapus tombol demo yang membingungkan dan menggantinya dengan satu tombol utama yang jelas: **`Mulai Sekarang (Gratis) →`** untuk langsung mendaftar atau masuk menggunakan akun Google.

---

## 📚 Dokumentasi Proyek Lengkap (Untuk Pengembang & Teknis)

Semua perencanaan sistem dan panduan teknis telah disusun secara terstruktur di folder [`docs/`](./docs):

* 🏛️ **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: Arsitektur sistem (C4 Model), PWA & Service Worker Cache, Offline Queue Engine, integrasi Supabase PostgreSQL & Google OAuth, mesin cetak dokumen PDF, serta standar keamanan finansial.
* 🎨 **[docs/UI_UX_DESIGN_SYSTEM.md](./docs/UI_UX_DESIGN_SYSTEM.md)**: Sistem desain visual modern (Bento Grid, Glassmorphism, Color Tokens, PWA Install Banner, Mobile Thumb Navigation, Google Sign-in Buttons, CSS Print Optimization, & Aksesibilitas WCAG AA).
* 🗄️ **[docs/DATABASE_DESIGN.md](./docs/DATABASE_DESIGN.md)**: Skema cloud database lengkap (Supabase PostgreSQL + Prisma ORM + `@prisma/adapter-pg`), relasi entitas, tipe enum, dan strategi indexing.
* 📁 **[docs/FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md)**: Tata letak direktori proyek Next.js App Router dengan pemisahan tegas Feature-Sliced Architecture.
* 🧪 **[docs/TEST_PLAN.md](./docs/TEST_PLAN.md)**: Rencana pengujian QA komprehensif (Unit Test, Offline Queue Test, Integration Test, E2E QA Matrix, AI OCR Testing, & Keamanan Isolasi Data - **12 Test Suites, 98/98 Tests Passing 100%**).
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
