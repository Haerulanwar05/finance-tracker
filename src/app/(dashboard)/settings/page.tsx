import { getSettingsData } from "@/features/settings/actions";
import { SettingsView } from "@/features/settings/components/settings-view";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const data = await getSettingsData();

  return <SettingsView data={data} />;
}
