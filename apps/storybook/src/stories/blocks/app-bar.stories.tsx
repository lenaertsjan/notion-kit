import type { Meta, StoryObj } from "storybook-react-rsbuild";

import { Icon } from "@notion-kit/icons";
import { AppBar } from "@notion-kit/ui/navbar/presets";
import { Button } from "@notion-kit/ui/primitives";

const meta = {
  title: "blocks/App Bar",
  component: AppBar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brand: "Bliv",
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    brand: "Bliv",
    breadcrumbs: [{ label: "Fleet", href: "#" }, { label: "Machines" }],
  },
};

export const WithBreadcrumbClick: Story = {
  args: {
    brand: "Bliv",
    breadcrumbs: [
      {
        label: "Fleet",
        onClick: () => {
          /* no-op for story */
        },
      },
      { label: "Machines" },
    ],
  },
};

export const WithActionsAndUser: Story = {
  args: {
    brand: "Bliv",
    breadcrumbs: [{ label: "Fleet", href: "#" }, { label: "Machines" }],
    actions: (
      <Button variant="icon" aria-label="Refresh">
        <Icon.Undo />
      </Button>
    ),
    user: { name: "Ada Lovelace", email: "ada@example.com" },
    onSignOut: () => {
      /* no-op for story */
    },
  },
};

export const WithCenterSlot: Story = {
  args: {
    brand: "Bliv",
    breadcrumbs: [{ label: "Fleet", href: "#" }, { label: "Machines" }],
    children: (
      <span className="text-sm text-secondary">42 machines online</span>
    ),
    user: { name: "Ada Lovelace", email: "ada@example.com" },
  },
};

export const WithIdentity: Story = {
  args: {
    brand: "Workspace",
    showIdentity: true,
    user: { name: "Ada Lovelace", email: "ada@example.com" },
  },
};
