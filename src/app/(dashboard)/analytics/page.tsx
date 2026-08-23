import { getDashboardAnalyticsData } from "@/features/dashboard/actions";
import { AnalyticsView } from "@/features/analytics/components/analytics-view";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const data = await getDashboardAnalyticsData();

  return <AnalyticsView data={data} />;
}
