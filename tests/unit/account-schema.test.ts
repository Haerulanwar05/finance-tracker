import { describe, it, expect } from "vitest";
import { createAccountSchema, transferSchema } from "@/features/accounts/schema";

describe("Account & Transfer Validation Schemas", () => {
  describe("createAccountSchema", () => {
    it("validates valid bank account input", () => {
      const result = createAccountSchema.safeParse({
        name: "BCA Tahapan",
        type: "BANK",
        balance: 1500000,
        color: "#2563EB",
        icon: "landmark",
        accountNumber: "1234",
      });
      expect(result.success).toBe(true);
    });

    it("rejects negative initial balance", () => {
      const result = createAccountSchema.safeParse({
        name: "GoPay",
        type: "EWALLET",
        balance: -50000,
      });
      expect(result.success).toBe(false);
    });

    it("rejects names shorter than 2 characters", () => {
      const result = createAccountSchema.safeParse({
        name: "A",
        type: "CASH",
        balance: 10000,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("transferSchema (IT-03 Validation Guard)", () => {
    it("validates valid transfer between two distinct accounts", () => {
      const result = transferSchema.safeParse({
        sourceAccountId: "acc-bca-1",
        targetAccountId: "acc-gopay-2",
        amount: 100000,
        description: "Top-up e-wallet",
      });
      expect(result.success).toBe(true);
    });

    it("rejects transfer where source and target are the same account", () => {
      const result = transferSchema.safeParse({
        sourceAccountId: "acc-same",
        targetAccountId: "acc-same",
        amount: 50000,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.targetAccountId).toBeDefined();
      }
    });

    it("rejects transfer with 0 or negative amount", () => {
      const result = transferSchema.safeParse({
        sourceAccountId: "acc-1",
        targetAccountId: "acc-2",
        amount: 0,
      });
      expect(result.success).toBe(false);
    });
  });
});
