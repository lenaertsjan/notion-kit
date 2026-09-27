import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

function Basic({ multiple = false }: { multiple?: boolean }) {
  return (
    <Accordion multiple={multiple}>
      <AccordionItem value="item-1">
        <AccordionTrigger>First section</AccordionTrigger>
        <AccordionContent>First section content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second section</AccordionTrigger>
        <AccordionContent>Second section content</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("AccordionTrigger_Render_HasAriaExpanded", () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "First section" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("AccordionTrigger_Click_TogglesPanelVisibility", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "First section" });

    expect(screen.queryByText("First section content")).not.toBeInTheDocument();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("First section content")).toBeVisible();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => {
      expect(
        screen.queryByText("First section content"),
      ).not.toBeInTheDocument();
    });
  });

  it("Accordion_MultipleTrue_KeepsTwoItemsOpen", async () => {
    const user = userEvent.setup();
    render(<Basic multiple />);

    await user.click(screen.getByRole("button", { name: "First section" }));
    await user.click(screen.getByRole("button", { name: "Second section" }));

    expect(
      screen.getByRole("button", { name: "First section" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "Second section" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("First section content")).toBeVisible();
    expect(screen.getByText("Second section content")).toBeVisible();
  });

  it("Accordion_MultipleFalse_ClosesPreviousItem", async () => {
    const user = userEvent.setup();
    render(<Basic />);

    await user.click(screen.getByRole("button", { name: "First section" }));
    await user.click(screen.getByRole("button", { name: "Second section" }));

    expect(
      screen.getByRole("button", { name: "First section" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: "Second section" }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});
