import { Icon } from "@notion-kit/icons";
import { EmptyState } from "@notion-kit/ui/empty-state";

export default function EmptyStateDefault() {
  return (
    <EmptyState
      icon={<Icon.SquareGrid2x2 />}
      title="No machines yet"
      description="Provision a machine to see it appear here."
      action={{ label: "Add machine", onClick: () => undefined }}
    />
  );
}
