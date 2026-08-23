"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema, RegisterInput } from "./schema";

export interface ActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

// Default initial categories seeded for every new user
const DEFAULT_CATEGORIES = [
  // EXPENSES
  { name: "Makanan & Minuman", type: "EXPENSE" as const, icon: "utensils", color: "#F97316" },
  { name: "Transportasi", type: "EXPENSE" as const, icon: "car", color: "#3B82F6" },
  { name: "Belanja Kebutuhan", type: "EXPENSE" as const, icon: "shopping-bag", color: "#EC4899" },
  { name: "Tagihan & Utilitas", type: "EXPENSE" as const, icon: "zap", color: "#EAB308" },
  { name: "Hiburan & Rekreasi", type: "EXPENSE" as const, icon: "film", color: "#8B5CF6" },
  { name: "Kesehatan", type: "EXPENSE" as const, icon: "heart-pulse", color: "#EF4444" },
  // INCOME
  { name: "Gaji Utama", type: "INCOME" as const, icon: "briefcase", color: "#10B981" },
  { name: "Bisnis / Side Hustle", type: "INCOME" as const, icon: "trending-up", color: "#06B6D4" },
  { name: "Investasi & Dividen", type: "INCOME" as const, icon: "piggy-bank", color: "#14B8A6" },
  { name: "Hadiah & Lainnya", type: "INCOME" as const, icon: "gift", color: "#6366F1" },
];

export async function registerUser(input: RegisterInput): Promise<ActionResult> {
  try {
    const validated = registerSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        message: "Data yang dimasukkan tidak valid",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const { name, email, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return {
        success: false,
        message: "Email sudah terdaftar. Silakan login.",
      };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Atomic creation: User + Default Accounts + Default Categories
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash,
        },
      });

      // Seed starter accounts
      await tx.account.createMany({
        data: [
          {
            userId: user.id,
            name: "Rekening Utama (Bank)",
            type: "BANK",
            balance: 0,
            color: "#2563EB",
            icon: "landmark",
          },
          {
            userId: user.id,
            name: "Dompet Tunai (Cash)",
            type: "CASH",
            balance: 0,
            color: "#D97706",
            icon: "wallet",
          },
          {
            userId: user.id,
            name: "E-Wallet (GoPay/OVO)",
            type: "EWALLET",
            balance: 0,
            color: "#06B6D4",
            icon: "smartphone",
          },
        ],
      });

      // Seed starter categories
      await tx.category.createMany({
        data: DEFAULT_CATEGORIES.map((cat) => ({
          userId: user.id,
          name: cat.name,
          type: cat.type,
          icon: cat.icon,
          color: cat.color,
          isDefault: true,
        })),
      });
    });

    return {
      success: true,
      message: "Akun berhasil dibuat! Silakan masuk.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan server saat mendaftarkan akun.",
    };
  }
}

/**
 * Ensure Pre-seeded Demo/Admin account exists for one-click bypass testing
 */
export async function ensureDemoAdminAccount() {
  // Security Guard: Prevent demo bypass in production unless explicitly allowed by environment config
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_DEMO_LOGIN !== "true") {
    throw new Error("Akses demo dinonaktifkan pada lingkungan produksi.");
  }

  const adminEmail = "admin@financetracker.dev";
  const adminPassword = "adminpassword123";

  try {
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existing) {
      return { email: adminEmail, password: adminPassword };
    }

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: "Admin Developer",
          email: adminEmail,
          passwordHash,
        },
      });

      // Pre-seed demo accounts with realistic balances
      await tx.account.createMany({
        data: [
          {
            userId: user.id,
            name: "BCA Tahapan Utama",
            type: "BANK",
            balance: 15450000,
            color: "#2563EB",
            icon: "landmark",
            accountNumber: "8821",
          },
          {
            userId: user.id,
            name: "Dompet Saku (Cash)",
            type: "CASH",
            balance: 1250000,
            color: "#D97706",
            icon: "wallet",
          },
          {
            userId: user.id,
            name: "GoPay Prioritas",
            type: "EWALLET",
            balance: 780000,
            color: "#06B6D4",
            icon: "smartphone",
            accountNumber: "0812",
          },
          {
            userId: user.id,
            name: "Portofolio Reksadana & Emas",
            type: "INVESTMENT",
            balance: 25000000,
            color: "#10B981",
            icon: "trending-up",
          },
        ],
      });

      // Seed starter categories
      await tx.category.createMany({
        data: DEFAULT_CATEGORIES.map((cat) => ({
          userId: user.id,
          name: cat.name,
          type: cat.type,
          icon: cat.icon,
          color: cat.color,
          isDefault: true,
        })),
      });

      // Seed realistic starter transactions
      const createdAccounts = await tx.account.findMany({ where: { userId: user.id } });
      const createdCategories = await tx.category.findMany({ where: { userId: user.id } });

      const bca = createdAccounts.find((a) => a.name.includes("BCA"));
      const cash = createdAccounts.find((a) => a.name.includes("Cash"));
      const gopay = createdAccounts.find((a) => a.name.includes("GoPay"));

      const catSalary = createdCategories.find((c) => c.name.includes("Gaji"));
      const catFood = createdCategories.find((c) => c.name.includes("Makanan"));
      const catShopping = createdCategories.find((c) => c.name.includes("Belanja"));

      if (bca && catSalary) {
        await tx.transaction.create({
          data: {
            userId: user.id,
            accountId: bca.id,
            categoryId: catSalary.id,
            type: "INCOME",
            amount: 15000000,
            date: new Date(Date.now() - 2 * 86400000), // 2 days ago
            description: "Gaji Bulanan Tech Lead",
          },
        });
      }

      if (gopay && catFood) {
        await tx.transaction.create({
          data: {
            userId: user.id,
            accountId: gopay.id,
            categoryId: catFood.id,
            type: "EXPENSE",
            amount: 45000,
            date: new Date(Date.now() - 86400000), // 1 day ago
            description: "Makan Siang Nasi Padang & Es Teh",
          },
        });
      }

      if (bca && gopay) {
        await tx.transaction.create({
          data: {
            userId: user.id,
            accountId: bca.id,
            targetAccountId: gopay.id,
            type: "TRANSFER",
            amount: 250000,
            date: new Date(Date.now() - 86400000),
            description: "Top-up saldo GoPay dari BCA",
          },
        });
      }

      if (cash && catFood) {
        await tx.transaction.create({
          data: {
            userId: user.id,
            accountId: cash.id,
            categoryId: catFood.id,
            type: "EXPENSE",
            amount: 28000,
            date: new Date(), // Today
            description: "Kopi Kenangan Mantan",
          },
        });
      }

      if (bca && catShopping) {
        await tx.transaction.create({
          data: {
            userId: user.id,
            accountId: bca.id,
            categoryId: catShopping.id,
            type: "EXPENSE",
            amount: 235000,
            date: new Date(), // Today
            description: "Belanja Kebutuhan Mingguan di Superindo",
          },
        });
      }
    });

    return { email: adminEmail, password: adminPassword };
  } catch (error) {
    console.error("ensureDemoAdminAccount error:", error);
    return { email: adminEmail, password: adminPassword };
  }
}
