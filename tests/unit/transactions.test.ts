import { describe, it, expect } from "vitest";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@/features/transactions/schema";
import { parseBankCsv } from "@/features/transactions/lib/csv-parser";

describe("Fase 3: Transactions & Bank CSV Parser Test Suite", () => {
  // ----------------------------------------------------
  // 1. Transaction Schemas Validation
  // ----------------------------------------------------
  describe("1. Transaction Schemas Validation", () => {
    it("validates compliant EXPENSE transaction", () => {
      const valid = createTransactionSchema.safeParse({
        accountId: "acc-bca",
        categoryId: "cat-food",
        type: "EXPENSE",
        amount: 45000,
        date: new Date(),
        description: "Makan siang ayam geprek",
      });
      expect(valid.success).toBe(true);
    });

    it("validates compliant INCOME transaction", () => {
      const valid = createTransactionSchema.safeParse({
        accountId: "acc-mandiri",
        categoryId: "cat-salary",
        type: "INCOME",
        amount: 15000000,
        date: new Date(),
        description: "Gaji bulanan",
      });
      expect(valid.success).toBe(true);
    });

    it("validates compliant TRANSFER transaction with distinct targetAccount", () => {
      const valid = createTransactionSchema.safeParse({
        accountId: "acc-bca",
        targetAccountId: "acc-gopay",
        type: "TRANSFER",
        amount: 200000,
        description: "Topup Gopay",
      });
      expect(valid.success).toBe(true);
    });

    it("rejects TRANSFER where source === target", () => {
      const invalid = createTransactionSchema.safeParse({
        accountId: "acc-bca",
        targetAccountId: "acc-bca",
        type: "TRANSFER",
        amount: 100000,
      });
      expect(invalid.success).toBe(false);
      if (!invalid.success) {
        expect(invalid.error.flatten().fieldErrors.targetAccountId).toBeDefined();
      }
    });

    it("rejects EXPENSE or INCOME without categoryId", () => {
      const invalid = createTransactionSchema.safeParse({
        accountId: "acc-bca",
        type: "EXPENSE",
        amount: 50000,
      });
      expect(invalid.success).toBe(false);
      if (!invalid.success) {
        expect(invalid.error.flatten().fieldErrors.categoryId).toBeDefined();
      }
    });

    it("rejects negative or zero amount", () => {
      const zero = createTransactionSchema.safeParse({
        accountId: "acc-bca",
        categoryId: "cat-1",
        type: "EXPENSE",
        amount: 0,
      });
      expect(zero.success).toBe(false);

      const negative = createTransactionSchema.safeParse({
        accountId: "acc-bca",
        categoryId: "cat-1",
        type: "EXPENSE",
        amount: -50000,
      });
      expect(negative.success).toBe(false);
    });

    it("validates updateTransactionSchema", () => {
      const valid = updateTransactionSchema.safeParse({
        id: "tx-123",
        accountId: "acc-bca",
        categoryId: "cat-food",
        type: "EXPENSE",
        amount: 65000,
        date: new Date(),
        description: "Update makan siang",
      });
      expect(valid.success).toBe(true);
    });
  });

  // ----------------------------------------------------
  // 2. Universal Bank CSV Mutation Parser
  // ----------------------------------------------------
  describe("2. Universal Bank CSV Mutation Parser", () => {
    it("parses BCA-style CSV with DB/CR indicators and dot-separated amounts", () => {
      const bcaCsv = `Tanggal,Keterangan,Jumlah,Tipe
23/08/2026,Kopi Kenangan Senopati,35.000,DB
22/08/2026,TRANSFER DARI PT KREASI TEKNO,5.000.000,CR
21/08/2026,SPBU Pertamina Kuningan,150.000,DB`;

      const result = parseBankCsv(bcaCsv);
      expect(result.success).toBe(true);
      expect(result.rows).toHaveLength(3);

      // Row 1: Expense
      expect(result.rows[0].description).toBe("Kopi Kenangan Senopati");
      expect(result.rows[0].amount).toBe(35000);
      expect(result.rows[0].type).toBe("EXPENSE");
      expect(result.rows[0].suggestedCategoryId).toBe("Makanan & Minuman");

      // Row 2: Income
      expect(result.rows[1].description).toBe("TRANSFER DARI PT KREASI TEKNO");
      expect(result.rows[1].amount).toBe(5000000);
      expect(result.rows[1].type).toBe("INCOME");
      expect(result.rows[1].suggestedCategoryId).toBe("Gaji & Penghasilan");

      // Row 3: Expense Fuel
      expect(result.rows[2].description).toBe("SPBU Pertamina Kuningan");
      expect(result.rows[2].amount).toBe(150000);
      expect(result.rows[2].type).toBe("EXPENSE");
      expect(result.rows[2].suggestedCategoryId).toBe("Transportasi & Bensin");

      // Totals
      expect(result.totalExpense).toBe(185000);
      expect(result.totalIncome).toBe(5000000);
    });

    it("parses Bank CSV with separate DEBET and KREDIT columns", () => {
      const separateDebitCreditCsv = `Tanggal,Keterangan,Debet,Kredit
2026-08-20,Beli Tiket Kereta KAI,150000,0
2026-08-19,Gaji Karyawan,0,12000000`;

      const result = parseBankCsv(separateDebitCreditCsv);
      expect(result.success).toBe(true);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0].amount).toBe(150000);
      expect(result.rows[0].type).toBe("EXPENSE");
      expect(result.rows[1].amount).toBe(12000000);
      expect(result.rows[1].type).toBe("INCOME");
    });

    it("parses rearranged Excel columns with UTF-8 BOM", () => {
      const excelCsv = `\uFEFFNo,Tanggal,Kategori,Keterangan,Nominal,Tipe
1,23/08/2026,Food,"Makan Siang, Resto Padang",55.000,PENGELUARAN
2,22/08/2026,Income,Bonus Project Freelance,2.500.000,PEMASUKAN`;

      const result = parseBankCsv(excelCsv);
      expect(result.success).toBe(true);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0].description).toBe("Makan Siang, Resto Padang");
      expect(result.rows[0].amount).toBe(55000);
      expect(result.rows[0].type).toBe("EXPENSE");
      expect(result.rows[1].amount).toBe(2500000);
      expect(result.rows[1].type).toBe("INCOME");
    });

    it("parses BNI Business Account CSV with Sales Revenue as INCOME", () => {
      const bniBusinessCsv = `Tanggal,Keterangan,Nominal
23/08/2026,Hasil Penjualan Toko Online,3.750.000
22/08/2026,Setoran Tunai Omset Merchant QRIS BNI,1.250.000
21/08/2026,Beli Stok Bahan Baku dari Suplier,850.000`;

      const result = parseBankCsv(bniBusinessCsv);
      expect(result.success).toBe(true);
      expect(result.rows).toHaveLength(3);

      // Row 1: Hasil Penjualan -> INCOME
      expect(result.rows[0].description).toBe("Hasil Penjualan Toko Online");
      expect(result.rows[0].amount).toBe(3750000);
      expect(result.rows[0].type).toBe("INCOME");
      expect(result.rows[0].suggestedCategoryId).toBe("Bisnis & Penjualan");

      // Row 2: Omset QRIS BNI -> INCOME
      expect(result.rows[1].description).toBe("Setoran Tunai Omset Merchant QRIS BNI");
      expect(result.rows[1].amount).toBe(1250000);
      expect(result.rows[1].type).toBe("INCOME");
      expect(result.rows[1].suggestedCategoryId).toBe("Bisnis & Penjualan");

      // Row 3: Beli Stok -> EXPENSE
      expect(result.rows[2].description).toBe("Beli Stok Bahan Baku dari Suplier");
      expect(result.rows[2].amount).toBe(850000);
      expect(result.rows[2].type).toBe("EXPENSE");
    });

    it("gracefully handles empty CSV", () => {
      const emptyResult = parseBankCsv("");
      expect(emptyResult.success).toBe(false);
      expect(emptyResult.rows).toHaveLength(0);
    });
  });
});
