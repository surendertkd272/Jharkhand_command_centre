import { getFleetPhysiology } from "@/lib/integrations";
import { MonitoringDashboard } from "./MonitoringDashboard";

// Server component: this is where the command center fetches physiological data
// through the integration layer (Firstbeat + Myoact adapters). In demo mode the
// adapters return deterministic data; in live mode they call the vendor APIs.
export default async function MonitoringPage() {
  const fleet = await getFleetPhysiology();
  return <MonitoringDashboard fleet={fleet} />;
}
