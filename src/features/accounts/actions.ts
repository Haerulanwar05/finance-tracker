"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  createAccountSchema,
  updateAccountSchema,
  transferSchema,
  CreateAccountInput,
  UpdateAccountInput,
  TransferInput,
} from "./schema";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Get all active and archived accounts for the logged-in user + Net Worth calculation
 */
export async function getAccountsData() {
  const session = await auth();
  let userId = session?.user?.id;

  if (!userId && session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: { id: true },
    });
    if (dbUser) userId = dbUser.id;
  }

  if (!userId) {
    return { accounts: [], archivedAccounts: [], netWorth: 0 };
  }

  const [activeAccounts, archivedAccounts] = await Promise.all([
    prisma.account.findMany({
      where: {
        userId,
        isArchived: false,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.account.findMany({
      where: {
        userId,
        isArchived: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
  ]);

  const netWorth = activeAccounts.reduce((acc, curr) => acc + Number(curr.balance), 0);

  const mapAccount = (acc: (typeof activeAccounts)[0]) => ({
    id: acc.id,
    name: acc.name,
    type: acc.type,
    balance: Number(acc.balance),
    color: acc.color,
    icon: acc.icon,
    accountNumber: acc.accountNumber,
    isArchived: acc.isArchived,
  });

  return {
    accounts: activeAccounts.map(mapAccount),
    archivedAccounts: archivedAccounts.map(mapAccount),
    netWorth,
  };
}

/**
 * Restore / Unarchive an Account
 */
export async function unarchiveAccount(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    const existing = await prisma.account.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return { success: false, message: "Akun tidak ditemukan." };
    }

    await prisma.account.update({
      where: { id },
      data: { isArchived: false },
    });

    revalidatePath("/accounts");
    revalidatePath("/dashboard");

    return { success: true, message: `Akun "${existing.name}" berhasil dipulihkan.` };
  } catch (error) {
    console.error("unarchiveAccount error:", error);
    return { success: false, message: "Gagal memulihkan akun." };
  }
}

/**
 * Create a new Asset/Bank/E-Wallet Account
 */
export async function createAccount(input: CreateAccountInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid, silakan login kembali." };
  }

  const validated = createAccountSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: "Data akun tidak valid",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const account = await prisma.account.create({
      data: {
        userId: session.user.id,
        name: validated.data.name,
        type: validated.data.type,
        balance: validated.data.balance,
        color: validated.data.color,
        icon: validated.data.icon,
        accountNumber: validated.data.accountNumber || null,
      },
    });

    revalidatePath("/accounts");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Akun ${account.name} berhasil ditambahkan!`,
      data: account,
    };
  } catch (error) {
    console.error("createAccount error:", error);
    return { success: false, message: "Gagal menyimpan akun baru." };
  }
}

/**
 * Update an existing Account
 */
export async function updateAccount(input: UpdateAccountInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid, silakan login kembali." };
  }

  const validated = updateAccountSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: "Data update tidak valid",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const existing = await prisma.account.findFirst({
      where: { id: validated.data.id, userId: session.user.id },
    });

    if (!existing) {
      return { success: false, message: "Akun tidak ditemukan atau bukan milik Anda." };
    }

    const updated = await prisma.account.update({
      where: { id: validated.data.id },
      data: {
        ...(validated.data.name && { name: validated.data.name }),
        ...(validated.data.type && { type: validated.data.type }),
        ...(validated.data.color && { color: validated.data.color }),
        ...(validated.data.icon && { icon: validated.data.icon }),
        ...(validated.data.accountNumber !== undefined && { accountNumber: validated.data.accountNumber }),
      },
    });

    revalidatePath("/accounts");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Akun ${updated.name} berhasil diperbarui!`,
      data: updated,
    };
  } catch (error) {
    console.error("updateAccount error:", error);
    return { success: false, message: "Gagal memperbarui data akun." };
  }
}

/**
 * Archive (Soft-delete) an Account
 */
export async function archiveAccount(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    const existing = await prisma.account.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return { success: false, message: "Akun tidak ditemukan." };
    }

    await prisma.account.update({
      where: { id },
      data: { isArchived: true },
    });

    revalidatePath("/accounts");
    revalidatePath("/dashboard");

    return { success: true, message: "Akun berhasil diarsipkan." };
  } catch (error) {
    console.error("archiveAccount error:", error);
    return { success: false, message: "Gagal mengarsipkan akun." };
  }
}

/**
 * Hard Delete an Account and ALL its Related Transactions
 * Cascades to:
 * 1. All Transactions where accountId === id OR targetAccountId === id
 * 2. Unlinks any GoalVault connected to this account
 * 3. Deletes the Account record
 */
export async function deleteAccount(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  const userId = session.user.id;

  try {
    const existing = await prisma.account.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return { success: false, message: "Akun tidak ditemukan." };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete all transactions involving this account (source or target)
      await tx.transaction.deleteMany({
        where: {
          userId,
          OR: [{ accountId: id }, { targetAccountId: id }],
        },
      });

      // 2. Unlink GoalVaults
      await tx.goalVault.updateMany({
        where: { userId, linkedAccountId: id },
        data: { linkedAccountId: null },
      });

      // 3. Delete the account
      await tx.account.delete({
        where: { id },
      });
    });

    revalidatePath("/accounts");
    revalidatePath("/transactions");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Akun "${existing.name}" dan seluruh transaksi terkait berhasil dihapus permanen.`,
    };
  } catch (error) {
    console.error("deleteAccount error:", error);
    return { success: false, message: "Gagal menghapus akun dan transaksi terkait." };
  }
}

/**
 * Atomic Inter-Account Transfer
 * Uses prisma.$transaction to guarantee ACID consistency:
 * 1. Decrement source account
 * 2. Increment target account
 * 3. Create TRANSFER transaction record
 */
export async function transferFunds(input: TransferInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid, silakan login kembali." };
  }
  const userId = session.user.id;

  const validated = transferSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: "Data transfer tidak valid",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { sourceAccountId, targetAccountId, amount, date, description } = validated.data;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Fetch & verify source account
      const source = await tx.account.findFirst({
        where: { id: sourceAccountId, userId, isArchived: false },
      });

      if (!source) {
        throw new Error("Akun sumber dana tidak ditemukan.");
      }

      if (Number(source.balance) < amount) {
        throw new Error(`Saldo akun ${source.name} tidak mencukupi untuk transfer ini.`);
      }

      // 2. Fetch & verify target account
      const target = await tx.account.findFirst({
        where: { id: targetAccountId, userId, isArchived: false },
      });

      if (!target) {
        throw new Error("Akun tujuan transfer tidak ditemukan.");
      }

      // 3. Decrement source
      await tx.account.update({
        where: { id: sourceAccountId },
        data: { balance: { decrement: amount } },
      });

      // 4. Increment target
      await tx.account.update({
        where: { id: targetAccountId },
        data: { balance: { increment: amount } },
      });

      // 5. Create TRANSFER transaction log
      await tx.transaction.create({
        data: {
          userId,
          accountId: sourceAccountId,
          targetAccountId: targetAccountId,
          type: "TRANSFER",
          amount: amount,
          date: date || new Date(),
          description: description || `Transfer dari ${source.name} ke ${target.name}`,
        },
      });
    });

    revalidatePath("/accounts");
    revalidatePath("/dashboard");
    revalidatePath("/transactions");

    return {
      success: true,
      message: "Transfer saldo berhasil dieksekusi secara aman!",
    };
  } catch (error: unknown) {
    console.error("transferFunds error:", error);
    const message = error instanceof Error ? error.message : "Gagal melakukan transfer saldo.";
    return {
      success: false,
      message,
    };
  }
}
