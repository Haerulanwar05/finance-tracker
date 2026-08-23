# 💰 Personal Finance, Multi-Asset & Goal Tracker

Aplikasi modern full-stack pencatatan keuangan harian, manajemen multi-aset (bank, e-wallet, cash, investasi), kantung target tabungan (*financial goals*), serta input pintar berbasis **AI Vision OCR** untuk struk belanja dan import mutasi bank.

---

## 📚 Dokumentasi Proyek Lengkap

Semua perencanaan sistem dan panduan teknis telah disusun secara terstruktur di folder [`docs/`](./docs):

* 🏛️ **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: Arsitektur sistem (C4 Model), Tech Stack Decision Matrix, Data Flow transaksi & OCR, serta standar keamanan finansial.
* 🎨 **[docs/UI_UX_DESIGN_SYSTEM.md](./docs/UI_UX_DESIGN_SYSTEM.md)**: Sistem desain visual modern (Bento Grid, Glassmorphism, Color Tokens, Micro-interactions, & Accessibility WCAG AA).
* 🗄️ **[docs/DATABASE_DESIGN.md](./docs/DATABASE_DESIGN.md)**: Skema database lengkap (PostgreSQL + Prisma ORM), relasi entitas, tipe enum, dan strategi indexing.
* 📁 **[docs/FOLDER_STRUCTURE.md](./docs/FOLDER_STRUCTURE.md)**: Tata letak direktori proyek Next.js App Router dengan pemisahan tegas Front-End vs Back-End.
* 🧪 **[docs/TEST_PLAN.md](./docs/TEST_PLAN.md)**: Rencana pengujian QA komprehensif (Unit Test, Integration Test, E2E Playwright, AI OCR Testing, & Keamanan Isolasi Data).
* 📋 **[docs/TODO_TRACKER.md](./docs/TODO_TRACKER.md)**: Roadmap pengerjaan 6 fase bertahap (*Step-by-step checklist*) beserta kriteria penerimaan (*acceptance criteria*).

---

## 🚀 Fitur Utama

1. **Multi-Account & Net Worth**:
   * Kelola rekening bank (BCA, Mandiri, dll.), dompet digital (GoPay, OVO, DANA), uang tunai, dan aset investasi.
   * Transfer antar-akun dengan pencatatan mutasi otomatis.
   * Kalkulasi *real-time* total kekayaan bersih (*Net Worth*).
2. **Pencatatan Harian & Smart Import**:
   * Input cepat transaksi pemasukan dan pengeluaran.
   * **AI Vision OCR**: Foto struk belanja $\rightarrow$ otomatis ekstrak nominal, tanggal, toko, dan kategori.
   * **Import CSV**: Upload mutasi bank untuk pencatatan transaksi sekaligus.
3. **Financial Goals (Hybrid Multi-Vault)**:
   * Alokasi tabungan ke berbagai pos target (Dana Darurat, Liburan, Gadget, dll.).
   * Visual progress bar dan estimasi waktu target tercapai.
4. **Analitik & Dashboard**:
   * Grafik tren arus kas (*Cashflow*).
   * Diagram lingkaran proporsi pengeluaran per kategori.
   * Indikator *Safe-to-Spend* (saldo aman dibelanjakan).

---

## 🛠️ Tech Stack

* **Framework**: Next.js 14/15 (App Router, Server Actions, React Server Components)
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS + Shadcn UI + Lucide Icons
* **Database & ORM**: PostgreSQL + Prisma ORM
* **Authentication**: NextAuth.js (Auth.js v5)
* **AI Vision API**: Google Gemini Flash Vision API
