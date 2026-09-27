import type { Meta, StoryObj } from "storybook-react-rsbuild";

import { CopySecretField } from "@notion-kit/ui/copy-secret-field";

const meta = {
  title: "blocks/Copy Secret Field",
  component: CopySecretField,
  parameters: { layout: "centered" },
  render: (args) => (
    <div className="w-100">
      <CopySecretField {...args} />
    </div>
  ),
} satisfies Meta<typeof CopySecretField>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "API key",
    value: "blv_agent_7Qm2pX9vLk4RtE1nWc8ZyB3sHd6JaF0g",
  },
};

export const WithWarning: Story = {
  args: {
    label: "New API key",
    value: "blv_agent_7Qm2pX9vLk4RtE1nWc8ZyB3sHd6JaF0g",
    description: "Store this key somewhere safe.",
    warning: "This key is shown only once and cannot be retrieved again.",
  },
};
