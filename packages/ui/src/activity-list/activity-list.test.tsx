import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ActivityList, type ActivityEvent } from "./activity-list";

function makeEvent(overrides: Partial<ActivityEvent> = {}): ActivityEvent {
  return {
    id: "event-1",
    occurredAt: "2026-01-01T00:00:00.000Z",
    action: "Suspended workspace",
    ...overrides,
  };
}

describe("ActivityList", () => {
  it("ActivityList_EmptyEvents_RendersEmptyMessage", () => {
    render(<ActivityList events={[]} />);

    expect(screen.getByText("No activity yet")).toBeInTheDocument();
  });

  it("ActivityList_EmptyEvents_RendersCustomEmptyMessage", () => {
    render(<ActivityList events={[]} emptyMessage="Nothing happened yet" />);

    expect(screen.getByText("Nothing happened yet")).toBeInTheDocument();
  });

  it("ActivityList_MultipleEvents_RendersRowsInOrder", () => {
    const events = [
      makeEvent({ id: "1", action: "First action" }),
      makeEvent({ id: "2", action: "Second action" }),
      makeEvent({ id: "3", action: "Third action" }),
    ];
    render(<ActivityList events={events} />);

    const rows = screen.getAllByRole("listitem");
    expect(rows.map((row) => row.textContent)).toEqual([
      expect.stringContaining("First action"),
      expect.stringContaining("Second action"),
      expect.stringContaining("Third action"),
    ]);
  });

  it("ActivityList_MetadataProvided_DetailsDisclosureShowsMetadata", async () => {
    const user = userEvent.setup();
    const event = makeEvent({
      metadata: { ip: "203.0.113.5", region: "eu-west-1" },
    });
    render(<ActivityList events={[event]} />);

    const details = screen.getByText("Details").closest("details");
    expect(details).not.toHaveAttribute("open");

    await user.click(screen.getByText("Details"));

    expect(details).toHaveAttribute("open");
    expect(screen.getByText("ip")).toBeInTheDocument();
    expect(screen.getByText("203.0.113.5")).toBeInTheDocument();
    expect(screen.getByText("region")).toBeInTheDocument();
    expect(screen.getByText("eu-west-1")).toBeInTheDocument();
  });

  it("ActivityList_RowClicked_CallsOnSelectWithEvent", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const event = makeEvent({ action: "Rotated API key" });
    render(<ActivityList events={[event]} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Rotated API key" }));

    expect(onSelect).toHaveBeenCalledWith(event);
  });
});
