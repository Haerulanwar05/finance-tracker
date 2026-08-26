# 🎨 UI/UX Design System & Experience Specification
## Personal Finance, Multi-Asset & Goal Tracker
*Generated via `ui-ux-pro-max` Design Intelligence*

---

## 1. Visual Theme & Personality: "Obsidian Sovereign"
* **Design Philosophy**: **"Obsidian Sovereign" — Kinetic Swiss Fintech & High-Craft Editorial Banking**.
* **Anti-AI Slop Mandate**: Menghilangkan seluruh trope template AI generik (tidak ada lagi font generic korporat, tidak ada gradien ungu-biru seragam `from-blue-600 to-indigo-600`, tidak ada blob blur bulat raksasa acak, dan tidak ada card datar tak bernyawa).
* **Target Feeling**: Kemewahan perbankan privat Swiss, ketegasan garis *hairline lighting* (specular borders), bobot fisik nyata (*tactile depth*), dan ritme angka monospaced presisi.
* **Natural Language**: Bahasa Indonesia profesional dan ramah perbankan modern: *Target Tabungan Mandiri*, *Rekening & Dompet Digital*, *Buku Mutasi Transaksi*, *Batas Belanja Aman (Safe-to-Spend)*, serta pesan offline yang universal di seluruh perangkat.

---

## 2. Color Palette & Design Tokens

| Token Role | Hex Code / Value | Tailwind Class / Style | Karakter & Kegunaan |
| :--- | :--- | :--- | :--- |
| **Obsidian Canvas** | `#08080A` | `bg-[#08080a]` | Latar belakang dasar arsitektural dengan subtle top vignette. |
| **Panel Surface** | `#0C0C0F` / `#121215` | `bg-gradient-to-b from-zinc-900/85 via-zinc-900/50 to-zinc-950/90` | Panel kartu triple-layer dengan ambient glass blur 24px. |
| **Specular Micro-Border** | `rgba(255,255,255,0.08)` | `border-white/[0.08]` | Garis batas mikro presisi dengan pantulan cahaya atas. |
| **Specular Top Bevel** | `rgba(255,255,255,0.08)` | `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]` | Efek tepi bevel atas yang menangkap pencahayaan zenith. |
| **Tactile Silver-White (Primary)** | `#FFFFFF` / Silver | `bg-white text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]` | Tombol primer berbobot fisik dengan kontras tajam. |
| **Sovereign Emerald (CTA / Income)** | `#10B981` | `bg-emerald-500 text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]` | Tombol aksi positif, pemasukan, pertumbuhan saldo, safe state. |
| **Obsidian Glass (Secondary)** | Semi-transparent | `bg-white/[0.05] border-white/[0.08] hover:bg-white/[0.08]` | Tombol sekunder bertepi kaca gelap. |
| **Alert / Expense** | `#F43F5E` | `text-rose-400 bg-rose-500/10 border-rose-500/25` | Pengeluaran kas, batas kritis anggaran, tombol hapus. |
| **Transfer / Vault** | `#8B5CF6` | `text-violet-400 bg-violet-500/10 border-violet-500/25` | Mutasi antar-rekening dan tabungan impian. |
| **Text Primary** | `#FFFFFF` | `text-white font-medium` | Judul, nominal angka kekayaan utama. |
| **Micro-Labels Muted** | `#A1A1AA` | `text-[10px] uppercase tracking-[0.14em] font-semibold text-zinc-400` | Sub-label kategori, status badge, dan keterangan kolom. |

---

## 3. Typography & Financial Number Formatting

* **Font Family**: `Geist Sans` & `Geist Mono` untuk teks antarmuka yang bersih dan terbaca tajam.
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
2. **Interactive Wallet / Account Cards**:
   * Kartu virtual bank/e-wallet dengan aksen warna khas (BCA Navy, Mandiri Blue, GoPay Cyan, Cash Amber).
   * Menampilkan saldo masing-masing akun dan tombol cepat *Transfer Dana*.
3. **Smart Receipt Scanner Zone**:
   * Area drag-and-drop / tombol kamera dengan animasi garis laser scanner interaktif saat AI Vision sedang membaca struk.
4. **Target Tabungan Mandiri Progress Cards**:
   * Kartu target tabungan dengan progress bar, persentase tercapai, dan estimasi waktu (*Smart Pace Indicator*).
5. **Recent Transactions Feed**:
   * List transaksi dengan filter rentang waktu (Bulan Ini, Bulan Lalu, 3 Bulan, Tahun Ini, Kustom Kalender) dan modal ekspor laporan keuangan.

### 4.2. Animated Luxury Dollar Bag Brand Logo
* **Vektor Murni & Scoped SVG IDs**: Menjamin logo kantong uang emas-zamrud (`$`) selalu tampil tajam 100% tanpa distorsi gradien di browser Android, iOS Safari, maupun Desktop.
* **Micro-Interactions**: Animasi melayang lembut (*floating bobbing*) dengan aksen kilau berkilap (*golden shimmer*) di sudut kanan atas.
* **Routing Cerdas**: Mengklik logo mengarahkan pengguna yang sudah login ke `/dashboard` (Overview) dan pengguna tamu/login ke `/` (Landing Page).

### 4.3. Minimalist "Batas Belanja Bulanan" Bento Card
* **Simetris & Rapi**: Menyelaraskan tata letak kartu anggaran dengan kartu Net Worth, Pemasukan, dan Pengeluaran.
* **Slim Gradient Progress Bar (6px)**: Gradien halus *Indigo to Cyan* menggantikan inset gelap lama untuk visualisasi sisa anggaran yang elegan.
* **Pulsating Status Badge**: Indikator lampu berdenyut halus (*Batas Aman*, *Waspada*, *Batas Kritis*) yang memberikan sinyal visual instan.
* **Interactive Surface**: Seluruh permukaan kartu dapat diklik untuk membuka modal pengaturan batas belanja bulanan dan rekomendasi belanja harian.

### 4.4. PWA Installation & Multi-Device Floating Banner
* **Multi-Device Visual Badge**: Badge *"Semua Perangkat"* berlatar emerald dengan ikon download instan.
* **Universal & Natural Copywriting**: Bahasa Indonesia lugas dan ramah yang menekankan kemudahan akses kilat 1-klik di seluruh perangkat serta jaminan pencatatan transaksi tanpa koneksi internet.
* **Smart Device Detection**: Membuka *Native Android Install Prompt* atau menampilkan panduan visual interaktif untuk *iOS Safari* dan *Desktop Chrome/Edge* (termasuk generator shortcut `.url`).

### 4.5. Universal Offline State & Queue Indicators
* **Mode Offline Banner**: Indikator mengambang di atas layar saat koneksi terputus: *"Mode Offline — Transaksi tersimpan aman di perangkat ini"*.
* **Pending Queue Floating Pill**: Pill mengambang di sudut kiri bawah saat terdapat transaksi belum tersinkron dengan tombol pintas *"Lihat Antrean"* dan status *"Transaksi tersimpan di perangkat ini & siap disinkronkan saat online."*.
* **Auto-Dismiss Sync Toast**: Notifikasi hijau halus yang muncul otomatis dan menghilang dalam 4 detik begitu sinkronisasi background selesai.

### 4.6. Mobile Ergonomics (Thumb-Zone Navigation)
* **Bottom Navigation Bar 6-Item**: Memuat item *Overview, Transaksi, Analitik, Target, Rekening, dan Pengaturan* dengan ukuran target sentuh nyaman.
* **Safe Area Spacing (`pb-24`)**: Memastikan konten paling bawah tidak tertutup oleh bilah navigasi melayang.
* **Header Quick Gear Action**: Tombol jalan pintas pengaturan di samping sensor privasi saldo.

### 4.7. Fast Interaction, Instant Modal Dismiss & Balance Sorting Controls
* **Instant Modal Dismissal**: Modal transaksi dan transfer tertutup seketika (< 50ms) setelah penekanan tombol simpan/update, menghilangkan rasa "layar membeku" selama proses mutasi database.
* **Non-Blocking Concurrent Refresh**: Pembaruan angka Net Worth dan mutasi saldo di layar menggunakan `React.startTransition`, menjaga kelancaran animasi 60 FPS tanpa jeda freeze.
* **Interactive Balance Sorting Controls**: Tombol *Tertinggi (Descending)* dan *Terendah (Ascending)* dengan highlight aktif beraksen zamrud (*emerald glow*) serta tombol reset sekali klik.

### 4.8. Sub-50ms Instant Optimistic Navigation & Streaming Skeletons
* **Instant Optimistic Active State**: Titik emerald bercahaya (`bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]`), border specular, dan teks putih tebal berpindah secara instan (0ms) begitu tautan disentuh atau diklik tanpa menunggu respon jaringan server.
* **Hairline Shimmer Top Progress Bar**: Garis tipis 2.5px di puncak layar dengan gradien zamrud (*emerald-to-teal*) dan animasi shimmer horizontal (`animate-nav-shimmer`) yang aktif otomatis selama transisi navigasi.
* **Obsidian-Themed Segment Skeletons (`loading.tsx`)**: Setiap segmen rute memiliki kerangka skeleton gelap khusus (`bg-zinc-900/60`, `border-white/[0.06]`) dengan denyut lembut (*pulse*) yang segera menggantikan konten saat koneksi internet lambat, mencegah layar kosong atau tampilan beku.

---

## 5. Print Design System (A4 Executive Statement)

Untuk keperluan pencetakan PDF dan fisik, sistem menggunakan **Isolated Print Rendering**:
* **Latar Belakang Murni Putih (`#FFFFFF`)**: Menghilangkan efek gelap aplikasi secara 100%.
* **Tipografi Kontras Tinggi (*High-Contrast Charcoal `#0F172A`*)**: Garis tepi tegas (`1.5px solid #CBD5E1`) yang tetap terbaca jelas meskipun fitur *Background Graphics* printer dimatikan.
* **Top-Aligned Flow**: Konten langsung dimulai pada titik $(0, 0)$ teratas kertas A4 tanpa pergeseran vertikal (*offset*).
* **Smart Page-Break Rules**: Menjaga agar baris transaksi tidak terbelah di tengah halaman (`page-break-inside: avoid`).

---

## 6. Pre-Delivery UX & Accessibility Checklist (WCAG AA)

- [x] **Contrast Ratio**: Rasio kontras teks ke latar belakang $\ge$ 4.5:1 untuk teks normal dan 3:1 untuk judul tebal.
- [x] **Touch Target**: Semua tombol aksi di mobile memiliki ukuran area sentuh minimal **44x44px**.
- [x] **Color Accessibility**: Informasi keuangan tidak hanya mengandalkan warna hijau/merah, tetapi selalu disertai simbol `+` atau `-` dan ikon panah.
- [x] **Keyboard Navigation**: Modal form dapat ditutup dengan tombol `Escape` dan navigasi field form dapat menggunakan tombol `Tab`.
- [x] **PWA Standalone Compliance**: Lolos audit PWA Lighthouse dengan Web App Manifest lengkap, ikon maskable, dan Service Worker caching.
