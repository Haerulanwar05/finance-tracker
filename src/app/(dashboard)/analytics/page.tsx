import { getDashboardAnalyticsData } from "@/features/dashboard/actions";
import { AnalyticsView } from "@/features/analytics/components/analytics-view";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  try {
    const data = await getDashboardAnalyticsData();
    return <AnalyticsView data={data} />;
  } catch (error) {
    console.error("AnalyticsPage caught error, falling back gracefully:", error);
    const fallbackData = await getDashboardAnalyticsData();
    return <AnalyticsView data={fallbackData} />;
  }
}
