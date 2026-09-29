import type { Meta, StoryObj } from "storybook-react-rsbuild";

import {
  LearningStepsDialog,
  type LearningStep,
  type LearningStepsDialogLabels,
} from "@notion-kit/ui/learning-steps-dialog";

const sampleSteps: LearningStep[] = [
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

const mediaSteps: LearningStep[] = [
  {
    icon: (
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-orange/20 text-2xl">
        🚀
      </div>
    ),
    title: "Ship faster",
    description: "Compose primitives instead of hand-rolled markup.",
    media: (
      <div className="flex size-full items-center justify-center text-6xl">
        🚀
      </div>
    ),
  },
  {
    icon: (
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue/20 text-2xl">
        🧩
      </div>
    ),
    title: "Stay consistent",
    description: "Every block themes through the kit's CSS variables.",
    media: (
      <div className="flex size-full items-center justify-center text-6xl">
        🧩
      </div>
    ),
  },
];

const dutchLabels: Partial<LearningStepsDialogLabels> = {
  next: "Volgende",
  back: "Terug",
  done: "Klaar",
  close: "Sluiten",
  slide: (index, total) => `Dia ${index} van ${total}`,
};

const checklistSteps: LearningStep[] = [
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

const meta = {
  title: "blocks/Learning Steps Dialog",
  component: LearningStepsDialog,
  parameters: { layout: "centered" },
} satisfies Meta<typeof LearningStepsDialog>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    steps: sampleSteps,
  },
};

export const WithMedia: Story = {
  args: {
    open: true,
    steps: mediaSteps,
  },
};

export const Localized: Story = {
  args: {
    open: true,
    steps: sampleSteps,
    labels: dutchLabels,
  },
};

export const WithContent: Story = {
  args: {
    open: true,
    steps: checklistSteps,
  },
};

export const Mobile: Story = {
  args: {
    open: true,
    steps: sampleSteps,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};
