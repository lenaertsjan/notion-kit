import type React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { RowInstance } from "@notion-kit/table-hook";

import { createFullPluginFixture, mockResizeObserver } from "../__tests__/mock";
import { ReadOnlyTableView } from "./read-only-table-view";

mockResizeObserver();

const { properties, data } = createFullPluginFixture();

function setup(
  props: Partial<React.ComponentProps<typeof ReadOnlyTableView>> = {},
) {
  const user = userEvent.setup({
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  });
  render(<ReadOnlyTableView data={data} properties={properties} {...props} />);
  return { user };
}

function findRow(name: string | RegExp) {
  const matcher = typeof name === "string" ? new RegExp(name) : name;
  const row = screen
    .getAllByRole("row")
    .find((row) => matcher.test(row.textContent));
  if (!row) throw new Error(`Unable to find row matching ${matcher}`);
  return row;
}

function propertyCell(rowName: string | RegExp, propertyId: string) {
  const cell = findRow(rowName).querySelector<HTMLElement>(
    `[data-property-id="${propertyId}"]`,
  );
  if (!cell) throw new Error(`Unable to find property ${propertyId}`);
  return cell;
}

describe("ReadOnlyTableView", () => {
  it("renders rows and columns without any add-row control", () => {
    setup();

    expect(screen.getByRole("row", { name: /Alpha/ })).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "New page" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^Add row$/i }),
    ).not.toBeInTheDocument();
  });

  it("renders without row drag handles or a row-selection checkbox", () => {
    setup();

    expect(screen.queryByLabelText(/Select row/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Select all rows")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Row actions")).not.toBeInTheDocument();
  });

  it("shows the row detail drawer instead of an inline editor when a cell is clicked", async () => {
    const { user } = setup();

    const cell = propertyCell("Alpha", "notes");
    await user.click(cell);

    // Opens the read-only detail drawer (the intended "row click" behaviour)...
    expect(await screen.findByRole("heading", { name: "Alpha" })).toBeVisible();
    // ...but never an editable textbox: the drawer's own property cells stay
    // disabled, same as any other locked table.
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("does not expose an editor when Enter is pressed on a row", async () => {
    setup();

    const row = findRow("Omega");
    fireEvent.keyDown(row, { key: "Enter" });

    expect(await screen.findByRole("heading", { name: "Omega" })).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("does nothing when Enter is pressed on a cell directly (only the row is a tab stop)", () => {
    setup();

    const cell = propertyCell("Alpha", "notes");
    fireEvent.keyDown(cell, { key: "Enter" });

    expect(
      screen.queryByRole("heading", { name: "Alpha" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("header menu offers sort/filter/hide/freeze but not rename or delete", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Status" }));

    expect(
      await screen.findByRole("menuitem", { name: "Filter" }),
    ).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Sort" })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Group" })).toBeVisible();
    expect(
      screen.getByRole("menuitem", { name: "Freeze up to column" }),
    ).toBeVisible();
    expect(
      screen.getByRole("menuitem", { name: "Hide in view" }),
    ).toBeVisible();

    expect(
      screen.queryByRole("menuitem", { name: "Delete property" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("menuitem", { name: "Duplicate property" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("menuitem", { name: "Change type" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("menuitem", { name: /Insert (left|right)/ }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("view settings menu has no lock toggle or schema editor", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Settings" }));

    expect(
      await screen.findByRole("menuitem", { name: "Filter" }),
    ).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Sort" })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Group" })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "Properties" })).toBeVisible();
    expect(
      screen.queryByRole("menuitem", { name: /lock database/i }),
    ).not.toBeInTheDocument();
  });

  it("calls onRowClick with the row id and row instance when a row is clicked", async () => {
    const onRowClick = vi.fn();
    const { user } = setup({ onRowClick });

    const cell = propertyCell("Alpha", "notes");
    await user.click(cell);

    expect(onRowClick).toHaveBeenCalledTimes(1);
    const [rowId, row] = onRowClick.mock.calls[0] as [string, RowInstance];
    expect(rowId).toBe("row-alpha");
    expect(row.id).toBe("row-alpha");
  });

  it("renders renderRowDetail content inside the opened row's drawer", async () => {
    const { user } = setup({
      renderRowDetail: (row) => (
        <div data-testid="custom-row-detail">Custom detail for {row.id}</div>
      ),
    });

    await user.click(propertyCell("Omega", "notes"));

    expect(await screen.findByTestId("custom-row-detail")).toHaveTextContent(
      "Custom detail for row-omega",
    );
  });

  it("toolbar search still filters rows", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.type(
      screen.getByRole("textbox", { name: "Search table" }),
      "Omega",
    );

    expect(screen.getByRole("row", { name: /Omega/ })).toBeVisible();
    expect(
      screen.queryByRole("row", { name: /Alpha/ }),
    ).not.toBeInTheDocument();
  });
});
