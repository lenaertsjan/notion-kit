import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DescriptionList, DescriptionListItem } from "./description-list";

describe("DescriptionList", () => {
  it("DescriptionList_Render_ShowsTermsAndDefinitionsWithRoles", () => {
    render(
      <DescriptionList
        items={[
          { key: "owner", term: "Owner", value: "Ada Lovelace" },
          { key: "status", term: "Status", value: "Active" },
        ]}
      />,
    );

    const terms = screen.getAllByRole("term");
    const definitions = screen.getAllByRole("definition");

    expect(terms.map((term) => term.textContent)).toEqual(["Owner", "Status"]);
    expect(definitions.map((definition) => definition.textContent)).toEqual([
      "Ada Lovelace",
      "Active",
    ]);
  });

  it("DescriptionList_ColumnsTwo_AppliesResponsiveGridClass", () => {
    const { container } = render(
      <DescriptionList
        columns={2}
        items={[{ term: "Owner", value: "Ada Lovelace" }]}
      />,
    );

    expect(container.querySelector("dl")).toHaveClass("sm:grid-cols-2");
  });
});

describe("DescriptionListItem", () => {
  it("DescriptionListItem_ManualComposition_RendersWithinList", () => {
    render(
      <dl>
        <DescriptionListItem term="Owner" value="Ada Lovelace" />
      </dl>,
    );

    const term = screen.getByRole("term");
    const definition = screen.getByRole("definition");

    expect(term).toHaveTextContent("Owner");
    expect(definition).toHaveTextContent("Ada Lovelace");
  });
});
