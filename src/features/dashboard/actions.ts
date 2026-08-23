"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface MonthlyCashflowPoint {
  month: string;
  pemasukan: number;
  pengeluaran: number;
  arusKasBersih: number;
}

export interface CategoryExpensePoint {
  name: string;
  amount: number;
  color: string;
  percentage: number;
  count?: number;
  avgPerTx?: number;
}

export interface RecentTransactionItem {
  id: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  date: string;
  description: string;
  receiptUrl?: string | null;
  category?: {
    name: string;
    icon?: string | null;
    color?: string | null;
  } | null;
  account: {
    name: string;
    type: string;
  };
}

export interface TopGoalItem {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  progressPercentage: number;
  color: string;
  icon: string;
  deadline?: string | null;
  status: string;
}

export interface MonthlySpendingBudgetInfo {
  monthlyLimit: number;
  monthlySpent: number;
  monthlyRemaining: number;
  usagePercentage: number;
  dailySafeAmount: number;
  daysRemaining: number;
  status: "SAFE" | "WARNING" | "CRITICAL";
  isCustom: boolean;
}

export interface DashboardAnalyticsData {
  netWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
  prevMonthIncome: number;
  prevMonthExpense: number;
  incomeGrowthPct: number;
  expenseGrowthPct: number;
  savingsRate: number;
  healthScore: number;
  healthGrade: string;
  avgDailySpend: number;
  totalGoalSavings: number;
  monthlyBudget: MonthlySpendingBudgetInfo;
  safeToSpend: {
    dailyAmount: number;
    monthlyRemaining: number;
    daysRemaining: number;
    status: "SAFE" | "WARNING" | "CRITICAL";
  };
  cashflowTrend: MonthlyCashflowPoint[];
  categoryExpenses: CategoryExpensePoint[];
  recentTransactions: RecentTransactionItem[];
  topGoals: TopGoalItem[];
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    balance: number;
    color?: string | null;
  }>;
  categories: Array<{
    id: string;
    name: string;
    type: string;
    icon?: string | null;
    color?: string | null;
  }>;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];

export async function getDashboardAnalyticsData(): Promise<DashboardAnalyticsData> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const now = new Date();

  // Current month range
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = Math.max(1, totalDaysInMonth - currentDay + 1);

  // Previous month range
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  // 6 months ago range for trend chart
  const startOfSixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  // 1. Fetch Accounts
  const accountsRaw = await prisma.account.findMany({
    where: { userId, isArchived: false },
    orderBy: { createdAt: "asc" },
  });

  const accounts = accountsRaw.map((acc) => ({
    id: acc.id,
    name: acc.name,
    type: acc.type,
    balance: Number(acc.balance),
    color: acc.color,
  }));

  const netWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // 2. Fetch Goals for Safe-to-Spend allocation
  const goalsRaw = await prisma.goalVault.findMany({
    where: { userId },
    orderBy: { currentAmount: "desc" },
  });

  const topGoals: TopGoalItem[] = goalsRaw.slice(0, 3).map((g) => {
    const target = Number(g.targetAmount);
    const current = Number(g.currentAmount);
    const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    return {
      id: g.id,
      name: g.name,
      targetAmount: target,
      currentAmount: current,
      progressPercentage: progress,
      color: g.color || "#3B82F6",
      icon: g.icon || "shield",
      deadline: g.deadline ? g.deadline.toISOString() : null,
      status: g.status,
    };
  });

  const totalGoalSavings = goalsRaw.reduce((sum, g) => sum + Number(g.currentAmount), 0);

  // 3. Fetch Transactions for 6 Months
  const transactionsRaw = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startOfSixMonthsAgo },
    },
    include: {
      category: true,
      account: true,
    },
    orderBy: { date: "desc" },
  });

  // Current Month Income & Expense
  let monthlyIncome = 0;
  let monthlyExpense = 0;

  // Previous Month Income & Expense
  let prevMonthIncome = 0;
  let prevMonthExpense = 0;

  // Category Expense map for current month
  const categoryExpenseMap = new Map<
    string,
    { name: string; color: string; amount: number; count: number }
  >();

  // 6-Month Cashflow Buckets
  const monthlyBuckets = new Map<string, { income: number; expense: number }>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyBuckets.set(key, { income: 0, expense: 0 });
  }

  for (const tx of transactionsRaw) {
    const txDate = new Date(tx.date);
    const amount = Number(tx.amount);

    // Current Month calculation
    if (txDate >= startOfCurrentMonth && txDate <= endOfCurrentMonth) {
      if (tx.type === "INCOME") {
        monthlyIncome += amount;
      } else if (tx.type === "EXPENSE") {
        monthlyExpense += amount;
        const catName = tx.category?.name || "Lainnya";
        const catColor = tx.category?.color || "#6B7280";
        const existing = categoryExpenseMap.get(catName) || {
          name: catName,
          color: catColor,
          amount: 0,
          count: 0,
        };
        existing.amount += amount;
        existing.count += 1;
        categoryExpenseMap.set(catName, existing);
      }
    }

    // Previous Month calculation
    if (txDate >= startOfPrevMonth && txDate <= endOfPrevMonth) {
      if (tx.type === "INCOME") {
        prevMonthIncome += amount;
      } else if (tx.type === "EXPENSE") {
        prevMonthExpense += amount;
      }
    }

    // 6-Month trend aggregation
    const monthKey = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyBuckets.has(monthKey)) {
      const bucket = monthlyBuckets.get(monthKey)!;
      if (tx.type === "INCOME") {
        bucket.income += amount;
      } else if (tx.type === "EXPENSE") {
        bucket.expense += amount;
      }
    }
  }

  // Growth percentages vs last month
  const incomeGrowthPct = prevMonthIncome > 0
    ? Math.round(((monthlyIncome - prevMonthIncome) / prevMonthIncome) * 100)
    : monthlyIncome > 0 ? 100 : 0;

  const expenseGrowthPct = prevMonthExpense > 0
    ? Math.round(((monthlyExpense - prevMonthExpense) / prevMonthExpense) * 100)
    : monthlyExpense > 0 ? 100 : 0;

  // Format 6-Month Cashflow Trend Array
  const cashflowTrend: MonthlyCashflowPoint[] = [];
  monthlyBuckets.forEach((data, key) => {
    const [, monthStr] = key.split("-");
    const monthIndex = parseInt(monthStr, 10) - 1;
    cashflowTrend.push({
      month: MONTH_NAMES[monthIndex],
      pemasukan: data.income,
      pengeluaran: data.expense,
      arusKasBersih: data.income - data.expense,
    });
  });

  // Format Category Expense Points with percentage, count, and average
  const totalCategoryExpense = Array.from(categoryExpenseMap.values()).reduce((sum, c) => sum + c.amount, 0);
  const categoryExpenses: CategoryExpensePoint[] = Array.from(categoryExpenseMap.values())
    .sort((a, b) => b.amount - a.amount)
    .map((c) => ({
      name: c.name,
      amount: c.amount,
      color: c.color,
      percentage: totalCategoryExpense > 0 ? Math.round((c.amount / totalCategoryExpense) * 100) : 0,
      count: c.count,
      avgPerTx: c.count > 0 ? Math.round(c.amount / c.count) : 0,
    }));

  // Calculate Savings Rate & Health Score
  const savingsRate = monthlyIncome > 0
    ? Math.max(0, Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100))
    : 0;

  let healthScore = 40;
  if (monthlyIncome > monthlyExpense) healthScore += 25;
  if (savingsRate >= 20) healthScore += 15;
  if (topGoals.length > 0) healthScore += 10;
  if (netWorth > 0) healthScore += 10;
  healthScore = Math.min(100, Math.max(10, healthScore));

  let healthGrade = "Sangat Baik";
  if (healthScore < 50) {
    healthGrade = "Perlu Perhatian";
  } else if (healthScore < 75) {
    healthGrade = "Cukup Baik";
  }

  const avgDailySpend = Math.round(monthlyExpense / Math.max(1, currentDay));

  // Fetch User Custom Spending Limit
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { monthlySpendingLimit: true },
  });

  const customLimit = Number(userRecord?.monthlySpendingLimit) || 0;
  const isCustom = customLimit > 0;

  // Calculate Safe-to-Spend & Monthly Budget
  let monthlyBudget: MonthlySpendingBudgetInfo;
  let safeStatus: "SAFE" | "WARNING" | "CRITICAL" = "SAFE";

  if (isCustom) {
    const monthlyLimit = customLimit;
    const monthlySpent = monthlyExpense;
    const monthlyRemaining = Math.max(0, monthlyLimit - monthlySpent);
    const usagePercentage = Math.min(100, Math.round((monthlySpent / monthlyLimit) * 100));
    // Opsi 2: Patokan rata-rata belanja harian standar (Batas Bulanan / 30 hari)
    const dailySafeAmount = Math.max(0, Math.floor(monthlyLimit / 30));

    if (monthlySpent >= monthlyLimit || usagePercentage >= 90) {
      safeStatus = "CRITICAL";
    } else if (usagePercentage >= 75) {
      safeStatus = "WARNING";
    } else {
      safeStatus = "SAFE";
    }

    monthlyBudget = {
      monthlyLimit,
      monthlySpent,
      monthlyRemaining,
      usagePercentage,
      dailySafeAmount,
      daysRemaining,
      status: safeStatus,
      isCustom: true,
    };
  } else {
    const freeLiquidCapital = Math.max(0, netWorth - totalGoalSavings);
    const dailySafeAmount = Math.max(0, Math.floor(freeLiquidCapital / 30));

    if (dailySafeAmount < 50000) {
      safeStatus = "CRITICAL";
    } else if (dailySafeAmount < 150000) {
      safeStatus = "WARNING";
    } else {
      safeStatus = "SAFE";
    }

    monthlyBudget = {
      monthlyLimit: 0,
      monthlySpent: monthlyExpense,
      monthlyRemaining: freeLiquidCapital,
      usagePercentage: 0,
      dailySafeAmount,
      daysRemaining,
      status: safeStatus,
      isCustom: false,
    };
  }

  // 4. Fetch 5 Recent Transactions
  const recentTransactions: RecentTransactionItem[] = transactionsRaw.slice(0, 5).map((tx) => ({
    id: tx.id,
    type: tx.type as "INCOME" | "EXPENSE" | "TRANSFER",
    amount: Number(tx.amount),
    date: tx.date.toISOString(),
    description: tx.description || "",
    receiptUrl: tx.receiptUrl,
    category: tx.category
      ? {
          name: tx.category.name,
          icon: tx.category.icon,
          color: tx.category.color,
        }
      : null,
    account: {
      name: tx.account.name,
      type: tx.account.type,
    },
  }));

  // 5. Fetch Categories
  const categoriesRaw = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  const categories = categoriesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
    icon: c.icon,
    color: c.color,
  }));

  return {
    netWorth,
    monthlyIncome,
    monthlyExpense,
    prevMonthIncome,
    prevMonthExpense,
    incomeGrowthPct,
    expenseGrowthPct,
    savingsRate,
    healthScore,
    healthGrade,
    avgDailySpend,
    totalGoalSavings,
    monthlyBudget,
    safeToSpend: {
      dailyAmount: monthlyBudget.dailySafeAmount,
      monthlyRemaining: monthlyBudget.monthlyRemaining,
      daysRemaining,
      status: monthlyBudget.status,
    },
    cashflowTrend,
    categoryExpenses,
    recentTransactions,
    topGoals,
    accounts,
    categories,
  };
}

export async function updateMonthlySpendingLimit(amount: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const sanitized = Math.max(0, Math.round(Number(amount) || 0));

  await prisma.user.update({
    where: { id: session.user.id },
    data: { monthlySpendingLimit: sanitized },
  });

  return { success: true, monthlySpendingLimit: sanitized };
}
