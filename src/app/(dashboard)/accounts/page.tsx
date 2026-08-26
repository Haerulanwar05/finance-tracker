import { getAccountsData } from "@/features/accounts/actions";
import { AccountsView } from "@/features/accounts/components/accounts-view";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  try {
    const { accounts, archivedAccounts, netWorth } = await getAccountsData();

    return (
      <AccountsView
        initialAccounts={accounts || []}
        initialArchivedAccounts={archivedAccounts || []}
        initialNetWorth={netWorth || 0}
      />
    );
  } catch (error) {
    console.error("AccountsPage caught error, falling back gracefully:", error);
    return (
      <AccountsView
        initialAccounts={[]}
        initialArchivedAccounts={[]}
        initialNetWorth={0}
      />
    );
  }
}
