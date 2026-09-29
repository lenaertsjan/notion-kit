"use client";

import { useState } from "react";

import {
  LearningStepsDialog,
  type LearningStep,
  type LearningStepsDialogLabels,
} from "@notion-kit/ui/learning-steps-dialog";
import { Button } from "@notion-kit/ui/primitives";

const steps: LearningStep[] = [
  {
    icon: (
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-orange/20 text-2xl">
        💬
      </div>
    ),
    title: "Q&A-agenten",
    description:
      "Beantwoordt terugkerende vragen met kennis uit Notion en gekoppelde tools.",
    videoUrl: "https://player.vimeo.com/video/1167228783",
  },
  {
    icon: (
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue/20 text-2xl">
        📊
      </div>
    ),
    title: "Diepgaand onderzoek",
    description:
      "Verzamelt en analyseert informatie in je werkruimte om inzichten te tonen.",
    videoUrl: "https://player.vimeo.com/video/1167228783",
  },
];

const labels: Partial<LearningStepsDialogLabels> = {
  next: "Volgende",
  back: "Terug",
  done: "Klaar",
  close: "Sluiten",
  slide: (index, total) => `Dia ${index} van ${total}`,
};

export default function LearningStepsDialogLocalizedDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Start rondleiding
      </Button>
      <LearningStepsDialog
        open={open}
        onOpenChange={setOpen}
        steps={steps}
        labels={labels}
        onComplete={() => setOpen(false)}
        onDismiss={() => setOpen(false)}
      />
    </>
  );
}
