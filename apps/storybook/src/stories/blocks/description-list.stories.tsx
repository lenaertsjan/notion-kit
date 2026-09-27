import type { Meta, StoryObj } from "storybook-react-rsbuild";

import DescriptionListDemo from "@notion-kit/registry/description-list-default";

const meta = {
  title: "blocks/Description List",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <DescriptionListDemo />,
};
