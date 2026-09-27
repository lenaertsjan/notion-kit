import type { Meta, StoryObj } from "storybook-react-rsbuild";

import { Icon } from "@notion-kit/icons";
import { PageHeader } from "@notion-kit/ui/page-header";
import { Button } from "@notion-kit/ui/primitives";

const meta = {
  title: "blocks/Page Header",
  component: PageHeader,
} satisfies Meta<typeof PageHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Machines",
  },
};

export const WithEyebrowAndSubtitle: Story = {
  args: {
    eyebrow: "Fleet",
    title: "Machines",
    subtitle: "All machines provisioned across regions",
  },
};

export const WithActions: Story = {
  args: {
    eyebrow: "Fleet",
    title: "Machines",
    subtitle: "All machines provisioned across regions",
    actions: (
      <>
        <Button variant="icon" aria-label="Refresh">
          <Icon.Undo />
        </Button>
        <Button>Add machine</Button>
      </>
    ),
  },
};
