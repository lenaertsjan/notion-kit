import { Icon } from "@notion-kit/icons";
import { StatCard, StatCardGrid } from "@notion-kit/ui/stat-card";

export default function StatCardDefault() {
  return (
    <StatCardGrid>
      <StatCard
        label="Active machines"
        value="42"
        caption="+3 this week"
        icon={<Icon.ViewChart />}
      />
      <StatCard label="Pending updates" value="5" tone="warning" />
      <StatCard label="Failed deploys" value="2" tone="danger" />
      <StatCard label="Regions" value="6" href="#" />
    </StatCardGrid>
  );
}
