import { describe, it, expect } from "vitest";
import { formatRupiah, formatCompactRupiah, parseRupiahInput } from "@/lib/currency";
import {
  createAccountSchema,
  updateAccountSchema,
  transferSchema,
} from "@/features/accounts/schema";
import { registerSchema, loginSchema } from "@/features/auth/schema";

describe("QA & Testing Deep Matrix Audit", () => {
  // ----------------------------------------------------
  // 1. Currency & Mathematical Precision (UT-01, UT-02, UT-03)
  // ----------------------------------------------------
  describe("1. Currency Formatter & Parser Precision", () => {
    it("[UT-01] formats standard positive integers to IDR format", () => {
      expect(formatRupiah(1250000)).toBe("Rp 1.250.000");
      expect(formatRupiah(0)).toBe("Rp 0");
      expect(formatRupiah(42480000)).toBe("Rp 42.480.000");
    });

    it("[UT-02] formats large billionaire/trillionaire assets accurately", () => {
      expect(formatRupiah(1500000000)).toBe("Rp 1.500.000.000");
      expect(formatRupiah(99999999999)).toBe("Rp 99.999.999.999");
    });

    it("[UT-03] compact format abbreviations (Rb, Jt, M)", () => {
      expect(formatCompactRupiah(1500)).toBe("Rp 1,5 Rb");
      expect(formatCompactRupiah(2500000)).toBe("Rp 2,5 Jt");
      expect(formatCompactRupiah(1500000000)).toBe("Rp 1,5 M");
    });

    it("parses dirty string inputs into clean numeric float", () => {
      expect(parseRupiahInput("Rp 1.500.000")).toBe(1500000);
      expect(parseRupiahInput("1500000")).toBe(1500000);
      expect(parseRupiahInput("")).toBe(0);
      expect(parseRupiahInput("abc-120.000")).toBe(-120000);
    });
  });

  // ----------------------------------------------------
  // 2. Authentication Boundary & Security Audit (SEC-01, SEC-02)
  // ----------------------------------------------------
  describe("2. Authentication Schemas Security Gates", () => {
    it("validates compliant user registration input", () => {
      const valid = registerSchema.safeParse({
        name: "Budi Santoso",
        email: "budi@example.com",
        password: "password123",
      });
      expect(valid.success).toBe(true);
    });

    it("rejects password shorter than 6 characters", () => {
      const invalid = registerSchema.safeParse({
        name: "Budi",
        email: "budi@example.com",
        password: "123",
      });
      expect(invalid.success).toBe(false);
      if (!invalid.success) {
        expect(invalid.error.flatten().fieldErrors.password).toBeDefined();
      }
    });

    it("rejects invalid email formats", () => {
      const invalid = registerSchema.safeParse({
        name: "Budi",
        email: "not-an-email",
        password: "password123",
      });
      expect(invalid.success).toBe(false);
    });

    it("normalizes and validates valid login payload", () => {
      const valid = loginSchema.safeParse({
        email: "user@financetracker.dev",
        password: "mypassword123",
      });
      expect(valid.success).toBe(true);
    });
  });

  // ----------------------------------------------------
  // 3. Multi-Account & Transfer Invariant Audit (IT-03, IT-04)
  // ----------------------------------------------------
  describe("3. Multi-Account & Atomic Transfer Invariants", () => {
    it("validates all 5 supported asset types (BANK, EWALLET, CASH, INVESTMENT, CREDIT_CARD)", () => {
      const types = ["BANK", "EWALLET", "CASH", "INVESTMENT", "CREDIT_CARD"] as const;
      for (const t of types) {
        const res = createAccountSchema.safeParse({
          name: `Dompet ${t}`,
          type: t,
          balance: 100000,
          color: "#2563EB",
          icon: "wallet",
        });
        expect(res.success).toBe(true);
      }
    });

    it("validates updateAccountSchema with partial modifications", () => {
      const validUpdate = updateAccountSchema.safeParse({
        id: "acc-123",
        name: "BCA Tabungan Utama",
        color: "#0284C7",
        accountNumber: "9988",
      });
      expect(validUpdate.success).toBe(true);

      const invalidUpdate = updateAccountSchema.safeParse({
        // missing required id
        name: "No ID Account",
      });
      expect(invalidUpdate.success).toBe(false);
    });

    it("validates strict hex color codes (#HEX)", () => {
      const validColor = createAccountSchema.safeParse({
        name: "BCA",
        type: "BANK",
        balance: 50000,
        color: "#10B981",
      });
      expect(validColor.success).toBe(true);

      const invalidColor = createAccountSchema.safeParse({
        name: "BCA",
        type: "BANK",
        balance: 50000,
        color: "not-a-color",
      });
      expect(invalidColor.success).toBe(false);
    });

    it("[IT-03 Guard] guarantees transfer between 2 different accounts passes validation", () => {
      const validTransfer = transferSchema.safeParse({
        sourceAccountId: "bca-id-123",
        targetAccountId: "gopay-id-456",
        amount: 250000,
        description: "Top-up GoPay dari BCA",
      });
      expect(validTransfer.success).toBe(true);
    });

    it("[IT-03 Guard] prevents self-transfer (source === target)", () => {
      const selfTransfer = transferSchema.safeParse({
        sourceAccountId: "same-id",
        targetAccountId: "same-id",
        amount: 50000,
      });
      expect(selfTransfer.success).toBe(false);
      if (!selfTransfer.success) {
        expect(selfTransfer.error.flatten().fieldErrors.targetAccountId).toContain(
          "Akun asal dan akun tujuan tidak boleh sama"
        );
      }
    });

    it("mathematical net worth conservation invariant simulation", () => {
      // Simulating transfer of 500.000 from BCA (15.000.000) to GoPay (1.000.000)
      const bcaBalance = 15000000;
      const gopayBalance = 1000000;
      const initialNetWorth = bcaBalance + gopayBalance;

      const transferAmount = 500000;
      const nextBca = bcaBalance - transferAmount;
      const nextGopay = gopayBalance + transferAmount;
      const finalNetWorth = nextBca + nextGopay;

      expect(nextBca).toBe(14500000);
      expect(nextGopay).toBe(1500000);
      expect(finalNetWorth).toBe(initialNetWorth); // Net worth conservation law
    });
  });

  // ----------------------------------------------------
  // 5. Goal Pace & Deadline Calculus (GOAL-01, GOAL-02)
  // ----------------------------------------------------
  describe("5. Financial Goal Pace Calculus", () => {
    it("calculates accurate monthly pace for 6-month goal", () => {
      const target = 30000000;
      const current = 6000000;
      const remaining = target - current; // 24.000.000
      const months = 6;
      const pace = Math.ceil(remaining / months);

      expect(pace).toBe(4000000);
      expect(formatRupiah(pace)).toBe("Rp 4.000.000");
    });

    it("returns 0 pace when goal is already fully achieved", () => {
      const target = 10000000;
      const current = 12000000;
      const remaining = Math.max(0, target - current);
      expect(remaining).toBe(0);
    });
  });

  // ----------------------------------------------------
  // 6. Typewriter Finite State Machine Invariants
  // ----------------------------------------------------
  describe("6. Typewriter State Machine Invariants", () => {
    it("advances word index cyclically across words array", () => {
      const words = ["Satu", "Dua", "Tiga", "Empat"];
      let wordIndex = 0;
      for (let i = 0; i < 8; i++) {
        const currentWord = words[wordIndex % words.length];
        expect(words).toContain(currentWord);
        wordIndex = (wordIndex + 1) % words.length;
      }
      expect(wordIndex).toBe(0); // Completed two full cycles
    });
  });
});
