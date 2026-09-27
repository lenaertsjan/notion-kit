import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageHeader } from "./page-header";

describe("PageHeader", () => {
  it("PageHeader_Rendered_ShowsTitleAsLevelOneHeading", () => {
    render(<PageHeader title="Machines" />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Machines" }),
    ).toBeInTheDocument();
  });

  it("PageHeader_WithActions_RendersActions", () => {
    render(
      <PageHeader
        title="Machines"
        actions={<button type="button">Add machine</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Add machine" }),
    ).toBeInTheDocument();
  });

  it("PageHeader_WithEyebrowAndSubtitle_RendersBoth", () => {
    render(
      <PageHeader
        eyebrow="Fleet"
        title="Machines"
        subtitle="All machines across regions"
      />,
    );

    expect(screen.getByText("Fleet")).toBeInTheDocument();
    expect(screen.getByText("All machines across regions")).toBeInTheDocument();
  });
});
