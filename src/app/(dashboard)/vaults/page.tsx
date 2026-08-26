import { getGoalsData } from "@/features/goals/actions";
import { GoalsView } from "@/features/goals/components/goals-view";

export const dynamic = "force-dynamic";

export default async function VaultsPage() {
  try {
    const { goals, summary, accounts } = await getGoalsData();

    return (
      <GoalsView
        initialGoals={goals || []}
        summary={
          summary || {
            totalTarget: 0,
            totalSaved: 0,
            overallProgress: 0,
            activeCount: 0,
            achievedCount: 0,
          }
        }
        accounts={accounts || []}
      />
    );
  } catch (error) {
    console.error("VaultsPage caught error, falling back gracefully:", error);
    return (
      <GoalsView
        initialGoals={[]}
        summary={{
          totalTarget: 0,
          totalSaved: 0,
          overallProgress: 0,
          activeCount: 0,
          achievedCount: 0,
        }}
        accounts={[]}
      />
    );
  }
}
