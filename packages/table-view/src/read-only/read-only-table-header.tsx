import { Row } from "@/common";
import { useTableViewCtx } from "@/table-contexts";

import { ReadOnlyTableHeaderCell } from "./read-only-table-header-cell";

/**
 * Read-only counterpart of `TableHeader`/`DndTableHeader`.
 *
 * Drops the "+" (add column) button, the "select all rows" checkbox, and the
 * "..." properties menu that the full header row renders unconditionally
 * (the header row's own dots-menu isn't gated by `locked`, unlike most other
 * mutating affordances in the editor, so reusing it as-is would leave a
 * schema-editing escape hatch). Column drag-reordering is dropped too, for
 * the same reasons as `ReadOnlyTableHeaderCell`.
 */
export function ReadOnlyTableHeader() {
  return (
    <div className="h-[34px]">
      <div className="w-full" style={{ overflowX: "initial" }}>
        <div className="w-[initial]">
          <div className="relative">
            <ReadOnlyTableHeaderRow />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyTableHeaderRow() {
  const { table } = useTableViewCtx();

  return (
    <table.Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnVisibility: state.columnVisibility,
        columnPinning: state.columnPinning,
        columnSizing: state.columnSizing,
        columnResizing: state.columnResizing,
        columnsInfo: state.columnsInfo,
      })}
    >
      {() => {
        const headers = table.getCenterLeafHeaders();
        const startPinnedHeaders = table.getStartLeafHeaders();

        return (
          <Row.Root
            role="row"
            data-notion-slot="notion-table-view-header-row"
            dir="ltr"
            className="inset-x-0 box-border h-[34px] bg-main shadow-header-row"
          >
            <Row.Content>
              <Row.StickyContent
                id="draggable-ghost-section-left"
                className="z-(--z-col) shadow-header-sticky"
              >
                {startPinnedHeaders.map((header) => (
                  <ReadOnlyTableHeaderCell key={header.id} header={header} />
                ))}
              </Row.StickyContent>
              <div id="draggable-ghost-section-center" className="flex">
                {headers.map((header) => (
                  <ReadOnlyTableHeaderCell key={header.id} header={header} />
                ))}
              </div>
            </Row.Content>
          </Row.Root>
        );
      }}
    </table.Subscribe>
  );
}
