import { describe, it, expect } from "vitest";
import { sortAccounts, AccountSortOption } from "@/features/accounts/lib/sort";
import { AccountItem } from "@/features/accounts/components/account-card";

describe("Account Balance Sorting QA & Logic Verification Suite", () => {
  const sampleAccounts: AccountItem[] = [
    { id: "acc-1", name: "BNI", type: "BANK", balance: 5000000 },
    { id: "acc-2", name: "BCA", type: "BANK", balance: 15000000 },
    { id: "acc-3", name: "Uang Tunai", type: "CASH", balance: 250000 },
    { id: "acc-4", name: "GoPay", type: "EWALLET", balance: 50000 },
  ];

  describe("1. Descending Sort (Highest to Lowest Balance)", () => {
    it("sorts accounts from highest balance to lowest balance correctly", () => {
      const sorted = sortAccounts(sampleAccounts, "BALANCE_DESC");

      expect(sorted.map((a) => a.name)).toEqual(["BCA", "BNI", "Uang Tunai", "GoPay"]);
      expect(sorted.map((a) => Number(a.balance))).toEqual([15000000, 5000000, 250000, 50000]);
    });
  });

  describe("2. Ascending Sort (Lowest to Highest Balance)", () => {
    it("sorts accounts from lowest balance to highest balance correctly", () => {
      const sorted = sortAccounts(sampleAccounts, "BALANCE_ASC");

      expect(sorted.map((a) => a.name)).toEqual(["GoPay", "Uang Tunai", "BNI", "BCA"]);
      expect(sorted.map((a) => Number(a.balance))).toEqual([50000, 250000, 5000000, 15000000]);
    });
  });

  describe("3. Default Sort & Immutability", () => {
    it("preserves original database order when sortOption is DEFAULT", () => {
      const sorted = sortAccounts(sampleAccounts, "DEFAULT");
      expect(sorted.map((a) => a.name)).toEqual(["BNI", "BCA", "Uang Tunai", "GoPay"]);
    });

    it("does not mutate the original accounts array (pure function)", () => {
      const originalCopy = [...sampleAccounts];
      sortAccounts(sampleAccounts, "BALANCE_DESC");

      expect(sampleAccounts).toEqual(originalCopy);
      expect(sampleAccounts[0].name).toBe("BNI");
    });
  });

  describe("4. Edge Cases & Boundary Handling", () => {
    it("resolves identical balances deterministically using account name tie-breaker", () => {
      const tieAccounts: AccountItem[] = [
        { id: "acc-1", name: "Mandiri", type: "BANK", balance: 1000000 },
        { id: "acc-2", name: "BCA", type: "BANK", balance: 1000000 },
        { id: "acc-3", name: "AlloBank", type: "BANK", balance: 1000000 },
      ];

      const sortedDesc = sortAccounts(tieAccounts, "BALANCE_DESC");
      expect(sortedDesc.map((a) => a.name)).toEqual(["AlloBank", "BCA", "Mandiri"]);

      const sortedAsc = sortAccounts(tieAccounts, "BALANCE_ASC");
      expect(sortedAsc.map((a) => a.name)).toEqual(["AlloBank", "BCA", "Mandiri"]);
    });

    it("handles negative balances correctly (e.g. Credit Card debt)", () => {
      const withDebt: AccountItem[] = [
        { id: "acc-1", name: "Dompet", type: "CASH", balance: 100000 },
        { id: "acc-2", name: "Kartu Kredit", type: "CREDIT_CARD", balance: -500000 },
        { id: "acc-3", name: "Tabungan", type: "BANK", balance: 2000000 },
      ];

      const sortedDesc = sortAccounts(withDebt, "BALANCE_DESC");
      expect(sortedDesc.map((a) => a.name)).toEqual(["Tabungan", "Dompet", "Kartu Kredit"]);

      const sortedAsc = sortAccounts(withDebt, "BALANCE_ASC");
      expect(sortedAsc.map((a) => a.name)).toEqual(["Kartu Kredit", "Dompet", "Tabungan"]);
    });

    it("handles string or null balances gracefully without NaN errors", () => {
      const mixedAccounts: AccountItem[] = [
        { id: "acc-1", name: "Null Balance", type: "CASH", balance: null },
        { id: "acc-2", name: "String Balance", type: "BANK", balance: "750000" as any },
        { id: "acc-3", name: "Normal Balance", type: "BANK", balance: 250000 },
      ];

      const sortedDesc = sortAccounts(mixedAccounts, "BALANCE_DESC");
      expect(sortedDesc[0].name).toBe("String Balance"); // 750000
      expect(sortedDesc[1].name).toBe("Normal Balance"); // 250000
      expect(sortedDesc[2].name).toBe("Null Balance");   // 0

      const sortedAsc = sortAccounts(mixedAccounts, "BALANCE_ASC");
      expect(sortedAsc[0].name).toBe("Null Balance");   // 0
      expect(sortedAsc[1].name).toBe("Normal Balance"); // 250000
      expect(sortedAsc[2].name).toBe("String Balance"); // 750000
    });

    it("handles empty array and single item without error", () => {
      expect(sortAccounts([], "BALANCE_DESC")).toEqual([]);
      expect(sortAccounts([sampleAccounts[0]], "BALANCE_DESC")).toEqual([sampleAccounts[0]]);
    });

    it("handles multi-billion Rupiah balances without precision loss", () => {
      const bigAccounts: AccountItem[] = [
        { id: "acc-1", name: "Bisnis", type: "BANK", balance: 2500000000 }, // 2.5 Milyar
        { id: "acc-2", name: "Investasi", type: "INVESTMENT", balance: 10000000000 }, // 10 Milyar
        { id: "acc-3", name: "Kas", type: "CASH", balance: 50000000 }, // 50 Juta
      ];

      const sorted = sortAccounts(bigAccounts, "BALANCE_DESC");
      expect(sorted.map((a) => a.name)).toEqual(["Investasi", "Bisnis", "Kas"]);
    });
  });
});
