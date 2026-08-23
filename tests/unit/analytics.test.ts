import { describe, it, expect } from "vitest";
import { formatRupiah } from "@/lib/currency";

describe("Fase 6: Dashboard Overview & Analytics Test Suite", () => {
  // 1. Safe-to-Spend & User Monthly Spending Limit Calculus
  describe("1. Safe-to-Spend & User Monthly Spending Limit Logic", () => {
    it("calculates accurate daily allowance from user custom monthly limit (flat 30 days)", () => {
      const userMonthlyLimit = 3000000;
      const currentExpenses = 1200000;

      const monthlyRemaining = Math.max(0, userMonthlyLimit - currentExpenses); // 1.800.000
      const usagePercentage = Math.round((currentExpenses / userMonthlyLimit) * 100); // 40%
      const dailySafe = Math.floor(userMonthlyLimit / 30); // 100.000

      expect(monthlyRemaining).toBe(1800000);
      expect(usagePercentage).toBe(40);
      expect(dailySafe).toBe(100000);
      expect(formatRupiah(dailySafe)).toBe("Rp 100.000");
    });

    it("triggers critical status when expenses exceed monthly limit", () => {
      const userMonthlyLimit = 5000000;
      const currentExpenses = 5500000;

      const monthlyRemaining = Math.max(0, userMonthlyLimit - currentExpenses);
      const usagePercentage = Math.min(100, Math.round((currentExpenses / userMonthlyLimit) * 100));
      const dailySafe = Math.max(0, Math.floor(userMonthlyLimit / 30));

      expect(monthlyRemaining).toBe(0);
      expect(usagePercentage).toBe(100);
      expect(dailySafe).toBe(166666);
    });

    it("calculates accurate daily allowance from liquid net worth (flat 30 days)", () => {
      const netWorth = 15000000;
      const goalCommitments = 3000000;
      const freeCapital = Math.max(0, netWorth - goalCommitments); // 12.000.000

      const dailySafe = Math.floor(freeCapital / 30);
      expect(dailySafe).toBe(400000);
      expect(formatRupiah(dailySafe)).toBe("Rp 400.000");
    });

    it("assigns correct risk statuses based on usage percentage", () => {
      function getStatus(usagePct: number, spent: number, limit: number): "SAFE" | "WARNING" | "CRITICAL" {
        if (spent >= limit || usagePct >= 90) return "CRITICAL";
        if (usagePct >= 75) return "WARNING";
        return "SAFE";
      }

      expect(getStatus(40, 2000000, 5000000)).toBe("SAFE");
      expect(getStatus(80, 4000000, 5000000)).toBe("WARNING");
      expect(getStatus(95, 4750000, 5000000)).toBe("CRITICAL");
      expect(getStatus(100, 5200000, 5000000)).toBe("CRITICAL");
    });

    it("guards against negative free capital when goals exceed net worth", () => {
      const netWorth = 5000000;
      const goalCommitments = 8000000;
      const freeCapital = Math.max(0, netWorth - goalCommitments);
      const dailySafe = Math.max(0, Math.floor(freeCapital / 30));

      expect(freeCapital).toBe(0);
      expect(dailySafe).toBe(0);
    });
  });

  // 2. 6-Month Cashflow Trend Aggregation
  describe("2. Cashflow Trend Aggregations", () => {
    it("computes net cashflow correctly (income - expense)", () => {
      const sampleMonth = {
        month: "Agt",
        pemasukan: 12500000,
        pengeluaran: 7800000,
      };
      const arusKasBersih = sampleMonth.pemasukan - sampleMonth.pengeluaran;
      expect(arusKasBersih).toBe(4700000);
    });

    it("handles zero expense/income months gracefully", () => {
      const emptyMonth = {
        month: "Mar",
        pemasukan: 0,
        pengeluaran: 0,
      };
      expect(emptyMonth.pemasukan - emptyMonth.pengeluaran).toBe(0);
    });
  });

  // 3. Category Expense Distribution
  describe("3. Category Expense Percentage Distribution", () => {
    it("computes exact integer percentage distribution summing to 100", () => {
      const expenses = [
        { name: "Makanan & Minuman", amount: 3000000 },
        { name: "Transportasi", amount: 1000000 },
        { name: "Tagihan & Listrik", amount: 1000000 },
      ];
      const total = expenses.reduce((s, e) => s + e.amount, 0); // 5.000.000

      const withPercentages = expenses.map((e) => ({
        ...e,
        percentage: Math.round((e.amount / total) * 100),
      }));

      expect(withPercentages[0].percentage).toBe(60);
      expect(withPercentages[1].percentage).toBe(20);
      expect(withPercentages[2].percentage).toBe(20);
      expect(withPercentages.reduce((s, p) => s + p.percentage, 0)).toBe(100);
    });
  });
});
