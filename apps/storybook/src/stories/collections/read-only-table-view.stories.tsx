import type { Meta, StoryObj } from "storybook-react-rsbuild";

import { createMockFullTableFixture } from "@notion-kit/table-hook/mock";
import { ReadOnlyTableView } from "@notion-kit/table-view/read-only";

const { properties: mockProps, data: mockData } = createMockFullTableFixture();

const meta = {
  title: "Collections/Read Only Table View",
  parameters: {
    layout: "fullscreen",
  },
  decorators: (Story) => (
    <div className="py-24">
      <p className="mb-3 px-24 text-sm text-secondary">
        Every operator affordance stays available — search, filter, sort, group,
        and show/hide columns — but nothing here edits a row: there is no
        add-row control, no drag-reorder, no cell editors, and no delete/rename
        in the column menus. Click a row to open its read-only detail drawer.
      </p>
      <Story />
    </div>
  ),
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="px-24">
      <ReadOnlyTableView defaultProperties={mockProps} defaultData={mockData} />
    </div>
  ),
};

export const WithRowClickHandler: Story = {
  render: () => (
    <div className="px-24">
      <ReadOnlyTableView
        defaultProperties={mockProps}
        defaultData={mockData}
        onRowClick={(rowId) => console.log("Row clicked:", rowId)}
      />
    </div>
  ),
};

export const WithCustomRowDetail: Story = {
  render: () => (
    <div className="px-24">
      <ReadOnlyTableView
        defaultProperties={mockProps}
        defaultData={mockData}
        renderRowDetail={(row) => (
          <div className="mt-4 rounded-md border border-border bg-secondary/40 p-3 text-sm">
            <p className="font-medium">Operator notes</p>
            <p className="text-secondary">
              Custom read-only content for row <code>{row.id}</code> rendered
              via <code>renderRowDetail</code>, below the standard property
              list.
            </p>
          </div>
        )}
      />
    </div>
  ),
};
