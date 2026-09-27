import type { Meta, StoryObj } from "storybook-react-rsbuild";

import { Icon } from "@notion-kit/icons";
import { StatCard, StatCardGrid } from "@notion-kit/ui/stat-card";

const meta = {
  title: "blocks/Stat Card",
  component: StatCard,
} satisfies Meta<typeof StatCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Active machines",
    value: "42",
    caption: "+3 this week",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Active machines",
    value: "42",
    caption: "+3 this week",
    icon: <Icon.ViewChart />,
  },
};

export const AsLink: Story = {
  args: {
    label: "Active machines",
    value: "42",
    href: "#",
  },
};

export const AsButton: Story = {
  args: {
    label: "Active machines",
    value: "42",
    onClick: () => {
      /* no-op for story */
    },
  },
};

export const WarningTone: Story = {
  args: {
    label: "Pending updates",
    value: "5",
    tone: "warning",
  },
};

export const DangerTone: Story = {
  args: {
    label: "Failed deploys",
    value: "2",
    tone: "danger",
  },
};

export const Grid: Story = {
  render: () => (
    <StatCardGrid>
      <StatCard label="Active machines" value="42" caption="+3 this week" />
      <StatCard label="Pending updates" value="5" tone="warning" />
      <StatCard label="Failed deploys" value="2" tone="danger" />
      <StatCard label="Regions" value="6" />
    </StatCardGrid>
  ),
};
