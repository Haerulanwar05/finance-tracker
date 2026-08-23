# 🗄️ Database Design & Schema Specification
## PostgreSQL + Prisma ORM

---

## 1. Entity Relationship Overview

Berikut adalah diagram relasi entitas antar tabel di database:

```mermaid
erDiagram
    User ||--o{ Account : "owns"
    User ||--o{ Category : "owns"
    User ||--o{ Transaction : "records"
    User ||--o{ GoalVault : "manages"
    User ||--o{ Budget : "sets"
    
    Account ||--o{ Transaction : "source_account"
    Account ||--o{ Transaction : "target_account"
    Account ||--o{ GoalVault : "linked_account"
    
    Category ||--o{ Transaction : "categorizes"
    Category ||--o{ Budget : "budgeted_for"
    
    GoalVault ||--o{ VaultAllocation : "allocations"
    Transaction ||--o{ VaultAllocation : "linked_tx"
```

---

## 2. Complete Prisma Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ----------------------------------------------------
// 1. User & Authentication
// ----------------------------------------------------
model User {
  id            String         @id @default(cuid())
  name          String?
  email         String         @unique
  emailVerified DateTime?
  passwordHash  String?
  image         String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  accounts      Account[]
  categories    Category[]
  transactions  Transaction[]
  goalVaults    GoalVault[]
  budgets       Budget[]

  @@map("users")
}

// ----------------------------------------------------
// 2. Accounts / Dompet & Rekening Aset
// ----------------------------------------------------
enum AccountType {
  BANK          // Rekening Bank (BCA, Mandiri, dll.)
  EWALLET       // E-Wallet (GoPay, OVO, ShopeePay, DANA)
  CASH          // Dompet Fisik / Uang Tunai
  INVESTMENT    // Reksadana, Emas, Saham, Deposito
  CREDIT_CARD   // Kartu Kredit / Paylater
}

model Account {
  id              String         @id @default(cuid())
  userId          String
  name            String         // misal: "BCA Tahapan", "GoPay Utama"
  type            AccountType    @default(BANK)
  balance         Decimal        @default(0) @db.Decimal(15, 2)
  currency        String         @default("IDR")
  color           String?        // Hex code untuk visual badge (#0052CC)
  icon            String?        // Identifier icon (landmark, wallet, coins)
  accountNumber   String?        // 4 digit terakhir (opsional)
  isArchived      Boolean        @default(false)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  outTransactions Transaction[]  @relation("SourceAccount")
  inTransactions  Transaction[]  @relation("TargetAccount")
  linkedVaults    GoalVault[]    @relation("LinkedAccount")

  @@index([userId])
  @@map("accounts")
}

// ----------------------------------------------------
// 3. Categories (Pemasukan & Pengeluaran)
// ----------------------------------------------------
enum CategoryType {
  EXPENSE
  INCOME
}

model Category {
  id          String        @id @default(cuid())
  userId      String?       // Null = Default System Category, Non-null = User Custom Category
  name        String        // misal: "Makanan & Minuman", "Gaji", "Transportasi"
  type        CategoryType  @default(EXPENSE)
  icon        String?       // Lucide icon name (utensils, car, briefcase)
  color       String?       // Hex color code
  isDefault   Boolean       @default(false)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  user         User?         @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  budgets      Budget[]

  @@index([userId])
  @@map("categories")
}

// ----------------------------------------------------
// 4. Transactions (Pencatatan Keuangan Harian)
// ----------------------------------------------------
enum TransactionType {
  EXPENSE
  INCOME
  TRANSFER
}

model Transaction {
  id              String            @id @default(cuid())
  userId          String
  accountId       String            // Akun Sumber
  targetAccountId String?           // Khusus TRANSFER (Akun Tujuan)
  categoryId      String?           // Opsional untuk transfer
  type            TransactionType   @default(EXPENSE)
  amount          Decimal           @db.Decimal(15, 2)
  date            DateTime          @default(now())
  description     String?
  receiptUrl      String?           // File foto struk belanja
  rawOcrJson      Json?             // Metadata JSON hasil parse Vision OCR
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  account         Account           @relation("SourceAccount", fields: [accountId], references: [id], onDelete: Cascade)
  targetAccount   Account?          @relation("TargetAccount", fields: [targetAccountId], references: [id], onDelete: SetNull)
  category        Category?         @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  allocations     VaultAllocation[]

  @@index([userId, date])
  @@index([accountId])
  @@index([categoryId])
  @@map("transactions")
}

// ----------------------------------------------------
// 5. Goal Vaults (Kantung Finansial & Target Tabungan)
// ----------------------------------------------------
enum VaultStatus {
  ACTIVE
  ACHIEVED
  PAUSED
}

model GoalVault {
  id              String            @id @default(cuid())
  userId          String
  linkedAccountId String?           // Opsional: Rekening fisik yang memegang uang ini
  name            String            // misal: "Dana Darurat", "Liburan Jepang"
  targetAmount    Decimal           @db.Decimal(15, 2)
  currentAmount   Decimal           @default(0) @db.Decimal(15, 2)
  deadline        DateTime?
  color           String?
  icon            String?
  status          VaultStatus       @default(ACTIVE)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  linkedAccount   Account?          @relation("LinkedAccount", fields: [linkedAccountId], references: [id], onDelete: SetNull)
  allocations     VaultAllocation[]

  @@index([userId])
  @@map("goal_vaults")
}

// ----------------------------------------------------
// 6. Vault Allocations (Riwayat Alokasi Tabungan)
// ----------------------------------------------------
enum AllocationType {
  DEPOSIT   // Masukkan dana ke kantung
  WITHDRAW  // Tarik dana dari kantung
}

model VaultAllocation {
  id            String          @id @default(cuid())
  vaultId       String
  transactionId String?
  amount        Decimal         @db.Decimal(15, 2)
  type          AllocationType  @default(DEPOSIT)
  date          DateTime        @default(now())
  note          String?

  vault         GoalVault       @relation(fields: [vaultId], references: [id], onDelete: Cascade)
  transaction   Transaction?    @relation(fields: [transactionId], references: [id], onDelete: SetNull)

  @@index([vaultId])
  @@map("vault_allocations")
}

// ----------------------------------------------------
// 7. Budgets (Batas Pengeluaran Bulanan)
// ----------------------------------------------------
model Budget {
  id          String    @id @default(cuid())
  userId      String
  categoryId  String
  amount      Decimal   @db.Decimal(15, 2)
  month       Int       // 1-12
  year        Int       // misal: 2026
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category    Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([userId, categoryId, month, year])
  @@map("budgets")
}
```

---

## 3. Indexing & Query Optimization Strategy

1. **Composite Index `[userId, date]`**:
   * Mempercepat filter riwayat transaksi bulanan dan pencarian *cashflow* dashboard tanpa *full-table scan*.
2. **Cascading Deletes vs SetNull**:
   * Menghapus `Account` atau `Category` tidak akan menghapus riwayat `Transaction`, melainkan mengubah relasi menjadi `SetNull` agar pembukuan masa lalu tetap utuh.
3. **Decimal Precision**:
   * Menggunakan `@db.Decimal(15, 2)` menjamin akurasi angka hingga ratusan triliun Rupiah tanpa kehilangan presisi angka desimal.
