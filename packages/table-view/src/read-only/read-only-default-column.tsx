import type { TableInstance } from "@notion-kit/table-hook";

import { Cell } from "@/common";

import { ReadOnlyCellValue } from "./read-only-cell";
import { ReadOnlyTableHeaderCell } from "./read-only-table-header-cell";

/**
 * `defaultColumn` is the one place `table-hook`'s bare table defers all
 * cell/header/footer rendering to (its own internal default is `() => null`
 * for each, see `table-hook/src/table-contexts/column.tsx`) — `table-view`'s
 * `TableView`/`TableViewWrapper` already supply their own, and a caller's
 * `defaultColumn` prop overrides it (`TableViewWrapper` spreads `...props`
 * after its default). That makes it the natural, already-supported extension
 * point for swapping cell rendering wholesale instead of patching every
 * plugin's `renderCell` call site.
 *
 * This variant renders every cell through `ReadOnlyCellValue`
 * (`renderReadOnlyValue`) instead of `renderCell`, and every header through
 * `ReadOnlyTableHeaderCell`. It only handles the "table" layout: read-only
 * board/list/timeline/calendar rendering is out of scope for this preset.
 */
export const readOnlyDefaultColumn: NonNullable<
  TableInstance["options"]["defaultColumn"]
> = {
  size: 200,
  minSize: 100,
  maxSize: Number.MAX_SAFE_INTEGER,
  header: ({ table, header }) => {
    const { layout } = table.getTableGlobalState();
    if (layout !== "table") return null;
    return <ReadOnlyTableHeaderCell header={header} />;
  },
  cell: ({ table, cell }) => {
    const { layout } = table.getTableGlobalState();
    if (layout !== "table") return null;

    const info = cell.getInfo();
    return (
      <Cell.Root
        cell={cell}
        table={table}
        surface="table"
        wrapped={info.wrapped}
      >
        <Cell.TableFrame role="cell">
          <ReadOnlyCellValue cell={cell} />
        </Cell.TableFrame>
      </Cell.Root>
    );
  },
  footer: () => null,
};
