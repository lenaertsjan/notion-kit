import { act, render, screen, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LearningStepsDialog, type LearningStepsDialogProps } from "./index";

const steps: LearningStepsDialogProps["steps"] = [
  { icon: <span>👋</span>, title: "Welcome", description: "Step one." },
  { icon: <span>🔍</span>, title: "Explore", description: "Step two." },
  { icon: <span>🎉</span>, title: "Wrap up", description: "Step three." },
];

class LearningStepsDialogObject {
  private constructor(readonly user: UserEvent) {}

  static render(props: Partial<LearningStepsDialogProps> = {}) {
    const user = userEvent.setup();
    render(<LearningStepsDialog open steps={steps} {...props} />);
    return new LearningStepsDialogObject(user);
  }

  dialog() {
    return screen.getByRole("dialog");
  }

  closeButton(name = "Close") {
    return within(this.dialog()).getByRole("button", { name });
  }

  backButton(name = "Back") {
    return within(this.dialog()).getByRole("button", { name });
  }

  nextButton(name = "Next") {
    return within(this.dialog()).getByRole("button", { name });
  }

  doneButton(name = "Done") {
    return within(this.dialog()).getByRole("button", { name });
  }

  tablist() {
    return within(this.dialog()).getByRole("tablist");
  }

  tab(label: string) {
    return within(this.tablist()).getByRole("tab", { name: label });
  }

  async click(el: HTMLElement) {
    await this.user.click(el);
  }

  /**
   * Base UI assigns the dialog's initial focus once its open transition
   * completes; wait for that to settle before asserting on manually-driven
   * focus, or it can reclaim focus out from under the assertion.
   */
  static async settle() {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }
}

describe("LearningStepsDialog", () => {
  it("LearningStepsDialog_CloseButton_CallsOnDismissNotOnComplete", async () => {
    const onDismiss = vi.fn();
    const onComplete = vi.fn();
    const onOpenChange = vi.fn();
    const page = LearningStepsDialogObject.render({
      onDismiss,
      onComplete,
      onOpenChange,
    });

    await page.click(page.closeButton());

    expect(onDismiss).toHaveBeenCalledOnce();
    expect(onComplete).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("LearningStepsDialog_DoneOnLastStep_CallsOnCompleteNotOnDismiss", async () => {
    const onDismiss = vi.fn();
    const onComplete = vi.fn();
    const onOpenChange = vi.fn();
    const page = LearningStepsDialogObject.render({
      onDismiss,
      onComplete,
      onOpenChange,
      defaultStep: steps.length - 1,
    });

    await page.click(page.doneButton());

    expect(onComplete).toHaveBeenCalledOnce();
    expect(onDismiss).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("LearningStepsDialog_Next_AdvancesToNextStepAndShowsBack", async () => {
    const page = LearningStepsDialogObject.render();

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(() => page.backButton()).toThrow();

    await page.click(page.nextButton());

    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(page.backButton()).toBeInTheDocument();
  });

  it("LearningStepsDialog_Back_ReturnsToPreviousStep", async () => {
    const page = LearningStepsDialogObject.render({ defaultStep: 1 });

    expect(screen.getByText("Explore")).toBeInTheDocument();

    await page.click(page.backButton());

    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });

  it("LearningStepsDialog_ControlledStep_DefersToParentAndCallsOnStepChange", async () => {
    const onStepChange = vi.fn();
    const page = LearningStepsDialogObject.render({ step: 0, onStepChange });

    await page.click(page.nextButton());

    // Controlled: the component does not advance on its own.
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(onStepChange).toHaveBeenCalledWith(1);
  });

  it("LearningStepsDialog_ArrowKeys_MoveRovingFocusAndActivateStep", async () => {
    const page = LearningStepsDialogObject.render();
    // Let the dialog's own open-transition focus assignment settle before
    // driving focus manually, or it can reclaim focus asynchronously.
    await LearningStepsDialogObject.settle();

    const first = page.tab("Slide 1 of 3");
    const second = page.tab("Slide 2 of 3");
    const third = page.tab("Slide 3 of 3");

    expect(first).toHaveAttribute("tabindex", "0");
    expect(second).toHaveAttribute("tabindex", "-1");
    expect(third).toHaveAttribute("tabindex", "-1");

    first.focus();
    await page.user.keyboard("{ArrowRight}");

    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute("tabindex", "0");
    expect(first).toHaveAttribute("tabindex", "-1");

    await page.user.keyboard("{End}");
    expect(screen.getByText("Wrap up")).toBeInTheDocument();
    expect(third).toHaveFocus();

    await page.user.keyboard("{Home}");
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(first).toHaveFocus();
  });

  it("LearningStepsDialog_Labels_OverridesDefaultStrings", () => {
    const page = LearningStepsDialogObject.render({
      labels: {
        next: "Volgende",
        back: "Terug",
        done: "Klaar",
        close: "Sluiten",
        slide: (index, total) => `Dia ${index} van ${total}`,
      },
    });

    expect(page.closeButton("Sluiten")).toBeInTheDocument();
    expect(page.nextButton("Volgende")).toBeInTheDocument();
    expect(page.tab("Dia 1 van 3")).toBeInTheDocument();
  });

  it("LearningStepsDialog_NoMediaOrVideo_RendersSingleColumn", () => {
    render(
      <LearningStepsDialog
        open
        steps={[{ icon: <span>👋</span>, title: "Solo step" }]}
      />,
    );

    expect(
      document.querySelector('[data-slot="learning-steps-dialog-media"]'),
    ).not.toBeInTheDocument();
  });

  it("LearningStepsDialog_WithMedia_RendersMediaPane", () => {
    render(
      <LearningStepsDialog
        open
        steps={[
          {
            icon: <span>👋</span>,
            title: "With media",
            media: <span>🖼️</span>,
          },
        ]}
      />,
    );

    expect(
      document.querySelector('[data-slot="learning-steps-dialog-media"]'),
    ).toBeInTheDocument();
  });
});
