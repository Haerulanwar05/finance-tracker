import { getDashboardAnalyticsData } from "@/features/dashboard/actions";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  try {
    const data = await getDashboardAnalyticsData();
    return <DashboardView data={data} />;
  } catch (error) {
    console.error("DashboardPage caught error, falling back gracefully:", error);
    const fallbackData = await getDashboardAnalyticsData();
    return <DashboardView data={fallbackData} />;
  }
}
