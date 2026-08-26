"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import {
  createGoalSchema,
  updateGoalSchema,
  allocateFundsSchema,
  withdrawFundsSchema,
  CreateGoalInput,
  UpdateGoalInput,
  AllocateFundsInput,
  WithdrawFundsInput,
} from "./schema";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface GoalVaultWithRelations {
  id: string;
  userId: string;
  linkedAccountId: string | null;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  color: string | null;
  icon: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  linkedAccount?: {
    id: string;
    name: string;
    type: string;
    balance: number;
  } | null;
  allocations?: Array<{
    id: string;
    amount: number;
    type: string;
    date: Date;
    note: string | null;
  }>;
}

/**
 * Fetch all goal vaults, summary metrics, and active accounts for the authenticated user
 */
export async function getGoalsData() {
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
    return {
      goals: [] as GoalVaultWithRelations[],
      summary: {
        totalTarget: 0,
        totalSaved: 0,
        overallProgress: 0,
        activeCount: 0,
        achievedCount: 0,
      },
      accounts: [],
    };
  }

  const [rawGoals, accounts] = await Promise.all([
    prisma.goalVault.findMany({
      where: { userId },
      include: {
        linkedAccount: {
          select: { id: true, name: true, type: true, balance: true },
        },
        allocations: {
          orderBy: { date: "desc" },
          take: 5,
          select: { id: true, amount: true, type: true, date: true, note: true },
        },
      },
      orderBy: [{ status: "asc" }, { deadline: "asc" }, { createdAt: "desc" }],
    }),
    prisma.account.findMany({
      where: { userId, isArchived: false },
      select: { id: true, name: true, type: true, balance: true, color: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  let totalTarget = 0;
  let totalSaved = 0;
  let activeCount = 0;
  let achievedCount = 0;

  const goals: GoalVaultWithRelations[] = rawGoals.map((g: {
    id: string;
    userId: string;
    linkedAccountId: string | null;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date | null;
    color: string | null;
    icon: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    linkedAccount?: { id: string; name: string; type: string; balance: number } | null;
    allocations?: Array<{ id: string; amount: number; type: string; date: Date; note: string | null }>;
  }) => {
    totalTarget += g.targetAmount;
    totalSaved += g.currentAmount;
    if (g.status === "ACHIEVED" || g.currentAmount >= g.targetAmount) {
      achievedCount++;
    } else {
      activeCount++;
    }

    return {
      ...g,
    };
  });

  const overallProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  return {
    goals,
    summary: {
      totalTarget,
      totalSaved,
      overallProgress,
      activeCount,
      achievedCount,
    },
    accounts,
  };
}

/**
 * Create a new Goal Vault
 */
export async function createGoal(input: CreateGoalInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  const validated = createGoalSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message || "Data target tidak valid.",
    };
  }

  const userId = session.user.id;
  const { name, targetAmount, linkedAccountId, deadline, color, icon } = validated.data;

  try {
    // If linked account is specified, verify ownership
    if (linkedAccountId) {
      const acc = await prisma.account.findFirst({
        where: { id: linkedAccountId, userId },
      });
      if (!acc) {
        return { success: false, message: "Rekening terhubung tidak ditemukan." };
      }
    }

    await prisma.goalVault.create({
      data: {
        userId,
        name,
        targetAmount,
        currentAmount: 0,
        linkedAccountId: linkedAccountId || null,
        deadline: deadline ? new Date(deadline) : null,
        color: color || "#3B82F6",
        icon: icon || "piggy",
        status: "ACTIVE",
      },
    });

    revalidatePath("/", "layout");

    return { success: true, message: `Target tabungan "${name}" berhasil dibuat!` };
  } catch (error) {
    console.error("createGoal error:", error);
    return { success: false, message: "Gagal membuat target tabungan." };
  }
}

/**
 * Update an existing Goal Vault
 */
export async function updateGoal(input: UpdateGoalInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  const validated = updateGoalSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message || "Data input tidak valid.",
    };
  }

  const userId = session.user.id;
  const { id, name, targetAmount, deadline, color, icon, status, linkedAccountId } =
    validated.data;

  try {
    const existing = await prisma.goalVault.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return { success: false, message: "Target tabungan tidak ditemukan." };
    }

    const resolvedTargetAmount =
      targetAmount !== undefined ? targetAmount : existing.targetAmount;
    const resolvedCurrentAmount = existing.currentAmount;

    let resolvedStatus = status || existing.status;
    if (resolvedCurrentAmount >= resolvedTargetAmount && resolvedStatus === "ACTIVE") {
      resolvedStatus = "ACHIEVED";
    }

    await prisma.goalVault.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(targetAmount !== undefined && { targetAmount }),
        ...(linkedAccountId !== undefined && { linkedAccountId }),
        deadline: deadline ? new Date(deadline) : deadline === null ? null : undefined,
        color: color || "#3B82F6",
        icon: icon || "piggy",
        status: resolvedStatus,
      },
    });

    revalidatePath("/", "layout");

    return { success: true, message: "Target tabungan berhasil diperbarui!" };
  } catch (error) {
    console.error("updateGoal error:", error);
    return { success: false, message: "Gagal memperbarui target tabungan." };
  }
}

/**
 * Delete a Goal Vault (Cascades allocations)
 */
export async function deleteGoal(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  const userId = session.user.id;

  try {
    const existing = await prisma.goalVault.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return { success: false, message: "Target tabungan tidak ditemukan." };
    }

    // Delete vault and cascading allocations
    await prisma.goalVault.delete({
      where: { id },
    });

    revalidatePath("/", "layout");

    return { success: true, message: `Target "${existing.name}" berhasil dihapus.` };
  } catch (error) {
    console.error("deleteGoal error:", error);
    return { success: false, message: "Gagal menghapus target tabungan." };
  }
}

/**
 * Deposit / Allocate funds from Account into Goal Vault (Atomic ACID Transaction)
 */
export async function depositToVault(input: AllocateFundsInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  const validated = allocateFundsSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message || "Data alokasi tidak valid.",
    };
  }

  const userId = session.user.id;
  const { vaultId, sourceAccountId, amount, note } = validated.data;

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Verify Account and Goal Vault concurrently
      const [account, vault] = await Promise.all([
        tx.account.findFirst({
          where: { id: sourceAccountId, userId, isArchived: false },
        }),
        tx.goalVault.findFirst({
          where: { id: vaultId, userId },
        }),
      ]);

      if (!account) {
        throw new Error("Rekening sumber tidak ditemukan atau sedang diarsipkan.");
      }

      if (account.balance < amount) {
        throw new Error(
          `Saldo ${account.name} tidak mencukupi (Tersedia: Rp ${account.balance.toLocaleString("id-ID")}, Dibutuhkan: Rp ${amount.toLocaleString("id-ID")}).`
        );
      }

      if (!vault) {
        throw new Error("Target tabungan tidak ditemukan.");
      }

      const newCurrentAmount = vault.currentAmount + amount;
      const isAchieved = newCurrentAmount >= vault.targetAmount;

      // 2. Decrement account, increment vault, and create allocation log in parallel
      await Promise.all([
        tx.account.update({
          where: { id: sourceAccountId },
          data: { balance: { decrement: amount } },
        }),
        tx.goalVault.update({
          where: { id: vaultId },
          data: {
            currentAmount: { increment: amount },
            status: isAchieved ? "ACHIEVED" : vault.status,
          },
        }),
        tx.vaultAllocation.create({
          data: {
            vaultId,
            amount,
            type: "DEPOSIT",
            note: note || `Alokasi dari ${account.name}`,
          },
        }),
      ]);
    });

    revalidatePath("/", "layout");

    return {
      success: true,
      message: `Berhasil menabung Rp ${amount.toLocaleString("id-ID")} ke dalam target!`,
    };
  } catch (error) {
    console.error("depositToVault error:", error);
    const message = error instanceof Error ? error.message : "Gagal mengalokasikan tabungan.";
    return { success: false, message };
  }
}

/**
 * Withdraw funds from Goal Vault back to Account balance (Atomic ACID Transaction)
 */
export async function withdrawFromVault(input: WithdrawFundsInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  const validated = withdrawFundsSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message || "Data penarikan tidak valid.",
    };
  }

  const userId = session.user.id;
  const { vaultId, targetAccountId, amount, note } = validated.data;

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Verify Goal Vault and Target Account concurrently
      const [vault, account] = await Promise.all([
        tx.goalVault.findFirst({
          where: { id: vaultId, userId },
        }),
        tx.account.findFirst({
          where: { id: targetAccountId, userId, isArchived: false },
        }),
      ]);

      if (!vault) {
        throw new Error("Target tabungan tidak ditemukan.");
      }

      if (vault.currentAmount < amount) {
        throw new Error(
          `Saldo terkumpul pada target ini tidak mencukupi (Terkumpul: Rp ${vault.currentAmount.toLocaleString("id-ID")}, Penarikan: Rp ${amount.toLocaleString("id-ID")}).`
        );
      }

      if (!account) {
        throw new Error("Rekening tujuan penarikan tidak ditemukan.");
      }

      const newCurrentAmount = vault.currentAmount - amount;
      const shouldReactivate = newCurrentAmount < vault.targetAmount && vault.status === "ACHIEVED";

      // 2. Decrement vault, increment account, and log allocation in parallel
      await Promise.all([
        tx.goalVault.update({
          where: { id: vaultId },
          data: {
            currentAmount: { decrement: amount },
            status: shouldReactivate ? "ACTIVE" : vault.status,
          },
        }),
        tx.account.update({
          where: { id: targetAccountId },
          data: { balance: { increment: amount } },
        }),
        tx.vaultAllocation.create({
          data: {
            vaultId,
            amount,
            type: "WITHDRAW",
            note: note || `Penarikan ke ${account.name}`,
          },
        }),
      ]);
    });

    revalidatePath("/", "layout");

    return {
      success: true,
      message: `Berhasil menarik Rp ${amount.toLocaleString("id-ID")} ke rekening tujuan!`,
    };
  } catch (error) {
    console.error("withdrawFromVault error:", error);
    const message = error instanceof Error ? error.message : "Gagal menarik dana tabungan.";
    return { success: false, message };
  }
}
