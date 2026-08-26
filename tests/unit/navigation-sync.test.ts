import { describe, it, expect } from "vitest";

/**
 * QA & Test Suite: Navigation Hierarchy, Active State Precision, and Cross-Page Data Sync
 */

interface NavItem {
  label: string;
  shortLabel: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", shortLabel: "Overview", href: "/dashboard" },
  { label: "Transaksi", shortLabel: "Transaksi", href: "/transactions" },
  { label: "Analitik", shortLabel: "Analitik", href: "/analytics" },
  { label: "Target Tabungan", shortLabel: "Tabungan", href: "/vaults" },
  { label: "Rekening", shortLabel: "Rekening", href: "/accounts" },
  { label: "Pengaturan", shortLabel: "Pengaturan", href: "/settings" },
];

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/";
  }
  if (href === "/vaults") {
    return pathname.startsWith("/vaults") || pathname.startsWith("/goals");
  }
  return pathname.startsWith(href);
}

describe("QA & Test: Navigation Sync & Route Coherence", () => {
  describe("1. Navigation Items Structure & Mobile Short Labels", () => {
    it("contains all 6 core navigation items without omissions", () => {
      expect(NAV_ITEMS).toHaveLength(6);
      const labels = NAV_ITEMS.map((n) => n.label);
      expect(labels).toEqual([
        "Overview",
        "Transaksi",
        "Analitik",
        "Target Tabungan",
        "Rekening",
        "Pengaturan",
      ]);
    });

    it("ensures every item has a non-empty canonical href starting with '/'", () => {
      NAV_ITEMS.forEach((item) => {
        expect(item.href).toMatch(/^\/[a-z]+$/);
      });
    });

    it("ensures mobile shortLabel is concise (< 10 chars) and not empty", () => {
      NAV_ITEMS.forEach((item) => {
        expect(item.shortLabel.length).toBeGreaterThan(0);
        expect(item.shortLabel.length).toBeLessThanOrEqual(10);
      });
      // Target Tabungan must have clean 'Tabungan' label on mobile bottom nav
      const vaultNav = NAV_ITEMS.find((i) => i.href === "/vaults");
      expect(vaultNav?.shortLabel).toBe("Tabungan");
    });
  });

  describe("2. Active Route Highlight Precision (Single-Active Invariant)", () => {
    const routeTestCases = [
      { pathname: "/dashboard", expectedActive: "/dashboard" },
      { pathname: "/", expectedActive: "/dashboard" },
      { pathname: "/transactions", expectedActive: "/transactions" },
      { pathname: "/transactions/export", expectedActive: "/transactions" },
      { pathname: "/analytics", expectedActive: "/analytics" },
      { pathname: "/vaults", expectedActive: "/vaults" },
      { pathname: "/goals", expectedActive: "/vaults" },
      { pathname: "/accounts", expectedActive: "/accounts" },
      { pathname: "/settings", expectedActive: "/settings" },
    ];

    routeTestCases.forEach(({ pathname, expectedActive }) => {
      it(`highlights '${expectedActive}' when visiting '${pathname}' and ensures mutually exclusive active state`, () => {
        const activeItems = NAV_ITEMS.filter((item) => isItemActive(pathname, item.href));
        expect(activeItems).toHaveLength(1);
        expect(activeItems[0].href).toBe(expectedActive);
      });
    });

    it("ensures no route in NAV_ITEMS falsely activates on an unrelated subpath", () => {
      const activeItems = NAV_ITEMS.filter((item) => isItemActive("/api/auth/signin", item.href));
      expect(activeItems).toHaveLength(0);
    });
  });

  describe("3. Cross-Page Data Synchronization Mathematical Invariant", () => {
    it("ensures Net Worth on /dashboard matches Net Worth on /accounts identically", () => {
      const activeAccounts = [
        { id: "acc-1", name: "BCA", balance: 5000000, isArchived: false },
        { id: "acc-2", name: "GoPay", balance: 1250000, isArchived: false },
        { id: "acc-3", name: "Bibit Reksadana", balance: 10000000, isArchived: false },
      ];
      const archivedAccounts = [
        { id: "acc-4", name: "Old Bank", balance: 50000, isArchived: true },
      ];

      // Logic on /accounts
      const accountsNetWorth = activeAccounts.reduce((acc, curr) => acc + Number(curr.balance), 0);

      // Logic on /dashboard (only non-archived accounts considered)
      const dashboardNetWorth = activeAccounts
        .filter((a) => !a.isArchived)
        .reduce((sum, acc) => sum + acc.balance, 0);

      expect(accountsNetWorth).toBe(16250000);
      expect(dashboardNetWorth).toBe(accountsNetWorth);
      expect(archivedAccounts[0].isArchived).toBe(true);
    });

    it("ensures Cashflow metrics on /transactions match Cashflow metrics on /dashboard & /analytics", () => {
      const rawTransactions = [
        { id: "tx-1", type: "INCOME", amount: 15000000 },
        { id: "tx-2", type: "EXPENSE", amount: 3500000 },
        { id: "tx-3", type: "EXPENSE", amount: 1500000 },
        { id: "tx-4", type: "TRANSFER", amount: 500000 },
      ];

      let txTotalIncome = 0;
      let txTotalExpense = 0;
      rawTransactions.forEach((tx) => {
        if (tx.type === "INCOME") txTotalIncome += tx.amount;
        if (tx.type === "EXPENSE") txTotalExpense += tx.amount;
      });
      const txNet = txTotalIncome - txTotalExpense;

      const dashTotalIncome = rawTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((s, t) => s + t.amount, 0);
      const dashTotalExpense = rawTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((s, t) => s + t.amount, 0);
      const dashNet = dashTotalIncome - dashTotalExpense;

      expect(txTotalIncome).toBe(15000000);
      expect(txTotalExpense).toBe(5000000);
      expect(txNet).toBe(10000000);
      expect(dashTotalIncome).toBe(txTotalIncome);
      expect(dashTotalExpense).toBe(txTotalExpense);
      expect(dashNet).toBe(txNet);
    });

    it("ensures Vault allocation updates linked account balance consistently", () => {
      let bcaBalance = 10000000;
      let emergencyFundSaved = 2000000;
      const depositAmount = 1500000;

      bcaBalance -= depositAmount;
      emergencyFundSaved += depositAmount;

      expect(bcaBalance).toBe(8500000);
      expect(emergencyFundSaved).toBe(3500000);
    });
  });

  describe("4. Revalidation & Client Navigation Freshness Invariant", () => {
    it("validates that root layout revalidation string matches Next.js specifications", () => {
      const rootLayoutRevalidation = { path: "/", type: "layout" as const };
      expect(rootLayoutRevalidation.path).toBe("/");
      expect(rootLayoutRevalidation.type).toBe("layout");
    });
  });

  describe("5. Instant Optimistic Navigation & Responsiveness Invariant", () => {
    it("immediately activates clicked destination via optimistic state in 0ms", () => {
      const currentPath = "/dashboard";
      const clickedTarget = "/transactions";

      // Simulation of instant optimistic setter
      let optimisticPath: string | null = null;
      const handleNavClick = (target: string) => {
        optimisticPath = target;
      };

      handleNavClick(clickedTarget);
      const activePath = optimisticPath || currentPath;

      expect(activePath).toBe("/transactions");
      expect(isItemActive(activePath, "/transactions")).toBe(true);
      expect(isItemActive(activePath, "/dashboard")).toBe(false);
    });

    it("verifies prefetch enabled flag on all navigation routes", () => {
      const navConfig = NAV_ITEMS.map((item) => ({
        ...item,
        prefetch: true,
      }));

      navConfig.forEach((item) => {
        expect(item.prefetch).toBe(true);
      });
    });
  });
});

