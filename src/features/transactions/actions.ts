"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  createTransactionSchema,
  updateTransactionSchema,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilterInput,
  CsvTransactionRow,
} from "./schema";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface TransactionWithRelations {
  id: string;
  userId: string;
  accountId: string;
  targetAccountId?: string | null;
  categoryId?: string | null;
  type: string;
  amount: number;
  date: Date;
  description?: string | null;
  receiptUrl?: string | null;
  account: {
    id: string;
    name: string;
    type: string;
    color?: string | null;
  };
  targetAccount?: {
    id: string;
    name: string;
    type: string;
    color?: string | null;
  } | null;
  category?: {
    id: string;
    name: string;
    icon?: string | null;
    color?: string | null;
  } | null;
}

/**
 * Fetch filtered transactions and summary analytics
 */
export async function getTransactionsData(filters?: TransactionFilterInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      transactions: [] as TransactionWithRelations[],
      summary: { totalIncome: 0, totalExpense: 0, netCashflow: 0, count: 0 },
      accounts: [],
      categories: [],
    };
  }

  const userId = session.user.id;

  // Build Prisma Where Clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { userId };

  if (filters?.accountId) {
    where.OR = [
      { accountId: filters.accountId },
      { targetAccountId: filters.accountId },
    ];
  }

  if (filters?.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters?.type && filters.type !== "ALL") {
    where.type = filters.type;
  }

  if (filters?.search) {
    where.description = {
      contains: filters.search,
    };
  }

  if (filters?.startDate || filters?.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      where.date.lte = end;
    }
  }

  const [rawTransactions, accounts, categories] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        account: {
          select: { id: true, name: true, type: true, color: true },
        },
        targetAccount: {
          select: { id: true, name: true, type: true, color: true },
        },
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    }),
    prisma.account.findMany({
      where: { userId, isArchived: false },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, type: true, balance: true, color: true },
    }),
    prisma.category.findMany({
      where: {
        OR: [{ userId }, { userId: null, isDefault: true }],
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, type: true, icon: true, color: true },
    }),
  ]);

  let totalIncome = 0;
  let totalExpense = 0;

  const transactions: TransactionWithRelations[] = rawTransactions.map((tx) => {
    const numAmount = Number(tx.amount);
    if (tx.type === "INCOME") {
      totalIncome += numAmount;
    } else if (tx.type === "EXPENSE") {
      totalExpense += numAmount;
    }

    return {
      ...tx,
      amount: numAmount,
    };
  });

  const netCashflow = totalIncome - totalExpense;

  const sanitizedAccounts = accounts.map((acc) => ({
    ...acc,
    balance: Number(acc.balance),
  }));

  return {
    transactions,
    summary: {
      totalIncome,
      totalExpense,
      netCashflow,
      count: transactions.length,
    },
    accounts: sanitizedAccounts,
    categories,
  };
}

/**
 * Create a new Transaction (EXPENSE, INCOME, or TRANSFER) with Atomic Balance Update
 */
export async function createTransaction(input: CreateTransactionInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid, silakan login kembali." };
  }

  const validated = createTransactionSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: "Data transaksi tidak valid",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { accountId, targetAccountId, categoryId, type, amount, date, description, receiptUrl } = validated.data;
  const userId = session.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Verify source account exists and belongs to user
      const source = await tx.account.findFirst({
        where: { id: accountId, userId, isArchived: false },
      });

      if (!source) {
        throw new Error("Akun sumber dana tidak ditemukan.");
      }

      // 2. Intelligent Auto-Sync: If category is provided, align type with category's actual type
      let finalType = type;
      if (categoryId && type !== "TRANSFER") {
        const cat = await tx.category.findFirst({
          where: {
            id: categoryId,
            OR: [{ userId }, { userId: null, isDefault: true }],
          },
        });
        if (cat) {
          finalType = cat.type as "INCOME" | "EXPENSE" | "TRANSFER";
        }
      }

      // 3. Execute Balance Mutations according to Transaction Type
      if (finalType === "EXPENSE") {
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { decrement: amount } },
        });
      } else if (finalType === "INCOME") {
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: amount } },
        });
      } else if (finalType === "TRANSFER") {
        if (!targetAccountId) {
          throw new Error("Akun tujuan transfer wajib dipilih.");
        }

        const target = await tx.account.findFirst({
          where: { id: targetAccountId, userId, isArchived: false },
        });

        if (!target) {
          throw new Error("Akun tujuan transfer tidak ditemukan.");
        }

        // Decrement source & Increment target
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { decrement: amount } },
        });
        await tx.account.update({
          where: { id: targetAccountId },
          data: { balance: { increment: amount } },
        });
      }

      // 4. Create Transaction Record
      await tx.transaction.create({
        data: {
          userId,
          accountId,
          targetAccountId: finalType === "TRANSFER" ? targetAccountId : null,
          categoryId: finalType !== "TRANSFER" ? categoryId : null,
          type: finalType,
          amount,
          date: date || new Date(),
          description: description || null,
          receiptUrl: receiptUrl || null,
        },
      });
    });

    revalidatePath("/transactions");
    revalidatePath("/accounts");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Transaksi berhasil dicatat & saldo diperbarui!",
    };
  } catch (error: unknown) {
    console.error("createTransaction error:", error);
    const message = error instanceof Error ? error.message : "Gagal mencatat transaksi.";
    return { success: false, message };
  }
}

/**
 * Update an existing Transaction with Automatic Balance Adjustment
 */
export async function updateTransaction(input: UpdateTransactionInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  const validated = updateTransactionSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: "Data transaksi tidak valid",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { id, accountId, targetAccountId, categoryId, type, amount, date, description } = validated.data;
  const userId = session.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Fetch old transaction
      const oldTx = await tx.transaction.findFirst({
        where: { id, userId },
      });

      if (!oldTx) {
        throw new Error("Transaksi tidak ditemukan.");
      }

      const oldAmount = Number(oldTx.amount);

      // 2. Revert old balance mutation
      if (oldTx.type === "EXPENSE") {
        await tx.account.update({
          where: { id: oldTx.accountId },
          data: { balance: { increment: oldAmount } },
        });
      } else if (oldTx.type === "INCOME") {
        await tx.account.update({
          where: { id: oldTx.accountId },
          data: { balance: { decrement: oldAmount } },
        });
      } else if (oldTx.type === "TRANSFER" && oldTx.targetAccountId) {
        await tx.account.update({
          where: { id: oldTx.accountId },
          data: { balance: { increment: oldAmount } },
        });
        await tx.account.update({
          where: { id: oldTx.targetAccountId },
          data: { balance: { decrement: oldAmount } },
        });
      }

      // 3. Intelligent Auto-Sync: If category is provided, align type with category's actual type
      let finalType = type;
      if (categoryId && type !== "TRANSFER") {
        const cat = await tx.category.findFirst({
          where: {
            id: categoryId,
            OR: [{ userId }, { userId: null, isDefault: true }],
          },
        });
        if (cat) {
          finalType = cat.type as "INCOME" | "EXPENSE" | "TRANSFER";
        }
      }

      // 4. Apply new balance mutation
      if (finalType === "EXPENSE") {
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { decrement: amount } },
        });
      } else if (finalType === "INCOME") {
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: amount } },
        });
      } else if (finalType === "TRANSFER" && targetAccountId) {
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { decrement: amount } },
        });
        await tx.account.update({
          where: { id: targetAccountId },
          data: { balance: { increment: amount } },
        });
      }

      // 5. Update transaction row
      await tx.transaction.update({
        where: { id },
        data: {
          accountId,
          targetAccountId: finalType === "TRANSFER" ? targetAccountId : null,
          categoryId: finalType !== "TRANSFER" ? categoryId : null,
          type: finalType,
          amount,
          date,
          description: description || null,
        },
      });
    });

    revalidatePath("/transactions");
    revalidatePath("/accounts");
    revalidatePath("/dashboard");

    return { success: true, message: "Transaksi berhasil diperbarui!" };
  } catch (error: unknown) {
    console.error("updateTransaction error:", error);
    const message = error instanceof Error ? error.message : "Gagal memperbarui transaksi.";
    return { success: false, message };
  }
}

/**
 * Delete a Transaction and safely Refund/Rollback Account Balance
 */
export async function deleteTransaction(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  const userId = session.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        throw new Error("Transaksi tidak ditemukan.");
      }

      const amount = Number(existing.amount);

      // Refund/Rollback account balance
      if (existing.type === "EXPENSE") {
        await tx.account.update({
          where: { id: existing.accountId },
          data: { balance: { increment: amount } },
        });
      } else if (existing.type === "INCOME") {
        await tx.account.update({
          where: { id: existing.accountId },
          data: { balance: { decrement: amount } },
        });
      } else if (existing.type === "TRANSFER" && existing.targetAccountId) {
        await tx.account.update({
          where: { id: existing.accountId },
          data: { balance: { increment: amount } },
        });
        await tx.account.update({
          where: { id: existing.targetAccountId },
          data: { balance: { decrement: amount } },
        });
      }

      // Delete record
      await tx.transaction.delete({
        where: { id },
      });
    });

    revalidatePath("/transactions");
    revalidatePath("/accounts");
    revalidatePath("/dashboard");

    return { success: true, message: "Transaksi berhasil dihapus dan saldo telah dipulihkan." };
  } catch (error: unknown) {
    console.error("deleteTransaction error:", error);
    const message = error instanceof Error ? error.message : "Gagal menghapus transaksi.";
    return { success: false, message };
  }
}

/**
 * Bulk Import Parsed CSV Mutations
 */
export async function importBulkTransactions(
  accountId: string,
  rows: CsvTransactionRow[]
): Promise<ActionResult<{ importedCount: number }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  const userId = session.user.id;

  if (rows.length === 0) {
    return { success: false, message: "Tidak ada transaksi untuk diimpor." };
  }

  try {
    let netAdjustment = 0;

    await prisma.$transaction(async (tx) => {
      // 1. Verify target account
      const account = await tx.account.findFirst({
        where: { id: accountId, userId, isArchived: false },
      });

      if (!account) {
        throw new Error("Akun tujuan mutasi tidak ditemukan.");
      }

      // 2. Fetch categories for auto-mapping
      const allCategories = await tx.category.findMany({
        where: {
          OR: [{ userId }, { userId: null, isDefault: true }],
        },
      });

      const categoryMap = new Map(allCategories.map((c) => [c.name.toLowerCase(), c.id]));
      const defaultExpenseCat = allCategories.find((c) => c.type === "EXPENSE")?.id || null;
      const defaultIncomeCat = allCategories.find((c) => c.type === "INCOME")?.id || null;

      // 3. Prepare transaction records
      for (const row of rows) {
        let matchedCategoryId: string | null = null;
        if (row.suggestedCategoryId) {
          matchedCategoryId = categoryMap.get(row.suggestedCategoryId.toLowerCase()) || null;
        }
        if (!matchedCategoryId) {
          matchedCategoryId = row.type === "INCOME" ? defaultIncomeCat : defaultExpenseCat;
        }

        if (row.type === "INCOME") {
          netAdjustment += row.amount;
        } else {
          netAdjustment -= row.amount;
        }

        await tx.transaction.create({
          data: {
            userId,
            accountId,
            categoryId: matchedCategoryId,
            type: row.type,
            amount: row.amount,
            date: new Date(row.date),
            description: row.description,
          },
        });
      }

      // 4. Update total account balance atomically
      await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: netAdjustment,
          },
        },
      });
    });

    revalidatePath("/transactions");
    revalidatePath("/accounts");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Berhasil mengimpor ${rows.length} mutasi transaksi secara instan!`,
      data: { importedCount: rows.length },
    };
  } catch (error: unknown) {
    console.error("importBulkTransactions error:", error);
    const message = error instanceof Error ? error.message : "Gagal mengimpor mutasi CSV.";
    return { success: false, message };
  }
}
