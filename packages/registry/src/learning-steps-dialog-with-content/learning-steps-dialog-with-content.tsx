"use client";

import { useState } from "react";

import {
  LearningStepsDialog,
  type LearningStep,
} from "@notion-kit/ui/learning-steps-dialog";
import { Button } from "@notion-kit/ui/primitives";

const steps: LearningStep[] = [
  {
    icon: (
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-orange/20 text-2xl">
        ✅
      </div>
    ),
    title: "Before you start",
    description: "A few things to have ready.",
    content: (
      <ul className="mt-4 flex flex-col gap-2 text-sm text-secondary">
        <li>✅ Connect your Notion workspace</li>
        <li>✅ Invite at least one teammate</li>
        <li>✅ Pick a default access level</li>
      </ul>
    ),
  },
];

export default function LearningStepsDialogWithContentDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Show checklist
      </Button>
      <LearningStepsDialog
        open={open}
        onOpenChange={setOpen}
        steps={steps}
        onComplete={() => setOpen(false)}
        onDismiss={() => setOpen(false)}
      />
    </>
  );
}
