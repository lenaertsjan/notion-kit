import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, userEvent } from "storybook/test";

import ConsoleLayoutDemo from "@notion-kit/registry/console-layout-demo";

const meta = {
  title: "blocks/Console Layout",
  component: ConsoleLayoutDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ConsoleLayoutDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole("link", { name: "Machines", exact: true }),
    );
    await expect(
      canvas.getByRole("heading", { name: "Machines", exact: true }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Close sidebar" }),
    );
    await expect(
      canvas.getByRole("button", { name: "Open sidebar" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Open sidebar" }));
    await userEvent.click(
      canvas.getByRole("link", { name: "Overview", exact: true }),
    );
  },
};
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
