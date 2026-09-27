import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { StatCard, StatCardGrid } from "./stat-card";

describe("StatCard", () => {
  it("StatCard_Rendered_ShowsLabelValueAndCaption", () => {
    render(
      <StatCard label="Active machines" value="42" caption="+3 this week" />,
    );

    expect(screen.getByText("Active machines")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("+3 this week")).toBeInTheDocument();
  });

  it("StatCard_WithHref_RendersLinkNamedByLabel", () => {
    render(<StatCard label="Active machines" value="42" href="/machines" />);

    const link = screen.getByRole("link", { name: "Active machines" });
    expect(link).toHaveAttribute("href", "/machines");
  });

  it("StatCard_WithOnClick_RendersButtonNamedByLabel", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<StatCard label="Active machines" value="42" onClick={onClick} />);

    const button = screen.getByRole("button", { name: "Active machines" });
    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("StatCard_WithoutHrefOrOnClick_RendersStaticContainer", () => {
    render(<StatCard label="Active machines" value="42" />);

    expect(
      screen.queryByRole("link", { name: "Active machines" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Active machines" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Active machines")).toBeInTheDocument();
  });

  it("StatCard_WithTone_SetsDataToneAttribute", () => {
    render(<StatCard label="Errors" value="7" tone="danger" />);

    expect(screen.getByText("Errors").closest("[data-tone]")).toHaveAttribute(
      "data-tone",
      "danger",
    );
  });
});

describe("StatCardGrid", () => {
  it("StatCardGrid_Rendered_RendersChildren", () => {
    render(
      <StatCardGrid>
        <StatCard label="Active machines" value="42" />
      </StatCardGrid>,
    );

    expect(screen.getByText("Active machines")).toBeInTheDocument();
  });
});
