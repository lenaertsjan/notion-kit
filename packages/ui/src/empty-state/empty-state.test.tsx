import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("EmptyState_Rendered_ShowsTitleAndDescription", () => {
    render(
      <EmptyState
        title="No machines yet"
        description="Provision a machine to get started."
      />,
    );

    expect(screen.getByText("No machines yet")).toBeVisible();
    expect(
      screen.getByText("Provision a machine to get started."),
    ).toBeVisible();
  });

  it("EmptyState_WithActionObject_ClickingCallsOnClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EmptyState
        title="No machines yet"
        action={{ label: "Add machine", onClick }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Add machine" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("EmptyState_WithActionNode_RendersCustomNode", () => {
    render(
      <EmptyState
        title="No machines yet"
        action={<a href="/docs">Learn more</a>}
      />,
    );

    expect(screen.getByRole("link", { name: "Learn more" })).toBeVisible();
  });

  it("EmptyState_Rendered_LabelsSectionByTitle", () => {
    render(<EmptyState title="No machines yet" />);

    expect(
      screen.getByRole("region", { name: "No machines yet" }),
    ).toBeInTheDocument();
  });
});
