"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface SaveReceiptTransactionInput {
  accountId: string;
  categoryId?: string;
  amount: number;
  date: string;
  description: string;
  receiptUrl?: string;
  rawOcrJson?: string;
}

/**
 * Save OCR-scanned receipt as an EXPENSE transaction and decrement account balance atomically
 */
export async function saveReceiptTransaction(
  input: SaveReceiptTransactionInput
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid, silakan login kembali." };
  }

  const userId = session.user.id;
  const { accountId, categoryId, amount, date, description, receiptUrl, rawOcrJson } = input;

  if (amount <= 0) {
    return { success: false, message: "Nominal transaksi harus lebih dari 0." };
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Verify account ownership
      const account = await tx.account.findFirst({
        where: { id: accountId, userId, isArchived: false },
      });

      if (!account) {
        throw new Error("Akun sumber pembayaran tidak ditemukan.");
      }

      // 2. Resolve Category (fallback to first expense category if not provided)
      let resolvedCategoryId = categoryId;
      if (!resolvedCategoryId) {
        const defaultCat = await tx.category.findFirst({
          where: {
            OR: [{ userId }, { userId: null, isDefault: true }],
            type: "EXPENSE",
          },
        });
        resolvedCategoryId = defaultCat?.id;
      }

      // 3. Decrement source account balance
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { decrement: amount } },
      });

      // 4. Create Transaction with receipt metadata
      await tx.transaction.create({
        data: {
          userId,
          accountId,
          categoryId: resolvedCategoryId || null,
          type: "EXPENSE",
          amount,
          date: date ? new Date(date) : new Date(),
          description: description || "Struk Belanja AI",
          receiptUrl: receiptUrl || null,
          rawOcrJson: rawOcrJson || null,
        },
      });
    });

    revalidatePath("/transactions");
    revalidatePath("/accounts");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Transaksi dari struk belanja berhasil dicatat dan saldo telah diperbarui!",
    };
  } catch (error) {
    console.error("saveReceiptTransaction error:", error);
    const message = error instanceof Error ? error.message : "Gagal menyimpan transaksi struk.";
    return { success: false, message };
  }
}
