# 🏛️ System Architecture Document (SAD)
## Personal Finance, Multi-Asset & Goal Tracker

---

## 1. Executive Summary & Core Objectives
Aplikasi ini adalah **Modern Full-Stack Personal Finance Platform** yang dirancang untuk mengelola keuangan pribadi secara holistik. Berbeda dengan aplikasi pencatat kas biasa, sistem ini mengintegrasikan:
1. **Multi-Asset & Multi-Account Management** (Rekening Bank, E-Wallet, Cash, dan Portofolio Aset).
2. **Hybrid Goal Vaults** (Target tabungan finansial berbasis alokasi cerdas dari aset riil).
3. **Smart Data Ingestion Engine** (OCR Struk Belanja dengan AI Vision + Batch Bank Statement Parser).
4. **Interactive Financial Statement & Export Hub** (Isolated A4 Print Engine & CSV Spreadsheet Generator).
5. **Real-time Net Worth & Cashflow Analytics** (Batas Belanja Harian Safe-to-Spend berbasis 30 hari standar).
6. **Centralized Settings Hub** (Manajemen profil, batas anggaran, dan kategori kustom).

---

## 2. High-Level Architecture (C4 Model Context)

```mermaid
C4Context
    title System Context Diagram - Personal Finance Platform

    Person(user, "User / Pengguna", "Mengelola keuangan, input struk, memantau target tabungan, dan ekspor laporan.")
    
    System(app, "Personal Finance Web App (Next.js 16)", "Menyediakan antarmuka dashboard, logika bisnis, mutasi akun, cetak laporan, dan alokasi target.")
    
    System_Ext(geminiOcr, "Google Gemini Vision API", "Mengekstrak data teks, nominal, merchant, tanggal dari foto struk belanja.")
    System_Ext(db, "PostgreSQL Database", "Penyimpanan relasional ACID untuk transaksi, akun, target, anggaran, dan kategori.")
    System_Ext(storage, "Local File Storage (public/uploads)", "Menyimpan file foto struk belanja yang diunggah.")

    Rel(user, app, "Mengakses UI via Browser & Mobile", "HTTPS")
    Rel(app, db, "Query & Transaksi ACID", "Prisma ORM / TCP")
    Rel(app, geminiOcr, "Kirim gambar struk untuk ekstraksi data", "HTTPS / JSON REST")
    Rel(app, storage, "Upload & ambil file struk", "File System Stream")
```

---

## 3. Technology Stack & Decision Matrix

| Layer | Teknologi | Alasan Pemilihan (Architectural Rationale) |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | Full-stack terpadu, Server Actions untuk mutasi aman tanpa boilerplate API REST terpisah, Server Components untuk SSR cepat. |
| **Language** | **TypeScript (Strict Mode)** | Type-safety end-to-end dari database schema hingga UI components, mencegah runtime error pada manipulasi nominal uang. |
| **Styling & UI** | **Tailwind CSS v4 + Lucide Icons + Shadcn UI** | Komponen UI modular, aksesibel, responsif untuk perangkat mobile & desktop, tanpa overhead library UI berat. |
| **ORM & DB** | **Prisma ORM + PostgreSQL** | Relasi data kuat (ACID), migrasi deklaratif otomatis, dukungan atomic transactions (`$transaction`) untuk transfer saldo. |
| **Authentication** | **NextAuth.js (Auth.js v5)** | Standar industri untuk Next.js, mendukung JWT session berbasis User ID dan integrasi Credentials yang aman. |
| **AI / OCR Engine** | **Gemini Flash Vision API (@google/genai)** | Ekstraksi teks nota berkecepatan tinggi, akurasi tinggi membaca struk bahasa Indonesia, biaya efisien (token-based). |
| **Print & Export Engine** | **Isolated Iframe DOM + UTF-8 BOM CSV** | Menjamin hasil cetak PDF A4 bersih (*top-aligned, high-contrast, zero dark-mode artifacts*) dan kompatibel dengan Excel/Google Sheets. |
| **State Management** | **Zustand + React Server Actions + Context API** | State UI lokal yang sangat ringan untuk sensor privasi saldo dan filter data. |

---

## 4. Subsystem & Component Data Flow

### 4.1. Alur Transaksi Harian & Transfer Saldo
```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant UI as Next.js Client Page
    participant SA as Server Action (Mutation)
    participant DB as PostgreSQL (Prisma $transaction)

    U->>UI: Input transaksi (Pengeluaran / Pemasukan / Transfer)
    UI->>SA: Submit FormData dengan Zod Validation
    SA->>DB: Jalankan Prisma $transaction
    Note over DB: 1. Simpan baris Transaction<br/>2. Update balance di tabel Account (Asal & Tujuan)<br/>3. Update alokasi Target jika ada
    DB-->>SA: Commit Transaction Success
    SA-->>UI: Revalidate Path & Update Cache
    UI-->>U: Tampilkan notifikasi berhasil & saldo terupdate
```

### 4.2. Alur Smart OCR Receipt Ingestion
```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant UI as Receipt Upload Modal
    participant API as /api/ocr/receipt Endpoint
    participant AI as Gemini Vision API
    participant DB as Database

    U->>UI: Upload foto struk / nota belanja
    UI->>API: Kirim file gambar (Multipart / Base64)
    API->>AI: Kirim payload prompt ekstraksi terstruktur (JSON schema)
    AI-->>API: Response JSON { merchant, date, total, items[], categoryGuess }
    API-->>UI: Isi otomatis form transaksi dengan hasil ekstraksi
    U->>UI: Verifikasi / Koreksi manual jika perlu & Klik Simpan
    UI->>DB: Simpan Transaksi Permanen
```

### 4.3. Alur Cetak Laporan Keuangan PDF & CSV
```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant UI as ExportStatementModal
    participant PE as Isolated Print Engine (printFinancialStatement)
    participant IF as Hidden Print Frame

    U->>UI: Klik "Ekspor Laporan" & Pilih Periode
    UI->>UI: Hitung dynamic summary (Pemasukan, Pengeluaran, Net Cashflow)
    U->>UI: Klik "Cetak / Simpan PDF"
    UI->>PE: Invoke printFinancialStatement(transactions, periodLabel, userName)
    PE->>IF: Injeksi HTML Statement Standar Perbankan A4
    IF-->>U: Tampilkan Dialog Print / Save to PDF Browser
```

---

## 5. Security & Privacy Architecture

1. **User Data Isolation (Tenant Boundaries)**:
   * Setiap kueri database **wajib** menyertakan filter `where: { userId: session.user.id }`.
   * Akses langsung ke ID transaksi, akun, target, atau kategori pengguna lain dicegah di level Server Actions middleware.
2. **Financial Precision & Integrity**:
   * Nominal uang disimpan dalam format integer (`Int` / `Float` bulat) dalam satuan Rupiah untuk menghindari *floating-point arithmetic error*.
   * Transfer saldo dan alokasi target wajib dieksekusi dalam **Database Transaction (`prisma.$transaction`)** untuk menjamin konsistensi saldo.
3. **Receipt Storage & Privacy**:
   * Gambar struk disimpan secara lokal di direktori privat/terisolasi dengan enkripsi nama file hash unik.
   * Modus sensor privasi (`PrivacyProvider`) menyembunyikan nominal saldo di layar saat digunakan di ruang publik.
