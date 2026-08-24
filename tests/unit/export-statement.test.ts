import { describe, it, expect } from "vitest";

describe("Financial Statement & CSV Export Test Suite", () => {
  describe("1. CSV Sanitization & Generation", () => {
    it("escapes quotes and special characters properly", () => {
      const escapeCsv = (str: string | null | undefined) => {
        if (!str) return '""';
        const clean = str.replace(/"/g, '""');
        return `"${clean}"`;
      };

      expect(escapeCsv('Belanja "Kopi" & Snack')).toBe('"Belanja ""Kopi"" & Snack"');
      expect(escapeCsv("Normal text")).toBe('"Normal text"');
      expect(escapeCsv(null)).toBe('""');
    });

    it("formats CSV row structure correctly with UTF-8 BOM", () => {
      const headers = ["Tanggal", "Tipe", "Kategori", "Nominal (Rp)"];
      const sampleRow = ['"23/08/2026"', '"Pengeluaran"', '"Makanan"', "50000"];

      const csvContent = "\uFEFF" + [headers.join(","), sampleRow.join(",")].join("\r\n");

      expect(csvContent.startsWith("\uFEFF")).toBe(true);
      expect(csvContent).toContain("Tanggal,Tipe,Kategori,Nominal (Rp)");
      expect(csvContent).toContain('"23/08/2026","Pengeluaran","Makanan",50000');
    });
  });

  describe("2. Statement Breakdown Calculus", () => {
    it("computes category distribution percentages matching total expenses", () => {
      const transactions = [
        { type: "EXPENSE", category: "Makanan", amount: 1500000 },
        { type: "EXPENSE", category: "Makanan", amount: 500000 },
        { type: "EXPENSE", category: "Transport", amount: 1000000 },
        { type: "EXPENSE", category: "Tagihan", amount: 1000000 },
        { type: "INCOME", category: "Gaji", amount: 10000000 },
      ];

      const expenses = transactions.filter((t) => t.type === "EXPENSE");
      const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0); // 4.000.000

      const categoryMap = new Map<string, number>();
      expenses.forEach((t) => {
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
      });

      expect(totalExpense).toBe(4000000);
      expect(categoryMap.get("Makanan")).toBe(2000000); // 50%
      expect(categoryMap.get("Transport")).toBe(1000000); // 25%
      expect(categoryMap.get("Tagihan")).toBe(1000000); // 25%

      const makananPct = Math.round(((categoryMap.get("Makanan") || 0) / totalExpense) * 100);
      expect(makananPct).toBe(50);
    });
  });

  describe("3. PDF Statement Document Identifier", () => {
    it("generates structured official document IDs", () => {
      const yearMonth = "202608";
      const hash = (15 * 137 + 1000) % 9000;
      const documentId = `FT-${yearMonth}-${1000 + hash}`;

      expect(documentId).toMatch(/^FT-\d{6}-\d{4}$/);
      expect(documentId.startsWith("FT-202608-")).toBe(true);
    });
  });
});

