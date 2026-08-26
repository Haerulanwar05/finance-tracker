import { AccountItem } from "../components/account-card";

export type AccountSortOption = "DEFAULT" | "BALANCE_DESC" | "BALANCE_ASC" | "NAME_ASC";

/**
 * Sorts accounts array by balance (Ascending or Descending) or name.
 * Uses immutable sorting so original array is never mutated.
 * Uses secondary tie-breaker (name) to ensure deterministic ordering.
 */
export function sortAccounts(
  accounts: AccountItem[],
  sortOption: AccountSortOption
): AccountItem[] {
  if (!accounts || accounts.length <= 1 || sortOption === "DEFAULT") {
    return accounts || [];
  }

  return [...accounts].sort((a, b) => {
    const balA = Number(a.balance ?? 0);
    const balB = Number(b.balance ?? 0);

    if (sortOption === "BALANCE_DESC") {
      // Descending: highest balance first
      if (balB !== balA) return balB - balA;
      return (a.name || "").localeCompare(b.name || "", "id-ID");
    }

    if (sortOption === "BALANCE_ASC") {
      // Ascending: lowest balance first
      if (balA !== balB) return balA - balB;
      return (a.name || "").localeCompare(b.name || "", "id-ID");
    }

    if (sortOption === "NAME_ASC") {
      return (a.name || "").localeCompare(b.name || "", "id-ID");
    }

    return 0;
  });
}
