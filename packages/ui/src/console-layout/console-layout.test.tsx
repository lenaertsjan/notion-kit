import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ConsoleLayout } from "./console-layout";

function setup() {
  render(
    <ConsoleLayout
      brand="bliv"
      navigationLabel="Workspace navigation"
      navigation={<a href="#machines">Machines</a>}
      contextBar={<span>Workspace</span>}
    >
      <h1>Overview</h1>
    </ConsoleLayout>,
  );
  return userEvent.setup();
}

afterEach(() => vi.restoreAllMocks());

describe("ConsoleLayout", () => {
  it("provides one main landmark and restores desktop navigation after collapse", async () => {
    const user = setup();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(
      within(
        screen.getByRole("navigation", { name: "Workspace navigation" }),
      ).getByRole("link", { name: "Machines" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close sidebar" }));
    await user.click(screen.getByRole("button", { name: "Open sidebar" }));
    expect(
      screen.queryByRole("button", { name: "Open sidebar" }),
    ).not.toBeInTheDocument();
  });

  it("labels the mobile sheet and dismisses it after navigating", async () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(390);
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Open sidebar" }));
    const dialog = await screen.findByRole("dialog", {
      name: "Workspace navigation",
    });
    await user.click(within(dialog).getByRole("link", { name: "Machines" }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole("button", { name: "Open sidebar" }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});
