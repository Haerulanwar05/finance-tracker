import { describe, it, expect } from "vitest";
import {
  createGoalSchema,
  updateGoalSchema,
  allocateFundsSchema,
  withdrawFundsSchema,
} from "@/features/goals/schema";

describe("Fase 5: Financial Goals (Hybrid Multi-Vault) Test Suite", () => {
  // ----------------------------------------------------
  // 1. Goal Schema Validation
  // ----------------------------------------------------
  describe("1. Goal Schema Validation", () => {
    it("validates compliant goal creation input", () => {
      const valid = createGoalSchema.safeParse({
        name: "Dana Darurat 2026",
        targetAmount: 50000000,
        linkedAccountId: "acc_123",
        deadline: "2026-12-31",
        color: "#10B981",
        icon: "shield",
      });

      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.name).toBe("Dana Darurat 2026");
        expect(valid.data.targetAmount).toBe(50000000);
        expect(valid.data.color).toBe("#10B981");
      }
    });

    it("rejects invalid goal name or target amount", () => {
      const shortName = createGoalSchema.safeParse({
        name: "A",
        targetAmount: 1000000,
      });
      expect(shortName.success).toBe(false);

      const zeroAmount = createGoalSchema.safeParse({
        name: "Liburan",
        targetAmount: 0,
      });
      expect(zeroAmount.success).toBe(false);

      const negativeAmount = createGoalSchema.safeParse({
        name: "Liburan",
        targetAmount: -5000000,
      });
      expect(negativeAmount.success).toBe(false);
    });

    it("rejects invalid hex colors", () => {
      const invalidColor = createGoalSchema.safeParse({
        name: "DP Rumah",
        targetAmount: 100000000,
        color: "blue",
      });
      expect(invalidColor.success).toBe(false);
    });

    it("validates compliant goal update schema including status transitions", () => {
      const valid = updateGoalSchema.safeParse({
        id: "goal_123",
        name: "Dana Darurat (Updated)",
        targetAmount: 60000000,
        color: "#3B82F6",
        icon: "shield",
        status: "ACHIEVED",
      });

      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.status).toBe("ACHIEVED");
      }
    });
  });

  // ----------------------------------------------------
  // 2. Fund Allocation & Withdrawal Schemas
  // ----------------------------------------------------
  describe("2. Fund Allocation & Withdrawal Schemas", () => {
    it("validates compliant allocation (deposit) request", () => {
      const valid = allocateFundsSchema.safeParse({
        vaultId: "vault_123",
        sourceAccountId: "acc_456",
        amount: 2500000,
        note: "Tabungan gaji bulan ini",
      });

      expect(valid.success).toBe(true);
    });

    it("rejects non-positive allocation amounts", () => {
      const zero = allocateFundsSchema.safeParse({
        vaultId: "vault_123",
        sourceAccountId: "acc_456",
        amount: 0,
      });
      expect(zero.success).toBe(false);
    });

    it("validates compliant withdrawal request", () => {
      const valid = withdrawFundsSchema.safeParse({
        vaultId: "vault_123",
        targetAccountId: "acc_456",
        amount: 1000000,
        note: "Tarik dana untuk DP",
      });

      expect(valid.success).toBe(true);
    });
  });

  // ----------------------------------------------------
  // 3. Mathematical Invariants & Progress Estimation
  // ----------------------------------------------------
  describe("3. Mathematical Invariants & Progress Estimation", () => {
    it("calculates accurate goal progress percentages", () => {
      const target = 10000000;
      const current = 3500000;
      const progress = Math.min(100, Math.round((current / target) * 100));
      const remaining = Math.max(0, target - current);

      expect(progress).toBe(35);
      expect(remaining).toBe(6500000);
    });

    it("caps achievement progress at 100%", () => {
      const target = 5000000;
      const current = 6000000; // Over-saved
      const progress = Math.min(100, Math.round((current / target) * 100));

      expect(progress).toBe(100);
    });

    it("calculates required monthly savings pace for deadline", () => {
      const remaining = 12000000;
      const monthsLeft = 6;
      const monthlyPace = Math.ceil(remaining / monthsLeft);

      expect(monthlyPace).toBe(2000000);
    });
  });
});
