import { getGoalsData } from "@/features/goals/actions";
import { GoalsView } from "@/features/goals/components/goals-view";

export const dynamic = "force-dynamic";

export default async function VaultsPage() {
  const { goals, summary, accounts } = await getGoalsData();

  return (
    <GoalsView
      initialGoals={goals}
      summary={summary}
      accounts={accounts}
    />
  );
}
