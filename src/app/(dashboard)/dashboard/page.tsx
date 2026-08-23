import { getDashboardAnalyticsData } from "@/features/dashboard/actions";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardAnalyticsData();

  return <DashboardView data={data} />;
}
