import { useState } from "react";
import { delay } from "msw";
import type { Meta, StoryObj } from "storybook-react-rsbuild";

import { Button, Dialog, DialogTrigger } from "@notion-kit/ui/primitives";
import { ReasonDialog } from "@notion-kit/ui/reason-dialog";

const meta = {
  title: "blocks/Reason Dialog",
  parameters: { layout: "centered" },
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button size="md">Suspend workspace</Button>} />
        <ReasonDialog
          title="Suspend this workspace?"
          description="Members lose access immediately. You can resume the workspace later."
          confirmLabel="Suspend"
          reasonPlaceholder="Why are you suspending this workspace?"
          onConfirm={async (reason) => {
            await delay(800);
            console.log("Suspended with reason:", reason);
            setOpen(false);
          }}
        />
      </Dialog>
    );
  },
};

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button variant="red" size="md">
              Delete workspace
            </Button>
          }
        />
        <ReasonDialog
          title="Delete this workspace?"
          description="This permanently deletes all pages, members, and data. This cannot be undone."
          confirmLabel="Delete workspace"
          destructive
          confirmationPhrase="DELETE"
          onConfirm={async (reason) => {
            await delay(800);
            console.log("Deleted with reason:", reason);
            setOpen(false);
          }}
        />
      </Dialog>
    );
  },
};

export const RejectedConfirm: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button size="md">Open</Button>} />
        <ReasonDialog
          title="Rotate the API key?"
          description="The current key stops working immediately for every integration."
          confirmLabel="Rotate key"
          onConfirm={async () => {
            await delay(800);
            throw new Error("The operator console could not reach the API.");
          }}
        />
      </Dialog>
    );
  },
};
