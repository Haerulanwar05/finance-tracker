import { describe, it, expect } from "vitest";

describe("Pengaturan & Settings Test Suite", () => {
  describe("1. Profile & Budget Validation", () => {
    it("sanitizes numeric monthly budget inputs properly", () => {
      function sanitizeLimit(val: unknown): number {
        return Math.max(0, Math.round(Number(val) || 0));
      }

      expect(sanitizeLimit("5000000")).toBe(5000000);
      expect(sanitizeLimit(-1000)).toBe(0);
      expect(sanitizeLimit("abc")).toBe(0);
      expect(sanitizeLimit(7500000.85)).toBe(7500001);
    });

    it("validates non-empty user full name", () => {
      function validateName(name: string): boolean {
        return name.trim().length > 0;
      }

      expect(validateName("Haerul")).toBe(true);
      expect(validateName("   ")).toBe(false);
      expect(validateName("")).toBe(false);
    });
  });

  describe("2. Custom Category Invariants", () => {
    it("prevents system default categories from being deleted", () => {
      interface Category {
        id: string;
        isDefault: boolean;
      }

      function canDeleteCategory(cat: Category): boolean {
        return !cat.isDefault;
      }

      const defaultCat: Category = { id: "cat-1", isDefault: true };
      const customCat: Category = { id: "cat-2", isDefault: false };

      expect(canDeleteCategory(defaultCat)).toBe(false);
      expect(canDeleteCategory(customCat)).toBe(true);
    });
  });
});
