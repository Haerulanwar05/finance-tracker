# 📁 Project Folder Structure & Clean Architecture
## Next.js 16 App Router Layout

---

## 1. Architectural Philosophy
Struktur direktori dirancang mengikuti prinsip **Modular Feature-Sliced Design** dan **Clean Layered Architecture** pada ekosistem Next.js App Router:
* **Separation of Concerns**: Memisahkan antarmuka (UI), logika bisnis (Server Actions / Services), akses data (Prisma DAL), dan validasi skema (Zod).
* **Colocation**: Komponen UI khusus, schema, dan actions diletakkan dekat dengan modul fiturnya.
* **Server-First**: Memaksimalkan React Server Components (RSC) untuk keamanan data dan kecepatan render.

---

## 2. Pemisahan Layer: Front-End vs Back-End

Berikut adalah pemetaan tugas dan batas arsitektur antara **Front-End (UI/Client)** dan **Back-End (Server/Data/Business Logic)**:

```text
finance-tracker/
│
├── 🗄️ [BACK-END] Database & Migrations
│   └── prisma/
│       ├── schema.prisma             # Skema tabel database (Prisma ORM)
│       └── dev.db                    # Database SQLite / PostgreSQL instance
│
├── 🎨 [FRONT-END] Static Assets
│   └── public/
│       ├── icons/                    # Asset gambar & ikon statis
│       └── uploads/receipts/         # Direktori penyimpanan foto struk belanja
│
└── src/
    │
    ├── 🖥️ [FRONT-END] View & UI Components Layer
    │   ├── app/
    │   │   ├── layout.tsx            # Root HTML, Fonts & Theme Provider
    │   │   ├── (auth)/               # Halaman Login & Register
    │   │   └── (dashboard)/          # Halaman Dashboard, Transaksi, Rekening, Target, Analitik, Pengaturan
    │   │
    │   ├── components/ui/            # Komponen Atomik UI (Button, Dialog, Input, Card)
    │   ├── components/layout/        # Navigasi (Sidebar, Header, Mobile Bottom Nav 6-item)
    │   ├── context/                  # Global React Context (Privacy Sensor Saldo)
    │   │
    │   └── features/*/components/    # Komponen Interaktif per Fitur:
    │       ├── accounts/components/  # Modal Tambah Rekening, Transfer Card
    │       ├── transactions/components/ # Form Input Cepat, List Filter, ExportStatementModal
    │       ├── ocr/components/       # Modal Scanner Struk dengan Animasi Laser
    │       ├── goals/components/     # Progress Bar Target Tabungan Mandiri
    │       ├── dashboard/components/ # Bento Metrics, Cashflow & Category Donut Charts
    │       ├── analytics/components/ # Health Score, Safe-to-Spend Dial, AI Suggestion
    │       └── settings/components/  # Profile Editor, Budget Sliders, Custom Categories
    │
    ├── ⚙️ [BACK-END] Business Logic & API Layer
    │   ├── app/api/                  # REST API Endpoints:
    │   │   ├── auth/[...nextauth]/   # Handler sesi autentikasi NextAuth
    │   │   └── ocr/receipt/          # Endpoint integrasi AI Gemini Vision
    │   │
    │   ├── features/*/actions.ts     # Server Actions (Mutasi DB, Saldo atomik, Otorisasi):
    │   │   ├── accounts/actions.ts
    │   │   ├── transactions/actions.ts
    │   │   ├── goals/actions.ts
    │   │   ├── dashboard/actions.ts
    │   │   └── settings/actions.ts
    │   │
    │   ├── features/transactions/lib/
    │   │   ├── csv-parser.ts         # Parser mutasi bank Indonesia (BCA, Mandiri, BRI, Jago)
    │   │   ├── export-csv.ts         # Utility ekspor CSV dengan UTF-8 BOM
    │   │   └── print-statement.ts    # Isolated A4 print engine berstandar perbankan
    │   │
    │   └── lib/                      # Core Server Utilities:
    │       ├── prisma.ts             # Prisma Client singleton
    │       └── auth.ts               # Konfigurasi NextAuth & Password Hash
    │
    └── 🔄 [SHARED] Cross-Cutting (Digunakan di FE & BE)
        ├── features/*/schema.ts      # Zod Schema (Validasi Form di FE & Validasi Request di BE)
        ├── types/index.ts            # TypeScript Types & DTO Interfaces
        ├── lib/currency.ts           # Formatter & Parser Rupiah
        └── lib/utils.ts              # Helper classnames (cn)
```

---

## 3. Rincian Tanggung Jawab (Front-End vs Back-End)

| Kategori | Folder / File | Peran & Tanggung Jawab |
| :--- | :--- | :--- |
| 🖥️ **Front-End** | `src/app/(dashboard)/*` | Menampilkan antarmuka pengguna, menangani state form, filter kalender, dan transisi UI. |
| 🖥️ **Front-End** | `src/components/*` | Komponen visual reusable (DashboardShell, Navbar, Modal). |
| 🖥️ **Front-End** | `src/features/*/components/*` | Komponen spesifik fitur (Kamera scanner, modal transfer, kartu target, export modal). |
| ⚙️ **Back-End** | `prisma/*` | Struktur relasi data, tabel database, dan eksekusi migrasi. |
| ⚙️ **Back-End** | `src/features/*/actions.ts` | **Server Actions**: Menjalankan transaksi keuangan atomik (`prisma.$transaction`), update saldo, dan sanitasi input. |
| ⚙️ **Back-End** | `src/app/api/*` | API Routes untuk upload berkas dan OCR Vision. |
| ⚙️ **Back-End** | `src/features/transactions/lib/*` | Parsing mutasi CSV, ekspor CSV UTF-8 BOM, dan isolasi cetak dokumen A4. |
| 🔄 **Shared** | `src/features/*/schema.ts` | **Validasi Ganda (Single Source of Truth)**: Memastikan data valid di sisi browser sebelum submit, dan memverifikasi ulang di server sebelum masuk DB. |
| 🔄 **Shared** | `src/lib/currency.ts` | Tipe data TypeScript dan fungsi format mata uang Rupiah (`IDR`). |
