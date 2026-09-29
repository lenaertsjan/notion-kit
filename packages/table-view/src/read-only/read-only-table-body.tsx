import React from "react";
import { flexRender } from "@tanstack/react-table";

import { cn } from "@notion-kit/cn";
import type { CellInstance, RowInstance } from "@notion-kit/table-hook";

import { Row } from "@/common";
import { TableGroupedRow } from "@/table-body";
import { useTableViewCtx } from "@/table-contexts";

const INTERACTIVE_SELECTOR =
  'button, a[href], input, textarea, select, [contenteditable="true"], [role="button"]';

function isInteractiveTarget(target: EventTarget | null, root: HTMLElement) {
  if (!(target instanceof Element) || !root.contains(target)) return false;
  return !!target.closest(INTERACTIVE_SELECTOR);
}

export type ReadOnlyRowClickHandler = (rowId: string, row: RowInstance) => void;

/**
 * Read-only counterpart of `DndTableBody`.
 *
 * No `Sortable` wrapper (rows can't be reordered), no "New page" add-row
 * button, and no confirm-remove-sorting dialog (that dialog only exists to
 * guard a drag operation, which no longer happens here). Grouped rows reuse
 * `TableGroupedRow` unchanged: it already renders no add-row/select-all UI
 * when the table is locked, and never depended on drag-and-drop.
 */
export function ReadOnlyTableBody({
  onRowClick,
  emptyState,
}: {
  onRowClick?: ReadOnlyRowClickHandler;
  emptyState?: React.ReactNode;
}) {
  const { table } = useTableViewCtx();

  return (
    <table.Subscribe
      selector={(state) => ({
        sorting: state.sorting,
        grouping: state.grouping,
        groupingState: state.groupingState,
        expanded: state.expanded,
        columnOrder: state.columnOrder,
        columnVisibility: state.columnVisibility,
        columnPinning: state.columnPinning,
        columnResizing: state.columnResizing,
        columnsInfo: state.columnsInfo,
      })}
    >
      {() => {
        const rows = table.getRowModel().rows;
        return (
          <div className="relative isolation-auto min-w-[708px]">
            {rows.length === 0 && (
              <div role="row">
                <div
                  role="cell"
                  aria-colspan={table.getVisibleLeafColumns().length}
                >
                  {table.getCoreRowModel().rows.length === 0 && emptyState ? (
                    emptyState
                  ) : (
                    <p
                      role="status"
                      className="px-4 py-12 text-sm text-secondary"
                    >
                      No matching records. Try changing your search or filters.
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="relative">
              {rows.map((row) =>
                row.getIsGrouped() ? (
                  <TableGroupedRow key={row.id} row={row} />
                ) : (
                  <ReadOnlyTableRow
                    key={row.id}
                    row={row}
                    onRowClick={onRowClick}
                  />
                ),
              )}
            </div>
          </div>
        );
      }}
    </table.Subscribe>
  );
}

interface ReadOnlyTableRowProps {
  row: RowInstance;
  onRowClick?: ReadOnlyRowClickHandler;
}

function ReadOnlyTableRow({ row, onRowClick }: ReadOnlyTableRowProps) {
  const { table } = useTableViewCtx();

  const openRow = () => {
    table.openRow(row.id);
    onRowClick?.(row.id, row);
  };

  return (
    <Row.Root
      data-notion-slot="notion-table-view-row"
      data-block-id={row.id}
      role="row"
      dir="ltr"
      tabIndex={0}
      className={cn(
        "h-[calc(100%+2px)] cursor-pointer border-b border-b-border-cell",
        row.getIsFirstChild() && "border-t border-t-border-cell",
      )}
      onClick={(event) => {
        // React portal events bubble through the row even when the menu or
        // dialog lives outside it. Those actions must not open another modal.
        if (
          !(event.target instanceof Node) ||
          !event.currentTarget.contains(event.target)
        )
          return;
        if (isInteractiveTarget(event.target, event.currentTarget)) return;
        event.currentTarget.focus();
        openRow();
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.currentTarget.focus();
        openRow();
      }}
    >
      <Row.Content>
        <Row.StickyContent>
          <TableCells cells={row.getStartVisibleCells()} />
        </Row.StickyContent>
        <TableCells cells={row.getCenterVisibleCells()} />
      </Row.Content>
      <div aria-hidden="true" className="min-w-16 grow" />
    </Row.Root>
  );
}

function TableCells({ cells }: { cells: CellInstance[] }) {
  return cells.map((cell) => (
    <React.Fragment key={cell.id}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </React.Fragment>
  ));
}
