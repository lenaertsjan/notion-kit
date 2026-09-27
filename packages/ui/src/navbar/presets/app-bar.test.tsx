import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AppBar } from "./app-bar";

const breadcrumbs = [
  { label: "Workspace", href: "/workspace" },
  { label: "Project", onClick: vi.fn() },
  { label: "Settings" },
];

describe("AppBar", () => {
  it("AppBar_WithBreadcrumbs_RendersTrailWithLinksAndCurrentPage", () => {
    render(<AppBar brand="Bliv" breadcrumbs={breadcrumbs} />);

    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    const items = within(nav).getAllByRole("listitem");
    expect(items).toHaveLength(3);

    expect(
      within(nav).getByRole("link", { name: "Workspace" }),
    ).toHaveAttribute("href", "/workspace");
    expect(
      within(nav).getByRole("button", { name: "Project" }),
    ).toBeInTheDocument();

    const current = within(nav).getByText("Settings");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("AppBar_BreadcrumbWithOnClick_InvokesHandler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <AppBar
        brand="Bliv"
        breadcrumbs={[{ label: "Project", onClick }, { label: "Settings" }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Project" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("AppBar_NoUser_DoesNotRenderAccountMenu", () => {
    render(<AppBar brand="Bliv" />);

    expect(
      screen.queryByRole("button", { name: "Account menu" }),
    ).not.toBeInTheDocument();
  });

  it("AppBar_AccountMenuTrigger_OpensMenuWithNameAndEmail", async () => {
    const user = userEvent.setup();
    render(
      <AppBar
        brand="Bliv"
        user={{ name: "Ada Lovelace", email: "ada@example.com" }}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Account menu" });
    await user.click(trigger);

    const menu = await screen.findByRole("menu");
    expect(within(menu).getByText("Ada Lovelace")).toBeInTheDocument();
    expect(within(menu).getByText("ada@example.com")).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitem", { name: "Sign out" }),
    ).toBeInTheDocument();
  });

  it("AppBar_SignOutSelected_CallsOnSignOut", async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn();
    render(
      <AppBar
        brand="Bliv"
        user={{ name: "Ada Lovelace" }}
        onSignOut={onSignOut}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Account menu" }));
    const signOut = await screen.findByRole("menuitem", { name: "Sign out" });
    await user.click(signOut);

    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
