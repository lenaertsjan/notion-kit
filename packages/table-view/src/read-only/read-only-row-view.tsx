import type { ReactNode } from "react";

import type { RowInstance } from "@notion-kit/table-hook";

import { DialogView } from "@/row-view/dialog-view";
import { FullView } from "@/row-view/full-view";
import { SideView } from "@/row-view/side-view";
import { useTableViewCtx } from "@/table-contexts";

export type RenderRowDetail = (row: RowInstance) => ReactNode;

/**
 * The read-only table's "detail drawer".
 *
 * `SideView` (and its siblings `FullView`/`DialogView`, used when a caller
 * sets `view.rowView` to `"full"`/`"center"`) is the existing "open row"
 * mechanism (`table.openRow`) that already renders a right-hand side panel.
 * It already becomes fully inert once the table is locked: `ViewProps`
 * disables its property menu triggers and marks the cell area `inert`, so no
 * property can be edited from here either.
 *
 * Rather than duplicate that panel, this re-mounts the three view components
 * unchanged and only adds a `children` slot — which they already accept and
 * render below the property list — wired to `renderRowDetail`. All row
 * navigation inside the panel (close, switch peek mode, open in full page,
 * previous/next row) keeps working exactly as it does in the full editor.
 */
export function ReadOnlyRowView({
  renderRowDetail,
}: {
  renderRowDetail?: RenderRowDetail;
}) {
  return (
    <>
      <DialogView>
        <RowDetailSlot renderRowDetail={renderRowDetail} />
      </DialogView>
      <SideView>
        <RowDetailSlot renderRowDetail={renderRowDetail} />
      </SideView>
      <FullView>
        <RowDetailSlot renderRowDetail={renderRowDetail} />
      </FullView>
    </>
  );
}

function RowDetailSlot({
  renderRowDetail,
}: {
  renderRowDetail?: RenderRowDetail;
}) {
  const { table } = useTableViewCtx();

  return (
    <table.Subscribe selector={(state) => state.tableGlobal.openedRowId}>
      {(openedRowId) => {
        if (!renderRowDetail || !openedRowId) return null;
        const row = table.getCoreRowModel().rowsById[openedRowId];
        return row ? <>{renderRowDetail(row)}</> : null;
      }}
    </table.Subscribe>
  );
}
