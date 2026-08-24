import { getTransactionsData } from "@/features/transactions/actions";
import { TransactionsView } from "@/features/transactions/components/transactions-view";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const { transactions, summary, accounts, categories, userName } = await getTransactionsData();

  return (
    <TransactionsView
      initialTransactions={transactions}
      summary={summary}
      accounts={accounts}
      categories={categories}
      userName={userName}
    />
  );
}
