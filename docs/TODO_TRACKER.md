# 📋 Project Implementation Tracker & Roadmap (TODO)
## Personal Finance, Multi-Asset & Goal Tracker

---

## 📊 Status Progres Ringkas
* **Total Milestone**: 6 Fase
* **Status Saat Ini**: `Fase 0 - Arsitektur & Perencanaan Selesai (Ready for Implementation)`

---

## 🎯 Fase 0: Project Setup & Baseline Tooling
- [ ] **0.1 Inisialisasi Proyek Next.js 14/15**
  - [ ] Setup Next.js App Router dengan TypeScript & Tailwind CSS.
  - [ ] Konfigurasi Lucide Icons & Shadcn UI primitives (Button, Input, Card, Dialog, Toaster).
  - [ ] Setup helper format Rupiah (`lib/currency.ts`) dan utils Tailwind (`cn`).
- [ ] **0.2 Setup Database & ORM**
  - [ ] Konfigurasi koneksi PostgreSQL di `.env`.
  - [ ] Inisialisasi file `prisma/schema.prisma` sesuai rancangan skema.
  - [ ] Jalankan migrasi awal (`npx prisma migrate dev --name init`).
  - [ ] Buat file seeder (`prisma/seed.ts`) untuk kategori default (Makanan, Transportasi, Gaji, dll.).

---

## 🔐 Fase 1: Autentikasi & Akun Pengguna
- [ ] **1.1 Setup NextAuth.js**
  - [ ] Konfigurasi Credentials Provider (Email & Password Hash bcrypt).
  - [ ] Pembuatan sesi JWT & middleware proteksi rute `(dashboard)/*`.
- [ ] **1.2 Halaman Auth**
  - [ ] Buat halaman `/login` dengan validasi form (Zod).
  - [ ] Buat halaman `/register` dengan auto-seed kategori untuk pengguna baru.

---

## 💳 Fase 2: Manajemen Multi-Akun & Aset (Accounts Module)
- [ ] **2.1 CRUD Akun & Dompet**
  - [ ] Server Action: Tambah akun baru (Bank, E-Wallet, Cash, Investasi).
  - [ ] Server Action: Edit & Arsipkan akun.
- [ ] **2.2 Fitur Transfer Antar-Akun**
  - [ ] Server Action transfer saldo atomik (`prisma.$transaction`).
  - [ ] Modal transfer dana (Pilih Akun Asal $\rightarrow$ Akun Tujuan $\rightarrow$ Nominal).
- [ ] **2.3 Komponen UI Akun**
  - [ ] Kartu ringkasan saldo per akun dengan warna/ikon khas.
  - [ ] Widget kalkulasi otomatis **Total Net Worth**.

---

## 📝 Fase 3: Pencatatan Transaksi Harian
- [ ] **3.1 Modul Transaksi Standar**
  - [ ] Form Input Transaksi Cepat (Pemasukan / Pengeluaran).
  - [ ] Pemilihan Kategori & Akun Sumber Saldo.
  - [ ] Tabel/List Riwayat Transaksi dengan filter (Bulan, Kategori, Akun).
  - [ ] Server Action hapus/edit transaksi dengan sinkronisasi saldo akun otomatis.
- [ ] **3.2 Fitur Import Mutasi (CSV/Excel)**
  - [ ] Parser file mutasi bank (BCA/Mandiri standard format).
  - [ ] Preview daftar transaksi sebelum di-commit ke database.

---

## 🤖 Fase 4: Smart OCR Receipt Ingestion (AI Vision)
- [ ] **4.1 Integrasi Gemini Vision API**
  - [ ] Service endpoint `/api/ocr/receipt` yang menerima gambar struk.
  - [ ] Prompt rekayasa AI terstruktur yang mengembalikan JSON `{ merchant, date, total, items[], category }`.
- [ ] **4.2 UI Scanner Struk**
  - [ ] Modal upload foto / kamera struk belanja.
  - [ ] State loading interaktif saat AI mengekstrak data.
  - [ ] Auto-fill form transaksi dengan tombol *Review & Confirm*.

---

## 🎯 Fase 5: Financial Goals (Hybrid Multi-Vault)
- [ ] **5.1 Manajemen Kantung Finansial**
  - [ ] Pembuatan Kantung Target (Nama, Target Nominal, Target Tanggal/Deadline, Ikon).
  - [ ] Hubungkan kantung ke akun simpanan tertentu (opsional).
- [ ] **5.2 Alokasi Dana Tabungan**
  - [ ] Server Action: Alokasi dana dari akun ke kantung target.
  - [ ] Server Action: Penarikan dana dari kantung kembali ke saldo bebas.
- [ ] **5.3 Visual Progress & Milestone**
  - [ ] Progress bar persentase pencapaian dengan indikator warna status.
  - [ ] Estimasi waktu target tercapai berdasarkan rata-rata tabungan bulanan.

---

## 📈 Fase 6: Dashboard Overview & Analitik
- [ ] **6.1 Dashboard Utama**
  - [ ] Ringkasan Saldo Net Worth, Pemasukan Bulan Ini, Pengeluaran Bulan Ini.
  - [ ] Kartu jalan pintas (*Quick Action*: Tambah Transaksi, Scan Struk, Transfer).
  - [ ] Widget 5 Transaksi Terakhir & Kantung Tabungan Teratas.
- [ ] **6.2 Visualisasi Data (Charts)**
  - [ ] Grafik Bar/Line: Tren Cashflow 6 bulan terakhir.
  - [ ] Donut Chart: Proporsi pengeluaran berdasarkan kategori.
- [ ] **6.3 Fitur "Safe-to-Spend"**
  - [ ] Kalkulator otomatis saldo aman belanja harian.

---

## 🚀 Kriteria Keberhasilan (Acceptance Criteria)
1. **Zero Balance Desynchronization**: Saldo akun selalu cocok 100% dengan akumulasi mutasi transaksi.
2. **Instant Receipt Logging**: Waktu pemrosesan struk dari upload foto hingga form terisi < 3 detik.
3. **Seamless Mobile Experience**: Tampilan responsif dan nyaman digunakan di layar HP.
