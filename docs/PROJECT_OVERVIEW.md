# 💰 Personal Finance, Multi-Asset & Goal Tracker

Aplikasi modern *full-stack* pencatatan keuangan harian, manajemen multi-aset (bank, e-wallet, cash, investasi), target tabungan finansial (*financial goals*), input pintar berbasis **AI Vision OCR** untuk struk belanja, ekspor laporan keuangan profesional, serta siap produksi dengan **Cloud Database Supabase & Google OAuth**.

---

## 📚 Dokumentasi Proyek Lengkap

Semua perencanaan sistem dan panduan teknis telah disusun secara terstruktur di folder [`docs/`](./docs):

* 🏛️ **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: Arsitektur sistem (C4 Model), Tech Stack Decision Matrix, Data Flow transaksi & OCR, integrasi Supabase PostgreSQL & Google OAuth, mesin cetak dokumen PDF, serta standar keamanan finansial.
* 🎨 **[docs/UI_UX_DESIGN_SYSTEM.md](./docs/UI_UX_DESIGN_SYSTEM.md)**: Sistem desain visual modern (Bento Grid, Glassmorphism, Color Tokens, Mobile Thumb Navigation, Google Sign-in Buttons, CSS Print Optimization, & Aksesibilitas WCAG AA).
* 📁 **[docs/FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md)**: Tata letak direktori proyek Next.js App Router dengan pemisahan tegas Feature-Sliced Architecture.
* 🧪 **[docs/TEST_PLAN.md](./docs/TEST_PLAN.md)**: Rencana pengujian QA komprehensif (Unit Test, Integration Test, E2E QA Matrix, AI OCR Testing, Offline Queue Engine & Keamanan Isolasi Data - **16 Test Suites, 144/144 Tests Passing 100%**).
* 📋 **[docs/TODO_TRACKER.md](./docs/TODO_TRACKER.md)**: Roadmap pengerjaan 10 fase bertahap (*Step-by-step checklist*) dan rencana inovasi masa depan.

---

## 🚀 Fitur Utama

1. **Multi-Account, Balance Sorting & Net Worth**:
   * Kelola rekening bank (BCA, Mandiri, dll.), dompet digital (GoPay, OVO, DANA), uang tunai, dan aset investasi.
   * **Fitur Pengurutan Saldo (Ascending & Descending)**: Urutkan rekening dari Saldo Tertinggi ($\downarrow$) atau Saldo Terendah ($\uparrow$) dengan secondary tie-breaker deterministik dan toleransi saldo negatif.
   * Transfer antar-rekening dengan pencegahan tabrakan (*auto-collision resolver*), tombol tukar arah (🔁), dan integritas atomik (ACID).
   * Kalkulasi *real-time* total kekayaan bersih (*Net Worth*) yang merespons instan (< 250ms) saat transaksi dicatat atau diedit.
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
6. **Progressive Web App (PWA) & Offline Queue Engine**:
   * **Multi-Device Installable**: Pasang sebagai aplikasi mandiri di HP (Android/iPhone) maupun di Desktop PC/Laptop (Chrome/Edge/Mac).
   * **Catat Transaksi Tanpa Sinyal (Offline-Ready)**: Transaksi tersimpan aman di antrean lokal perangkat saat offline dan otomatis tersinkronisasi (*auto-sync*) ke cloud begitu koneksi internet kembali.
7. **Performa Tinggi (*Sub-50ms Instant Navigation & Parallel CRUD*)**:
   * Optimasi kueri database paralel (*Promise.all*) memangkas waktu mutasi simpan/edit/hapus dari 1.5 detik menjadi < 200ms.
   * **Instant Optimistic Navigation (0ms)**: Penanda tab aktif berpindah instan saat diklik tanpa menunggu respon jaringan.
   * Proactive route warmup prefetching (`onMouseEnter` & `onTouchStart`), hairline top shimmer bar, dan dedicated per-segment streaming skeletons (`loading.tsx`).
8. **Brand Identity & Navigasi Cerdas**:
   * **Animated Luxury Dollar Bag Logo**: Logo kantong dollar vektor interaktif dengan floating physics & shimmer glow.
   * **Smart Routing**: Klik logo mengarahkan ke Overview (`/dashboard`) saat login, atau ke Landing Page (`/`) pada form auth.
9. **Autentikasi & Keamanan Produksi**:
   * **Google OAuth**: Masuk 1-klik dengan akun Google (`Lanjutkan dengan Google`) dengan auto-seeding dompet awal & kategori.
   * **Credentials Auth**: Registrasi & login email + password terenkripsi bcrypt.
   * **Production Security**: Mode bypass dev/admin otomatis dinonaktifkan pada lingkungan produksi.
10. **Pusat Pengaturan (`/settings`)**:
    * Manajemen profil pengguna dan sinkronisasi nama *real-time*.
    * Konfigurasi batas anggaran belanja bulanan dengan simulator harian.
    * Manajemen kategori pemasukan & pengeluaran kustom dengan pemilih warna.
    * Toggle sensor privasi saldo, status PWA & pengelolaan antrean transaksi offline.
11. **Mobile-First Experience**:
    * Bottom navigation bar 6-item responsif di zona jangkauan jempol.
    * Symmetrical 2-column mobile button grids dan swipeable horizontal category filters.
12. **Obsidian Sovereign Visual Architecture (Anti-AI Slop)**:
    * Arsitektur desain Swiss Fintech dengan font Geist Sans/Mono, tabular numerals, specular micro-borders (`border-white/[0.08]`), tactile button bevels, dan kartu fisik rekening premium.
13. **Zero-Crash Resilience, Supabase Pooler & Self-Healing Auto-Recovery**:
    * **Supabase Transaction Pooler (Port 6543)**: Mengeliminasi batas koneksi ketat session mode (`pool_size: 15`), mengalirkan seluruh transaksi via PgBouncer untuk stabilitas ribuan panggilan serverless.
    * **Self-Healing Error Boundaries**: Otomatis memulihkan diri (*1x transparent reload*) saat terdeteksi deployment chunk mismatch baru dengan proteksi *cooldown* 15 detik.
    * **Multi-Tier Safe Fallbacks**: Seluruh Server Actions dan Server Components diproteksi dengan `try ... catch` sehingga aplikasi tidak pernah crash fatal.
14. **Fleksibilitas Domain & Hosting**:
    * Dukungan penuh penamaan subdomain bersih di Vercel (`*.vercel.app`) dan integrasi *Custom Domain* resmi (misal: `financetracker-id.vercel.app`).

---

## 🛠️ Tech Stack

* **Framework**: Next.js 16.3+ (App Router, Server Actions, React Server Components)
* **Language**: TypeScript (Strict Mode, 100% typed)
* **Styling**: Tailwind CSS v4 + Obsidian Sovereign Design Tokens + Lucide Icons
* **PWA & Offline**: Web App Manifest + Service Worker + Local Queue Auto-Sync Engine
* **Database & ORM**: Supabase Cloud PostgreSQL + Prisma ORM + `@prisma/adapter-pg` (Transaction Pooler Port 6543)
* **Authentication**: NextAuth.js (Auth.js v5) with Google OAuth Provider & Credentials
* **AI Vision API**: Google Gemini Flash Vision API (@google/genai)
* **Testing**: Vitest (**16 Test Suites, 144/144 Tests Passed 100%**)
* **Linting**: ESLint (0 errors, 0 warnings)
* **Hosting / CI-CD**: Vercel Serverless Edge Platform
