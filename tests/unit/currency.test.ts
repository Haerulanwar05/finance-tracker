import { describe, it, expect } from "vitest";
import { formatRupiah, formatCompactRupiah, parseRupiahInput } from "@/lib/currency";

describe("Currency Utility (IDR)", () => {
  describe("UT-01: formatRupiah", () => {
    it("formats integer amounts to standard Indonesian Rupiah format", () => {
      // Intl format on node can use non-breaking space or standard space
      const result = formatRupiah(1250000);
      expect(result.replace(/\s/g, " ")).toContain("1.250.000");
    });

    it("handles zero, null, and empty inputs gracefully", () => {
      expect(formatRupiah(0).replace(/\s/g, " ")).toContain("0");
      expect(formatRupiah(null)).toBe("Rp 0");
      expect(formatRupiah(undefined)).toBe("Rp 0");
      expect(formatRupiah("")).toBe("Rp 0");
    });
  });

  describe("UT-02: formatCompactRupiah", () => {
    it("formats large numbers to compact string for charts & badges", () => {
      expect(formatCompactRupiah(1500000)).toBe("Rp 1,5 Jt");
      expect(formatCompactRupiah(2500000000)).toBe("Rp 2,5 M");
      expect(formatCompactRupiah(50000)).toBe("Rp 50 Rb");
    });
  });

  describe("UT-03: parseRupiahInput", () => {
    it("parses user formatted string inputs into raw numbers", () => {
      expect(parseRupiahInput("Rp 1.500.000")).toBe(1500000);
      expect(parseRupiahInput("50.000")).toBe(50000);
      expect(parseRupiahInput("1250000")).toBe(1250000);
      expect(parseRupiahInput("")).toBe(0);
      expect(parseRupiahInput("abc")).toBe(0);
    });
  });
});
