import { z } from "zod";

export const transactionTypeEnum = z.enum(["EXPENSE", "INCOME", "TRANSFER"]);
export type TransactionType = z.infer<typeof transactionTypeEnum>;

export const createTransactionSchema = z
  .object({
    accountId: z.string().min(1, "Akun sumber dana wajib dipilih"),
    targetAccountId: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    type: transactionTypeEnum.default("EXPENSE"),
    amount: z
      .number()
      .positive("Nominal transaksi harus lebih dari 0"),
    date: z.coerce.date().default(() => new Date()),
    description: z.string().max(255, "Deskripsi maksimal 255 karakter").optional().nullable(),
    receiptUrl: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type === "TRANSFER") {
        return !!data.targetAccountId && data.targetAccountId !== data.accountId;
      }
      return true;
    },
    {
      message: "Akun tujuan transfer wajib dipilih dan tidak boleh sama dengan akun asal",
      path: ["targetAccountId"],
    }
  )
  .refine(
    (data) => {
      // For EXPENSE and INCOME, categoryId is recommended/expected
      if (data.type !== "TRANSFER" && !data.categoryId) {
        return false;
      }
      return true;
    },
    {
      message: "Kategori transaksi wajib dipilih",
      path: ["categoryId"],
    }
  );

export const updateTransactionSchema = z.object({
  id: z.string().min(1, "ID transaksi tidak valid"),
  accountId: z.string().min(1, "Akun sumber dana wajib dipilih"),
  targetAccountId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  type: transactionTypeEnum,
  amount: z.number().positive("Nominal harus lebih dari 0"),
  date: z.coerce.date(),
  description: z.string().max(255).optional().nullable(),
});

export const deleteTransactionSchema = z.object({
  id: z.string().min(1, "ID transaksi wajib diisi"),
});

export const transactionFilterSchema = z.object({
  accountId: z.string().optional(),
  categoryId: z.string().optional(),
  type: z.enum(["ALL", "EXPENSE", "INCOME", "TRANSFER"]).default("ALL"),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const csvTransactionRowSchema = z.object({
  date: z.coerce.date(),
  description: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(["EXPENSE", "INCOME"]),
  suggestedCategoryId: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type DeleteTransactionInput = z.infer<typeof deleteTransactionSchema>;
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;
export type CsvTransactionRow = z.infer<typeof csvTransactionRowSchema>;
