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
├── 🗄️ [BACK-END] Cloud Database & Migrations
│   └── prisma/
│       ├── schema.prisma             # Skema tabel database PostgreSQL (Supabase)
│       └── prisma.config.ts          # Konfigurasi Prisma 7 engine
│
├── 🎨 [FRONT-END] Static Assets & PWA Engine
│   └── public/
│       ├── manifest.json             # Web App Manifest PWA (Standalone, Shortcuts, Icons)
│       ├── sw.js                     # Service Worker (Stale-While-Revalidate & Network-First Cache)
│       ├── icons/                    # Asset ikon vektor PWA (192px, 512px, maskable, apple)
│       └── uploads/receipts/         # Direktori penyimpanan foto struk belanja
│
└── src/
    │
    ├── 🖥️ [FRONT-END] View & UI Components Layer
    │   ├── app/
    │   │   ├── layout.tsx            # Root HTML, PWA Metadata, Viewport & Theme Provider
    │   │   ├── (auth)/               # Halaman Login & Register (Google OAuth & Email Form)
    │   │   └── (dashboard)/          # Halaman Dashboard, Transaksi, Rekening, Target, Analitik, Pengaturan
    │   │
    │   ├── components/ui/            # Komponen Atomik UI (Button, Dialog, Input, Card)
    │   ├── components/layout/        # Navigasi (Sidebar, Header, Mobile Bottom Nav 6-item)
    │   ├── components/pwa/           # Komponen PWA & Offline:
    │   │   ├── pwa-register.tsx      # Registrasi Service Worker di browser
    │   │   ├── pwa-install-banner.tsx # Floating Banner Pasang Aplikasi (HP & PC/Laptop)
    │   │   ├── offline-indicator-banner.tsx # Floating status banner saat offline & pending sync
    │   │   └── offline-queue-modal.tsx  # Modal peninjauan antrean transaksi lokal HP
    │   │
    │   ├── context/                  # Global React Context:
    │   │   ├── privacy-context.tsx   # Global Sensor Privasi Saldo (••••)
    │   │   └── offline-context.tsx   # Global Offline State & Auto-Sync Dispatcher
    │   │
    │   └── features/*/components/    # Komponen Interaktif per Fitur:
    │       ├── accounts/components/  # Modal Tambah Rekening, Transfer Card
    │       ├── transactions/components/ # Form Input Cepat, List Filter, ExportStatementModal
    │       ├── ocr/components/       # Modal Scanner Struk dengan Animasi Laser
    │       ├── goals/components/     # Progress Bar Target Tabungan Mandiri
    │       ├── dashboard/components/ # Bento Metrics, Cashflow & Category Donut Charts
    │       ├── analytics/components/ # Health Score, Safe-to-Spend Dial, AI Suggestion
    │       └── settings/components/  # Profile Editor, Budget Sliders, Custom Categories, PWA Card
    │
    ├── ⚙️ [BACK-END] Business Logic & API Layer
    │   ├── app/api/                  # REST API Endpoints:
    │   │   ├── auth/[...nextauth]/   # Handler sesi autentikasi NextAuth (Google & Credentials)
    │   │   ├── health/               # Endpoint Health Check Database Supabase
    │   │   └── ocr/receipt/          # Endpoint integrasi AI Gemini Vision
    │   │
    │   ├── features/*/actions.ts     # Server Actions (Mutasi DB Paralel, Saldo atomik, Otorisasi):
    │   │   ├── accounts/actions.ts   # CRUD Rekening & Transfer Saldo (Parallel Batch)
    │   │   ├── transactions/actions.ts # CRUD Transaksi & Mutasi Saldo (Parallel Batch)
    │   │   ├── goals/actions.ts      # CRUD Target Tabungan & Alokasi (Parallel Batch)
    │   │   ├── dashboard/actions.ts  # Analytics Batch Query (Promise.all)
    │   │   └── settings/actions.ts   # Profil & Kategori Custom
    │   │
    │   ├── features/transactions/lib/
    │   │   ├── csv-parser.ts         # Parser mutasi bank Indonesia (BCA, Mandiri, BRI, Jago)
    │   │   ├── export-csv.ts         # Utility ekspor CSV dengan UTF-8 BOM
    │   │   └── print-statement.ts    # Isolated A4 print engine berstandar perbankan
    │   │
    │   └── lib/                      # Core Server & Offline Utilities:
    │       ├── prisma.ts             # Prisma Client singleton dengan adapter @prisma/adapter-pg
    │       ├── auth.ts               # Konfigurasi NextAuth (Google Provider & Credentials)
    │       └── offline-queue.ts      # Client-side Offline Transaction Storage & Sync Engine
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
| 🖥️ **Front-End** | `src/components/pwa/*` | PWA Lifecycle, install prompt multi-device, dan modal antrean transaksi offline. |
| 🖥️ **Front-End** | `src/features/*/components/*` | Komponen spesifik fitur (Kamera scanner, modal transfer, kartu target, export modal). |
| ⚙️ **Back-End** | `prisma/*` | Struktur relasi data, tabel database PostgreSQL, dan migrasi Supabase. |
| ⚙️ **Back-End** | `src/features/*/actions.ts` | **Server Actions**: Menjalankan transaksi keuangan atomik (`prisma.$transaction`), mutasi paralel, dan sanitasi input. |
| ⚙️ **Back-End** | `src/app/api/*` | API Routes untuk sesi NextAuth, Health Check, dan OCR Vision. |
| ⚙️ **Back-End** | `src/lib/offline-queue.ts` | Client-Side Offline Storage, serialization, dan auto-sync event handler. |
| ⚙️ **Back-End** | `src/features/transactions/lib/*` | Parsing mutasi CSV, ekspor CSV UTF-8 BOM, dan isolasi cetak dokumen A4. |
| 🔄 **Shared** | `src/features/*/schema.ts` | **Validasi Ganda (Single Source of Truth)**: Memastikan data valid di sisi browser sebelum submit, dan memverifikasi ulang di server sebelum masuk DB. |
| 🔄 **Shared** | `src/lib/currency.ts` | Tipe data TypeScript dan fungsi format mata uang Rupiah (`IDR`). |
