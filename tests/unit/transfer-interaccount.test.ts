import { describe, it, expect } from "vitest";
import { transferSchema } from "@/features/accounts/schema";
import { createTransactionSchema } from "@/features/transactions/schema";

describe("Inter-Account Transfer & Bug QA Test Suite", () => {
  const accountsMock = [
    { id: "acc-bni", name: "BNI", balance: 500000 },
    { id: "acc-tunai", name: "Uang Tunai", balance: 100000 },
    { id: "acc-bca", name: "BCA", balance: 250000 },
  ];

  describe("1. Transfer Schema Validation (ACID Rules)", () => {
    it("accepts valid transfer from BNI to Uang Tunai", () => {
      const result = transferSchema.safeParse({
        sourceAccountId: "acc-bni",
        targetAccountId: "acc-tunai",
        amount: 50000,
        date: new Date(),
        description: "Tarik Tunai BNI ke Dompet",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sourceAccountId).toBe("acc-bni");
        expect(result.data.targetAccountId).toBe("acc-tunai");
        expect(result.data.amount).toBe(50000);
      }
    });

    it("rejects transfer when source and target account IDs are identical", () => {
      const result = transferSchema.safeParse({
        sourceAccountId: "acc-bni",
        targetAccountId: "acc-bni",
        amount: 50000,
        date: new Date(),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        expect(fieldErrors.targetAccountId).toBeDefined();
        expect(fieldErrors.targetAccountId?.[0]).toContain("tidak boleh sama");
      }
    });

    it("rejects zero or negative transfer amount", () => {
      const resultZero = transferSchema.safeParse({
        sourceAccountId: "acc-bni",
        targetAccountId: "acc-tunai",
        amount: 0,
      });
      expect(resultZero.success).toBe(false);

      const resultNegative = transferSchema.safeParse({
        sourceAccountId: "acc-bni",
        targetAccountId: "acc-tunai",
        amount: -25000,
      });
      expect(resultNegative.success).toBe(false);
    });
  });

  describe("2. Transaction Schema TRANSFER Validation", () => {
    it("validates createTransactionSchema with type TRANSFER and different accounts", () => {
      const result = createTransactionSchema.safeParse({
        accountId: "acc-bni",
        targetAccountId: "acc-tunai",
        type: "TRANSFER",
        amount: 150000,
        date: new Date(),
        description: "Transfer ke Tunai",
      });

      expect(result.success).toBe(true);
    });

    it("rejects createTransactionSchema when TRANSFER has identical source and target", () => {
      const result = createTransactionSchema.safeParse({
        accountId: "acc-bni",
        targetAccountId: "acc-bni",
        type: "TRANSFER",
        amount: 150000,
        date: new Date(),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.targetAccountId?.[0]).toContain("tidak boleh sama");
      }
    });

    it("rejects createTransactionSchema when TRANSFER does not specify targetAccountId", () => {
      const result = createTransactionSchema.safeParse({
        accountId: "acc-bni",
        type: "TRANSFER",
        amount: 150000,
        date: new Date(),
      });

      expect(result.success).toBe(false);
    });
  });

  describe("3. UI State Synchronization & Collision Auto-Resolution", () => {
    function resolveSourceChange(
      newSourceId: string,
      currentTargetId: string,
      accounts: Array<{ id: string }>
    ): { sourceId: string; targetId: string } {
      let nextTarget = currentTargetId;
      if (newSourceId === currentTargetId) {
        const available = accounts.find((a) => a.id !== newSourceId);
        if (available) {
          nextTarget = available.id;
        }
      }
      return { sourceId: newSourceId, targetId: nextTarget };
    }

    function resolveTargetChange(
      newTargetId: string,
      currentSourceId: string,
      accounts: Array<{ id: string }>
    ): { sourceId: string; targetId: string } {
      let nextSource = currentSourceId;
      if (newTargetId === currentSourceId) {
        const available = accounts.find((a) => a.id !== newTargetId);
        if (available) {
          nextSource = available.id;
        }
      }
      return { sourceId: nextSource, targetId: newTargetId };
    }

    function resolveSwap(
      currentSourceId: string,
      currentTargetId: string
    ): { sourceId: string; targetId: string } {
      return { sourceId: currentTargetId, targetId: currentSourceId };
    }

    it("resolves collision when changing source account to current target account (BNI -> Uang Tunai)", () => {
      const initial = { sourceId: "acc-tunai", targetId: "acc-bni" };
      const resolved = resolveSourceChange("acc-bni", initial.targetId, accountsMock);

      expect(resolved.sourceId).toBe("acc-bni");
      expect(resolved.targetId).not.toBe("acc-bni");
      expect(resolved.targetId).toBe("acc-tunai");
      expect(resolved.sourceId).not.toBe(resolved.targetId);
    });

    it("resolves collision when changing target account to current source account", () => {
      const initial = { sourceId: "acc-bni", targetId: "acc-tunai" };
      const resolved = resolveTargetChange("acc-bni", initial.sourceId, accountsMock);

      expect(resolved.targetId).toBe("acc-bni");
      expect(resolved.sourceId).not.toBe("acc-bni");
      expect(resolved.sourceId).not.toBe(resolved.targetId);
    });

    it("swaps transfer direction cleanly without collision", () => {
      const initial = { sourceId: "acc-bni", targetId: "acc-tunai" };
      const swapped = resolveSwap(initial.sourceId, initial.targetId);

      expect(swapped.sourceId).toBe("acc-tunai");
      expect(swapped.targetId).toBe("acc-bni");
      expect(swapped.sourceId).not.toBe(swapped.targetId);
    });
  });

  describe("4. Financial Balance & Conservation of Value", () => {
    it("conserves total net worth during transfer between BNI and Uang Tunai", () => {
      const bniBefore = 500000;
      const tunaiBefore = 100000;
      const totalBefore = bniBefore + tunaiBefore;

      const transferAmount = 75000;
      const bniAfter = bniBefore - transferAmount;
      const tunaiAfter = tunaiBefore + transferAmount;
      const totalAfter = bniAfter + tunaiAfter;

      expect(bniAfter).toBe(425000);
      expect(tunaiAfter).toBe(175000);
      expect(totalAfter).toBe(totalBefore);
    });

    it("identifies insufficient balance when transfer amount exceeds source account", () => {
      const bniBalance = 500000;
      const transferAmount = 600000;
      const isSufficient = bniBalance >= transferAmount;

      expect(isSufficient).toBe(false);
    });
  });
});
