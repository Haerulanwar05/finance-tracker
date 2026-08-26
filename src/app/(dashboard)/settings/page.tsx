import { getSettingsData } from "@/features/settings/actions";
import { SettingsView } from "@/features/settings/components/settings-view";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  try {
    const data = await getSettingsData();
    return <SettingsView data={data} />;
  } catch (error) {
    console.error("SettingsPage caught error, falling back gracefully:", error);
    const fallbackData = await getSettingsData();
    return <SettingsView data={fallbackData} />;
  }
}
