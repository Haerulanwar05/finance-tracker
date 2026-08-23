# 🎨 UI/UX Design System & Experience Specification
## Personal Finance, Multi-Asset & Goal Tracker
*Generated via `ui-ux-pro-max` Design Intelligence*

---

## 1. Visual Theme & Personality
* **Design Philosophy**: *High-Trust Modern Fintech* (Kombinasi estetika **Bento Grid** bergaya Linear/Mercury dengan sentuhan halus **Glassmorphism**).
* **Target Feeling**: Profesional, bersih, presisi finansial, aman, dan intuitif digunakan dalam 1 tangan di layar smartphone.

---

## 2. Color Palette & Design Tokens

```mermaid
pie title Distribusi Warna Visual Antarmuka
    "Background & Surface (Slate/Zinc 900-950)" : 60
    "Card Container & Borders (Zinc 800)" : 20
    "Neutral Content & Text (Zinc 100-400)" : 10
    "Accent Colors (Emerald, Indigo, Rose)" : 10
```

| Token Role | Hex Code | Tailwind Class | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#09090B` | `bg-zinc-950` | Latar belakang utama dashboard. |
| **Card Surface** | `#18181B` / 80% | `bg-zinc-900/80 backdrop-blur-md` | Kartu statistik, modal, dan container widget. |
| **Card Border** | `#27272A` | `border-zinc-800` | Garis batas kartu (1px solid). |
| **Income / Net Worth** | `#10B981` | `text-emerald-500 bg-emerald-500/10` | Pemasukan, pertumbuhan saldo positif, indikator aman. |
| **Expense / Alert** | `#F43F5E` | `text-rose-500 bg-rose-500/10` | Pengeluaran, peringatan batas budget, saldo defisit. |
| **Primary Accent / Goals** | `#3B82F6` | `text-blue-500 bg-blue-500/10` | Tombol aksi utama (CTA), kantung target tabungan. |
| **Transfer / Neutral** | `#A855F7` | `text-purple-500 bg-purple-500/10` | Mutasi transfer antar-rekening/dompet. |
| **Text Primary** | `#F4F4F5` | `text-zinc-100` | Judul, nominal saldo utama. |
| **Text Muted** | `#A1A1AA` | `text-zinc-400` | Label tanggal, kategori sekunder, placeholder. |

---

## 3. Typography & Financial Number Formatting

* **Font Family**: `Inter` / `Geist Sans` (Google Fonts) untuk teks antarmuka yang bersih dan terbaca jelas.
* **Tabular Figures (`font-mono` / `tabular-nums`)**:
  * Seluruh angka nominal uang wajib menggunakan style `tabular-nums` agar lebar karakter angka `1` dan `8` sama persis, mencegah pergeseran layout pada tabel riwayat transaksi.
* **Format Mata Uang Standar**:
  ```text
  Rp 1.250.000,00  ->  Nominal lengkap
  Rp 1,25 Jt       ->  Format ringkas di widget chart / mobile badge
  ```

---

## 4. Key UI Components & Layout Blueprint

### 4.1. Dashboard Bento-Grid (Desktop & Mobile)
1. **Hero Net Worth Card**:
   * Menampilkan total akumulasi kekayaan bersih dari seluruh akun.
   * Dilengkapi tombol **Sensor Saldo (Eye Icon)** untuk menyembunyikan nominal (`Rp ••••••••`) saat membuka aplikasi di tempat umum.
   * Indikator delta bulanan (*+12.4% vs bulan lalu*).
2. **Interactive Wallet / Account Carousel**:
   * Kartu virtual bank/e-wallet dengan gradient khas (misal: BCA Navy, GoPay Cyan, Cash Amber).
   * Menampilkan saldo masing-masing akun dan tombol cepat *Transfer*.
3. **Smart Receipt Scanner Zone**:
   * Area drag-and-drop / tombol kamera dengan animasi garis laser scanner interaktif saat AI Vision sedang membaca struk.
4. **Goal Vaults Progress Cards**:
   * Kartu kantung tabungan dengan progress ring/bar melingkar, persentase tercapai, dan estimasi waktu (*"3 bulan lagi tercapai"*).
5. **Recent Transactions Feed**:
   * List transaksi dengan ikon kategori otomatis, badge akun sumber, dan warna pembeda (Hijau untuk pemasukan, Merah untuk pengeluaran, Ungu untuk transfer).

---

## 5. Micro-Interactions & Haptic UX Delight

1. **Number Rolling Counter**:
   * Saat transaksi baru disimpan, nominal saldo total berputar (*rolling animation*) naik/turun secara halus selama 300ms.
2. **Live OCR Bounding Preview**:
   * Saat foto struk di-upload, kotak highlight muncul di atas gambar menunjukkan bagian total dan tanggal yang berhasil dikenali oleh AI.
3. **Empty States with Character**:
   * Halaman transaksi kosong dihiasi ilustrasi minimalis dan tombol ajakan *"Catat transaksi pertamamu atau scan struk belanja"*.
4. **Skeleton Loading Screens**:
   * Shimmer loading abu-abu gelap dengan ukuran persis kartu yang akan dimuat untuk menghindari *Content Layout Shift (CLS)*.

---

## 6. Pre-Delivery UX & Accessibility Checklist (WCAG AA)

- [ ] **Contrast Ratio**: Rasio kontras teks ke latar belakang minimal 4.5:1 untuk teks normal dan 3:1 untuk judul tebal.
- [ ] **Touch Target**: Semua tombol aksi di mobile memiliki ukuran area sentuh minimal **44x44px**.
- [ ] **Color Accessibility**: Informasi keuangan tidak hanya mengandalkan warna hijau/merah, tetapi selalu disertai simbol `+` atau `-` dan ikon panah.
- [ ] **Keyboard Navigation**: Modal form dapat ditutup dengan tombol `Escape` dan navigasi field form dapat menggunakan tombol `Tab`.
