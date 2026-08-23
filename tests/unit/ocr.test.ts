import { describe, it, expect } from "vitest";
import { ocrResultSchema } from "@/features/ocr/types";
import { extractReceiptWithGemini } from "@/features/ocr/lib/gemini-ocr";

describe("Fase 4: Smart OCR Receipt Ingestion & AI Vision Test Suite", () => {
  // ----------------------------------------------------
  // 1. OCR Schema Validation
  // ----------------------------------------------------
  describe("1. OCR Schema Validation", () => {
    it("validates compliant parsed receipt JSON data", () => {
      const valid = ocrResultSchema.safeParse({
        merchant: "Indomaret Point Senopati",
        date: "2026-08-23",
        totalAmount: 78500,
        type: "EXPENSE",
        suggestedCategory: "Belanja & Kebutuhan",
        items: [
          { name: "Susu UHT Ultra Milk 1L", qty: 2, price: 42000 },
          { name: "Roti Tawar Kupas", qty: 1, price: 16500 },
          { name: "Snack Chitato 68g", qty: 1, price: 12500 },
        ],
        confidence: 0.96,
      });

      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.merchant).toBe("Indomaret Point Senopati");
        expect(valid.data.totalAmount).toBe(78500);
        expect(valid.data.items).toHaveLength(3);
      }
    });

    it("applies sensible defaults for optional or missing fields", () => {
      const parsedWithDefaults = ocrResultSchema.safeParse({
        totalAmount: 150000,
      });

      expect(parsedWithDefaults.success).toBe(true);
      if (parsedWithDefaults.success) {
        expect(parsedWithDefaults.data.type).toBe("EXPENSE");
        expect(parsedWithDefaults.data.confidence).toBe(0.9);
        expect(parsedWithDefaults.data.items).toEqual([]);
      }
    });

    it("rejects invalid or zero amount", () => {
      const zeroAmount = ocrResultSchema.safeParse({
        merchant: "Kopi Kenangan",
        totalAmount: 0,
      });
      expect(zeroAmount.success).toBe(false);

      const negativeAmount = ocrResultSchema.safeParse({
        merchant: "Kopi Kenangan",
        totalAmount: -50000,
      });
      expect(negativeAmount.success).toBe(false);
    });
  });

  // ----------------------------------------------------
  // 2. Vision OCR Engine Extraction
  // ----------------------------------------------------
  describe("2. Vision OCR Engine Extraction", () => {
    it("returns structured mock data with items and category when testing without API key", async () => {
      const dummyBuffer = Buffer.from("fake-image-bytes");
      const result = await extractReceiptWithGemini(dummyBuffer, "image/jpeg");

      expect(result).toBeDefined();
      expect(result.merchant).toBeDefined();
      expect(result.totalAmount).toBeGreaterThan(0);
      expect(result.type).toBe("EXPENSE");
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });
});
