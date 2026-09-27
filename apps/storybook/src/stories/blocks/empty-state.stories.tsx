import type { Meta, StoryObj } from "storybook-react-rsbuild";

import { Icon } from "@notion-kit/icons";
import { EmptyState } from "@notion-kit/ui/empty-state";

const meta = {
  title: "blocks/Empty State",
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "No machines yet",
    description: "Provision a machine to see it appear here.",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Icon.SquareGrid2x2 />,
    title: "No machines yet",
    description: "Provision a machine to see it appear here.",
  },
};

export const WithAction: Story = {
  args: {
    icon: <Icon.SquareGrid2x2 />,
    title: "No machines yet",
    description: "Provision a machine to see it appear here.",
    action: {
      label: "Add machine",
      onClick: () => {
        /* no-op for story */
      },
    },
  },
};
