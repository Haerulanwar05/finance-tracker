import { z } from "zod";

export const accountTypeEnum = z.enum(["BANK", "EWALLET", "CASH", "INVESTMENT", "CREDIT_CARD"]);

export const createAccountSchema = z.object({
  name: z.string().min(2, "Nama akun/rekening minimal 2 karakter"),
  type: accountTypeEnum,
  balance: z.number().min(0, "Saldo awal tidak boleh minus"),
  color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Warna tidak valid").default("#2563EB"),
  icon: z.string().default("wallet"),
  accountNumber: z.string().max(30).optional().nullable(),
});

export const updateAccountSchema = createAccountSchema.partial().extend({
  id: z.string().min(1, "ID akun diperlukan"),
});

export const transferSchema = z.object({
  sourceAccountId: z.string().min(1, "Pilih akun sumber dana"),
  targetAccountId: z.string().min(1, "Pilih akun tujuan"),
  amount: z.number().positive("Nominal transfer harus lebih dari 0"),
  date: z.date().default(() => new Date()),
  description: z.string().max(255).optional(),
}).refine((data) => data.sourceAccountId !== data.targetAccountId, {
  message: "Akun asal dan akun tujuan tidak boleh sama",
  path: ["targetAccountId"],
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type TransferInput = z.infer<typeof transferSchema>;
