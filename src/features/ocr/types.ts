import { z } from "zod";

export interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
}

export interface ParsedReceiptData {
  merchant: string;
  date: string; // YYYY-MM-DD
  totalAmount: number;
  type: "EXPENSE" | "INCOME";
  suggestedCategory: string;
  items: ReceiptItem[];
  confidence: number;
  rawText?: string;
  receiptUrl?: string;
}

export const ocrResultSchema = z.object({
  merchant: z.string().default("Merchant Struk Belanja"),
  date: z.string().default(() => new Date().toISOString().split("T")[0]),
  totalAmount: z.number().positive(),
  type: z.enum(["EXPENSE", "INCOME"]).default("EXPENSE"),
  suggestedCategory: z.string().default("Belanja Kebutuhan"),
  items: z
    .array(
      z.object({
        name: z.string(),
        qty: z.number().default(1),
        price: z.number().nonnegative(),
      })
    )
    .default([]),
  confidence: z.number().min(0).max(1).default(0.9),
  rawText: z.string().optional(),
});
