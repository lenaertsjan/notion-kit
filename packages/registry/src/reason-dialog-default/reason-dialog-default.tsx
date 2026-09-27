"use client";

import { useState } from "react";

import { Button, Dialog, DialogTrigger } from "@notion-kit/ui/primitives";
import { ReasonDialog } from "@notion-kit/ui/reason-dialog";

export default function ReasonDialogDefault() {
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
          await new Promise((resolve) => setTimeout(resolve, 600));
          console.log("Suspended with reason:", reason);
          setOpen(false);
        }}
      />
    </Dialog>
  );
}
