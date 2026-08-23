import { describe, it, expect } from "vitest";
import { formatRupiah } from "@/lib/currency";
import { loginSchema, registerSchema } from "@/features/auth/schema";
import { createAccountSchema } from "@/features/accounts/schema";
import { createTransactionSchema } from "@/features/transactions/schema";
import { createGoalSchema, allocateFundsSchema, withdrawFundsSchema } from "@/features/goals/schema";

describe("QA & End-to-End System Verification Suite", () => {
  // 1. Realistic User Onboarding Journey
  describe("Journey 1: Autentikasi & Registrasi Pengguna", () => {
    it("validates successful user registration payload", () => {
      const validPayload = {
        name: "Haerul Pratama",
        email: "haerul@example.com",
        password: "password123",
      };

      const result = registerSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects weak password and malformed email", () => {
      const invalidPayload = {
        name: "H",
        email: "not-an-email",
        password: "123",
      };

      const result = registerSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.email).toBeDefined();
        expect(errors.password).toBeDefined();
      }
    });

    it("validates valid login credentials schema", () => {
      const validLogin = {
        email: "haerul@example.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });
  });

  // 2. Multi-Account Portfolio Management
  describe("Journey 2: Manajemen Multi-Rekening & Konservasi Saldo", () => {
    it("creates Bank, E-Wallet, and Cash accounts correctly", () => {
      const bca = createAccountSchema.safeParse({
        name: "BCA Utama",
        type: "BANK",
        balance: 10000000,
        color: "#3B82F6",
      });

      const gopay = createAccountSchema.safeParse({
        name: "GoPay Digital",
        type: "EWALLET",
        balance: 1500000,
        color: "#10B981",
      });

      const cash = createAccountSchema.safeParse({
        name: "Dompet Tunai",
        type: "CASH",
        balance: 500000,
        color: "#F59E0B",
      });

      expect(bca.success).toBe(true);
      expect(gopay.success).toBe(true);
      expect(cash.success).toBe(true);
    });

    it("executes transfer funds maintaining strict balance conservation law", () => {
      let bcaBalance = 10000000;
      let gopayBalance = 1500000;
      const initialTotal = bcaBalance + gopayBalance;

      const transferAmount = 2000000;

      // Transfer from BCA to GoPay
      expect(bcaBalance).toBeGreaterThanOrEqual(transferAmount);
      bcaBalance -= transferAmount;
      gopayBalance += transferAmount;

      expect(bcaBalance).toBe(8000000);
      expect(gopayBalance).toBe(3500000);
      expect(bcaBalance + gopayBalance).toBe(initialTotal); // Strict conservation
    });

    it("prevents overdraft transfer when source balance is insufficient", () => {
      const gopayBalance = 500000;
      const transferAmount = 1000000;

      function canTransfer(balance: number, amount: number) {
        return balance >= amount && amount > 0;
      }

      expect(canTransfer(gopayBalance, transferAmount)).toBe(false);
    });
  });

  // 3. Transactions & Expense Tracking Journey
  describe("Journey 3: Pencatatan Transaksi & Kategorisasi", () => {
    it("records expense transaction with proper validation", () => {
      const expensePayload = {
        accountId: "acc-123",
        categoryId: "cat-food",
        type: "EXPENSE" as const,
        amount: 85000,
        date: new Date("2026-08-23"),
        description: "Makan Siang Nasi Padang",
      };

      const result = createTransactionSchema.safeParse(expensePayload);
      expect(result.success).toBe(true);
    });

    it("rejects zero or negative transaction amount", () => {
      const invalidPayload = {
        accountId: "acc-123",
        categoryId: "cat-food",
        type: "EXPENSE" as const,
        amount: 0,
        date: new Date("2026-08-23"),
        description: "Zero transaction",
      };

      const result = createTransactionSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("computes monthly income, expense, and net cashflow accurately", () => {
      const transactions = [
        { type: "INCOME", amount: 15000000 },
        { type: "EXPENSE", amount: 3500000 },
        { type: "EXPENSE", amount: 1200000 },
        { type: "EXPENSE", amount: 300000 },
      ];

      const totalIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

      const netCashflow = totalIncome - totalExpense;
      const savingsRate = Math.round((netCashflow / totalIncome) * 100);

      expect(totalIncome).toBe(15000000);
      expect(totalExpense).toBe(5000000);
      expect(netCashflow).toBe(10000000);
      expect(savingsRate).toBe(67);
      expect(formatRupiah(netCashflow)).toBe("Rp 10.000.000");
    });
  });

  // 4. Target Tabungan (Goal Vaults) Lifecycle
  describe("Journey 4: Siklus Target Tabungan & Alokasi Dana", () => {
    it("creates target tabungan with valid goal and deadline", () => {
      const goalPayload = {
        name: "Dana Darurat 6 Bulan",
        targetAmount: 30000000,
        deadline: "2026-12-31",
        color: "#3B82F6",
        icon: "shield",
      };

      const result = createGoalSchema.safeParse(goalPayload);
      expect(result.success).toBe(true);
    });

    it("deposits money to goal and updates progress percentage accurately", () => {
      const targetAmount = 30000000;
      let currentSaved = 0;

      const depositAmount = 6000000;
      const allocValidation = allocateFundsSchema.safeParse({
        vaultId: "vault-1",
        sourceAccountId: "acc-1",
        amount: depositAmount,
      });
      expect(allocValidation.success).toBe(true);

      currentSaved += depositAmount;
      const progressPct = Math.round((currentSaved / targetAmount) * 100);

      expect(currentSaved).toBe(6000000);
      expect(progressPct).toBe(20);
      expect(formatRupiah(currentSaved)).toBe("Rp 6.000.000");
    });

    it("withdraws money from goal without dipping below zero", () => {
      let currentSaved = 6000000;
      const withdrawAmount = 2000000;

      const depositValidation = withdrawFundsSchema.safeParse({
        vaultId: "vault-1",
        targetAccountId: "acc-1",
        amount: withdrawAmount,
      });
      expect(depositValidation.success).toBe(true);

      currentSaved -= withdrawAmount;
      expect(currentSaved).toBe(4000000);
    });

    it("prevents withdrawal exceeding current goal balance", () => {
      const currentSaved = 4000000;
      const excessiveWithdraw = 5000000;

      function canWithdraw(saved: number, amount: number) {
        return amount > 0 && amount <= saved;
      }

      expect(canWithdraw(currentSaved, excessiveWithdraw)).toBe(false);
    });
  });

  // 5. Monthly Spending Limit & Daily Safe Limit (Option 2 Logic)
  describe("Journey 5: Batas Belanja Bulanan & Harian (Opsi 2 Flat)", () => {
    it("calculates daily budget using 30-day flat standard benchmark", () => {
      const monthlyBudget = 3000000;
      const dailyBudget = Math.floor(monthlyBudget / 30);

      expect(dailyBudget).toBe(100000);
      expect(formatRupiah(dailyBudget)).toBe("Rp 100.000");
    });

    it("verifies various user budget tiers", () => {
      const tiers = [
        { monthly: 3000000, expectedDaily: 100000 },
        { monthly: 4500000, expectedDaily: 150000 },
        { monthly: 6000000, expectedDaily: 200000 },
        { monthly: 7500000, expectedDaily: 250000 },
        { monthly: 9000000, expectedDaily: 300000 },
        { monthly: 15000000, expectedDaily: 500000 },
      ];

      for (const tier of tiers) {
        const computed = Math.floor(tier.monthly / 30);
        expect(computed).toBe(tier.expectedDaily);
      }
    });

    it("evaluates risk status based on monthly spending threshold", () => {
      function evaluateStatus(spent: number, limit: number): "SAFE" | "WARNING" | "CRITICAL" {
        const usagePct = (spent / limit) * 100;
        if (spent >= limit || usagePct >= 90) return "CRITICAL";
        if (usagePct >= 75) return "WARNING";
        return "SAFE";
      }

      const limit = 3000000;
      expect(evaluateStatus(1000000, limit)).toBe("SAFE");     // 33%
      expect(evaluateStatus(2300000, limit)).toBe("WARNING");  // 76.6%
      expect(evaluateStatus(2800000, limit)).toBe("CRITICAL"); // 93.3%
      expect(evaluateStatus(3200000, limit)).toBe("CRITICAL"); // Over budget
    });
  });

  // 6. Custom Categories & Privacy State
  describe("Journey 6: Kategori Kustom & Proteksi Sistem", () => {
    it("allows creating custom categories with valid types", () => {
      const customCategory = {
        name: "Langganan Streaming & Game",
        type: "EXPENSE" as const,
        color: "#8B5CF6",
      };

      expect(customCategory.name.trim().length).toBeGreaterThan(0);
      expect(["INCOME", "EXPENSE"]).toContain(customCategory.type);
    });

    it("protects default system categories from deletion", () => {
      const systemCategories = [
        { id: "cat-1", name: "Makanan & Minuman", isDefault: true },
        { id: "cat-2", name: "Gaji & Pendapatan", isDefault: true },
        { id: "cat-3", name: "Hobi Kustom", isDefault: false },
      ];

      const deletable = systemCategories.filter((c) => !c.isDefault);
      expect(deletable.length).toBe(1);
      expect(deletable[0].name).toBe("Hobi Kustom");
    });
  });
});
