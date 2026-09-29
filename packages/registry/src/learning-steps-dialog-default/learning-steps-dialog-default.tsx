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
        💬
      </div>
    ),
    title: "Q&A agents",
    description:
      "Answers repeat questions using knowledge in Notion and connected tools.",
    videoUrl: "https://player.vimeo.com/video/1167228783",
  },
  {
    icon: (
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue/20 text-2xl">
        📊
      </div>
    ),
    title: "Deep research",
    description:
      "Gathers and analyzes information across your workspace to surface key insights.",
    videoUrl: "https://player.vimeo.com/video/1167228783",
  },
  {
    icon: (
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-red/20 text-2xl">
        ✍️
      </div>
    ),
    title: "Content drafts",
    description:
      "Generates first drafts based on your notes, docs, and existing content.",
    videoUrl: "https://player.vimeo.com/video/1167228783",
  },
];

export default function LearningStepsDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Start tour
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
