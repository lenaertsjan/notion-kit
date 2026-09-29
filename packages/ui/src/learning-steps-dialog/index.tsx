import React, { useEffect, useRef, useState } from "react";

import { cn } from "@notion-kit/cn";
import { Icon } from "@notion-kit/icons";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/primitives";

interface LearningStep {
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  /** Vimeo embed URL. Ignored when `media` is set. */
  videoUrl?: string;
  /** Right-hand visual for this step. Wins over `videoUrl`. */
  media?: React.ReactNode;
  /** Extra body rendered under the description in the text pane. */
  content?: React.ReactNode;
}

interface LearningStepsDialogLabels {
  next: string;
  back: string;
  done: string;
  close: string;
  /** `index` is 1-based. */
  slide: (index: number, total: number) => string;
}

const defaultLabels: LearningStepsDialogLabels = {
  next: "Next",
  back: "Back",
  done: "Done",
  close: "Close",
  slide: (index, total) => `Slide ${index} of ${total}`,
};

interface LearningStepsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  steps: LearningStep[];
  /** Called when "Done" is pressed on the last step, before `onOpenChange(false)`. */
  onComplete?: () => void;
  /** Called when the dialog closes without completion: close button, Escape, or outside click, before `onOpenChange(false)`. */
  onDismiss?: () => void;
  /** Controlled current step, 0-based. */
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  labels?: Partial<LearningStepsDialogLabels>;
  /** Merged onto `DialogContent`. */
  className?: string;
}

interface PaginationDotProps {
  active: boolean;
  label: string;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}

function PaginationDot({
  active,
  label,
  onClick,
  onKeyDown,
  buttonRef,
}: PaginationDotProps) {
  return (
    <Button
      ref={buttonRef}
      role="tab"
      tabIndex={active ? 0 : -1}
      aria-label={label}
      aria-selected={active}
      onClick={onClick}
      onKeyDown={onKeyDown}
      variant={null}
      size="circle"
      className={cn("size-1.5", active ? "bg-icon" : "bg-default/20")}
    />
  );
}

function VideoPreview({ src }: { src: string }) {
  const videoSrc = `${src}?playsinline=true&dnt=true&autoplay=true&background=true&loop=true&muted=true`;

  return (
    <div className="aspect-240/319 h-full w-auto shrink-0">
      <div className="relative w-full pb-[132.917%]">
        <iframe
          title="Video preview"
          allowFullScreen
          src={videoSrc}
          className="absolute inset-s-0 top-0 size-full border-0 bg-transparent opacity-100 shadow-[0_1px_0_0_var(--border)] transition-opacity duration-220"
        />
      </div>
    </div>
  );
}

function MediaPane({
  media,
  videoUrl,
}: {
  media?: React.ReactNode;
  videoUrl?: string;
}) {
  return (
    <div
      data-slot="learning-steps-dialog-media"
      className="hidden min-w-0 flex-1 items-center justify-center overflow-hidden rounded-lg border-[1.5px] border-border bg-input sm:flex"
    >
      {media ?? (videoUrl && <VideoPreview src={videoUrl} />)}
    </div>
  );
}

function LearningStepsDialog({
  open,
  onOpenChange,
  steps,
  onComplete,
  onDismiss,
  step: controlledStep,
  defaultStep,
  onStepChange,
  labels: labelsProp,
  className,
}: LearningStepsDialogProps) {
  const labels = { ...defaultLabels, ...labelsProp };
  const isStepControlled = controlledStep !== undefined;
  const [internalStep, setInternalStep] = useState(defaultStep ?? 0);
  const currentStep = isStepControlled ? controlledStep : internalStep;
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (open && !isStepControlled) {
      setInternalStep(defaultStep ?? 0);
    }
    // Only re-sync when the dialog transitions open; step/defaultStep are
    // read at that moment, not tracked as reactive dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const goToStep = (next: number) => {
    if (!isStepControlled) setInternalStep(next);
    onStepChange?.(next);
  };

  const handleNext = () => {
    if (isLast) {
      onComplete?.();
      onOpenChange?.(false);
    } else {
      goToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) goToStep(currentStep - 1);
  };

  const handleDotKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const count = steps.length;
    let next: number | null = null;
    switch (event.key) {
      case "ArrowRight":
        next = (currentStep + 1) % count;
        break;
      case "ArrowLeft":
        next = (currentStep - 1 + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    goToStep(next);
    dotRefs.current[next]?.focus();
  };

  if (!step) return null;

  const hasMedia = Boolean(step.media ?? step.videoUrl);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onDismiss?.();
        onOpenChange?.(nextOpen);
      }}
    >
      <DialogContent
        hideClose
        className={cn(
          "w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg p-0 sm:w-auto",
          className,
        )}
      >
        <div
          className={cn(
            "flex max-h-[min(500px,calc(100dvh-2rem))] gap-2 p-2",
            hasMedia && "sm:h-[min(500px,calc(100dvh-2rem))]",
          )}
        >
          {/* Text pane */}
          <div
            data-slot="learning-steps-dialog-text"
            className="relative flex w-full min-w-0 shrink-0 flex-col justify-between overflow-y-auto px-6 pe-4 pt-6 pb-4 sm:w-[369px]"
          >
            <DialogClose
              aria-label={labels.close}
              className="absolute top-3 right-3 z-10"
              render={
                <Button variant="close" size="circle">
                  <Icon.Close className="h-full w-3.5 fill-secondary dark:fill-default/45" />
                </Button>
              }
            />
            {/* Header */}
            <DialogHeader className="pt-[86px]">
              <div className="mb-4">{step.icon}</div>
              <DialogTitle className="text-[30px]/9">{step.title}</DialogTitle>
              {step.description && (
                <DialogDescription>{step.description}</DialogDescription>
              )}
              {step.content}
            </DialogHeader>
            {/* Footer */}
            <DialogFooter className="min-h-8 flex-row justify-between">
              <div
                role="tablist"
                aria-label={labels.slide(currentStep + 1, steps.length)}
                className="flex items-center gap-2"
              >
                {steps.map((_, i) => (
                  <PaginationDot
                    key={i}
                    buttonRef={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    active={i === currentStep}
                    label={labels.slide(i + 1, steps.length)}
                    onClick={() => goToStep(i)}
                    onKeyDown={handleDotKeyDown}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <Button variant="hint" size="sm" onClick={handleBack}>
                    {labels.back}
                  </Button>
                )}
                <Button variant="hint" size="sm" onClick={handleNext}>
                  {isLast ? labels.done : labels.next}
                </Button>
              </div>
            </DialogFooter>
          </div>
          {/* Media pane */}
          {hasMedia && (
            <MediaPane media={step.media} videoUrl={step.videoUrl} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { LearningStepsDialog };
export type {
  LearningStep,
  LearningStepsDialogLabels,
  LearningStepsDialogProps,
};
