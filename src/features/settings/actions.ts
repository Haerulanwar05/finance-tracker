"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export interface SettingsData {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    monthlySpendingLimit: number;
    hasPassword: boolean;
    createdAt: string;
  };
  stats: {
    accountsCount: number;
    transactionsCount: number;
    goalsCount: number;
  };
  categories: Array<{
    id: string;
    name: string;
    type: string;
    icon: string | null;
    color: string | null;
    isDefault: boolean;
    _count?: {
      transactions: number;
    };
  }>;
}

export async function getSettingsData(): Promise<SettingsData> {
  const session = await auth();
  let userId = session?.user?.id;

  if (!userId && session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: { id: true },
    });
    if (dbUser) userId = dbUser.id;
  }

  let user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          monthlySpendingLimit: true,
          passwordHash: true,
          createdAt: true,
        },
      })
    : null;

  if (!user && session?.user?.email) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        monthlySpendingLimit: true,
        passwordHash: true,
        createdAt: true,
      },
    });
    if (user) userId = user.id;
  }

  if (!user || !userId) {
    return {
      user: {
        id: userId || "anonymous",
        name: session?.user?.name || "Pengguna",
        email: session?.user?.email || null,
        monthlySpendingLimit: 5000000,
        hasPassword: false,
        createdAt: new Date().toISOString(),
      },
      stats: {
        accountsCount: 0,
        transactionsCount: 0,
        goalsCount: 0,
      },
      categories: [],
    };
  }

  const [accountsCount, transactionsCount, goalsCount, categoriesRaw] = await Promise.all([
    prisma.account.count({ where: { userId, isArchived: false } }),
    prisma.transaction.count({ where: { userId } }),
    prisma.goalVault.count({ where: { userId } }),
    prisma.category.findMany({
      where: {
        OR: [{ userId }, { userId: null, isDefault: true }],
      },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    }),
  ]);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      monthlySpendingLimit: Number(user.monthlySpendingLimit) || 0,
      hasPassword: Boolean(user.passwordHash),
      createdAt: user.createdAt.toISOString(),
    },
    stats: {
      accountsCount,
      transactionsCount,
      goalsCount,
    },
    categories: categoriesRaw.map((c: {
      id: string;
      name: string;
      type: string;
      icon: string | null;
      color: string | null;
      isDefault: boolean;
      _count: { transactions: number };
    }) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      icon: c.icon,
      color: c.color,
      isDefault: c.isDefault,
      _count: {
        transactions: c._count.transactions,
      },
    })),
  };
}

export async function updateProfile(formData: {
  name: string;
  monthlySpendingLimit: number;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  const cleanName = formData.name.trim();
  const cleanLimit = Math.max(0, Math.round(Number(formData.monthlySpendingLimit) || 0));

  if (!cleanName) {
    return { success: false, message: "Nama tidak boleh kosong." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: cleanName,
        monthlySpendingLimit: cleanLimit,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    revalidatePath("/analytics");

    return { success: true, message: "Profil dan preferensi berhasil disimpan." };
  } catch {
    return { success: false, message: "Gagal memperbarui profil." };
  }
}

export async function createCustomCategory(data: {
  name: string;
  type: "INCOME" | "EXPENSE";
  color: string;
  icon: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  const cleanName = data.name.trim();
  if (!cleanName) {
    return { success: false, message: "Nama kategori wajib diisi." };
  }

  try {
    await prisma.category.create({
      data: {
        userId: session.user.id,
        name: cleanName,
        type: data.type,
        color: data.color || "#3B82F6",
        icon: data.icon || "tag",
        isDefault: false,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/transactions");
    revalidatePath("/dashboard");

    return { success: true, message: "Kategori baru berhasil ditambahkan." };
  } catch {
    return { success: false, message: "Gagal menambahkan kategori." };
  }
}

export async function deleteCustomCategory(categoryId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Sesi tidak valid." };
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || category.userId !== session.user.id) {
      return { success: false, message: "Kategori tidak ditemukan atau tidak dapat dihapus." };
    }

    if (category.isDefault) {
      return { success: false, message: "Kategori bawaan sistem tidak dapat dihapus." };
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/settings");
    revalidatePath("/transactions");
    revalidatePath("/dashboard");

    return { success: true, message: "Kategori berhasil dihapus." };
  } catch {
    return { success: false, message: "Gagal menghapus kategori." };
  }
}

export async function setUserPassword(newPassword: string): Promise<{ success: boolean; message: string }> {
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
    return { success: false, message: "Sesi tidak valid. Silakan login kembali." };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: "Password minimal harus 6 karakter." };
  }

  try {
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    revalidatePath("/settings");
    return {
      success: true,
      message: "Kata sandi berhasil disimpan! Anda sekarang bisa masuk menggunakan email & kata sandi ini.",
    };
  } catch (e) {
    console.error("Error setting user password:", e);
    return { success: false, message: "Gagal menyimpan kata sandi. Silakan coba lagi." };
  }
}

