"use client";

import { createMockTableFixture } from "@notion-kit/table-hook/mock";
import { ReadOnlyTableView } from "@notion-kit/table-view/read-only";

const { properties: mockProps, data: mockData } = createMockTableFixture();

export default function Demo() {
  return (
    <div className="w-full min-w-0">
      <p className="mb-3 text-sm text-secondary">
        Search, filter, sort, group, and show/hide columns all work. Nothing
        here edits a row: there is no add-row control, no drag-reorder, no cell
        editors, and no delete/rename in the column menus. Click a row to open
        its read-only detail drawer.
      </p>
      <ReadOnlyTableView defaultProperties={mockProps} defaultData={mockData} />
    </div>
  );
}
