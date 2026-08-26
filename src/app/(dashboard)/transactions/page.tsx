import { getTransactionsData } from "@/features/transactions/actions";
import { TransactionsView } from "@/features/transactions/components/transactions-view";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  try {
    const { transactions, summary, accounts, categories, userName } = await getTransactionsData();

    return (
      <TransactionsView
        initialTransactions={transactions || []}
        summary={summary || { totalIncome: 0, totalExpense: 0, netCashflow: 0, count: 0 }}
        accounts={accounts || []}
        categories={categories || []}
        userName={userName || "Pengguna"}
      />
    );
  } catch (error) {
    console.error("TransactionsPage caught error, falling back gracefully:", error);
    return (
      <TransactionsView
        initialTransactions={[]}
        summary={{ totalIncome: 0, totalExpense: 0, netCashflow: 0, count: 0 }}
        accounts={[]}
        categories={[]}
        userName="Pengguna"
      />
    );
  }
}
