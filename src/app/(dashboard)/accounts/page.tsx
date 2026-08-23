import { getAccountsData } from "@/features/accounts/actions";
import { AccountsView } from "@/features/accounts/components/accounts-view";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const { accounts, archivedAccounts, netWorth } = await getAccountsData();

  return (
    <AccountsView
      initialAccounts={accounts}
      initialArchivedAccounts={archivedAccounts}
      initialNetWorth={netWorth}
    />
  );
}
