import type { Meta, StoryObj } from "storybook-react-rsbuild";

import AccordionDemo from "@notion-kit/registry/accordion-default";

const meta = {
  title: "Shadcn/Accordion",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AccordionDemo />,
};
