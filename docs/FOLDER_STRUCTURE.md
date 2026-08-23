# 📁 Project Folder Structure & Clean Architecture
## Next.js 14/15 App Router Layout

---

## 1. Architectural Philosophy
Struktur direktori dirancang mengikuti prinsip **Modular Domain-Driven Design (DDD)** dan **Clean Layered Architecture** pada ekosistem Next.js App Router:
* **Separation of Concerns**: Memisahkan antarmuka (UI), logika bisnis (Server Actions / Services), akses data (Prisma DAL), dan validasi skema (Zod).
* **Colocation**: Komponen UI khusus diletakkan dekat dengan modul fiturnya.
* **Server-First**: Memaksimalkan React Server Components (RSC) untuk keamanan data dan kecepatan render.

---

## 2. Pemisahan Layer: Front-End vs Back-End

Berikut adalah pemetaan tugas dan batas arsitektur antara **Front-End (UI/Client)** dan **Back-End (Server/Data/Business Logic)**:

```text
finance-tracker/
│
├── 🗄️ [BACK-END] Database & Migrations
│   └── prisma/
│       ├── schema.prisma             # Skema tabel database PostgreSQL
│       ├── seed.ts                   # Seeder data awal (kategori default)
│       └── migrations/               # Riwayat migrasi SQL
│
├── 🎨 [FRONT-END] Static Assets
│   └── public/
│       ├── icons/                    # Asset gambar & ikon statis
│       └── uploads/                  # File foto struk
│
└── src/
    │
    ├── 🖥️ [FRONT-END] View & UI Components Layer
    │   ├── app/
    │   │   ├── layout.tsx            # Root HTML, Fonts & Theme Provider
    │   │   ├── (auth)/               # Halaman Login & Register
    │   │   └── (dashboard)/          # Halaman Dashboard, Transaksi, Akun, Kantung, Analitik
    │   │
    │   ├── components/ui/            # Komponen Atomik UI (Button, Dialog, Input, Card)
    │   ├── components/layout/        # Navigasi (Sidebar, Header, Mobile Bottom Nav)
    │   ├── components/shared/        # Widget UI (StatCard, MoneyDisplay, ChartWrapper)
    │   │
    │   └── features/*/components/    # Komponen Interaktif per Fitur:
    │       ├── accounts/components/  # Modal Tambah Akun, Transfer Card
    │       ├── transactions/components/ # Form Input Cepat, List Filter
    │       ├── ocr/components/       # Modal Kamera Scanner Struk
    │       └── vaults/components/    # Progress Bar Kantung Tabungan
    │
    ├── ⚙️ [BACK-END] Business Logic & API Layer
    │   ├── app/api/                  # REST API Endpoints:
    │   │   ├── auth/[...nextauth]/   # Handler sesi autentikasi NextAuth
    │   │   ├── ocr/receipt/          # Endpoint integrasi AI Gemini Vision
    │   │   └── import/csv/           # Endpoint parser file mutasi bank
    │   │
    │   ├── features/*/actions.ts     # Server Actions (Mutasi DB, Saldo atomik, Otorisasi)
    │   ├── features/ocr/service.ts   # Service AI OCR & prompt engineering
    │   ├── features/analytics/service.ts # Service kalkulasi agregasi Net Worth & Cashflow
    │   │
    │   └── lib/                      # Core Server Utilities:
    │       ├── prisma.ts             # Prisma Client instance (Database Connection)
    │       └── auth.ts               # Konfigurasi NextAuth & Session Provider
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
| 🖥️ **Front-End** | `src/app/(dashboard)/*` | Menampilkan antarmuka pengguna, menangani state form, filter, dan transisi UI. |
| 🖥️ **Front-End** | `src/components/*` | Komponen visual yang dapat digunakan kembali (Design System). |
| 🖥️ **Front-End** | `src/features/*/components/*` | Komponen spesifik fitur (Kamera scanner, modal transfer, kartu saldo). |
| ⚙️ **Back-End** | `prisma/*` | Struktur relasi data, tabel PostgreSQL, dan eksekusi migrasi database. |
| ⚙️ **Back-End** | `src/features/*/actions.ts` | **Server Actions**: Menjalankan transaksi keuangan atomik (`prisma.$transaction`), update saldo, dan sanitasi input. |
| ⚙️ **Back-End** | `src/app/api/*` | API Routes untuk upload berkas, parsing mutasi CSV, dan webhook. |
| ⚙️ **Back-End** | `src/features/ocr/service.ts` | Integrasi ke Google Gemini Vision API untuk ekstraksi data struk. |
| 🔄 **Shared** | `src/features/*/schema.ts` | **Validasi Ganda (Single Source of Truth)**: Memastikan data valid di sisi browser sebelum submit, dan memverifikasi ulang di server sebelum masuk DB. |
| 🔄 **Shared** | `src/types/*` & `src/lib/currency.ts` | Tipe data TypeScript dan fungsi format mata uang Rupiah (`IDR`). |

1. **`src/app/(dashboard)/*`**: Bertindak sebagai *View Layer*. Mengambil data langsung di server (RSC) dan mengoper props ke komponen fitur.
2. **`src/features/*/actions.ts`**: Menangani logika bisnis, validasi input pengguna via Zod, dan mengeksekusi operasi database Prisma di dalam `$transaction`.
3. **`src/features/ocr/service.ts`**: Mengisolasi integrasi pihak ketiga (Google Gemini API) sehingga jika di kemudian hari ingin berganti model AI, modul lain tidak terpengaruh.
4. **`src/components/ui/`**: Kumpulan komponen atomik independen yang dapat dipakai ulang di seluruh aplikasi.
