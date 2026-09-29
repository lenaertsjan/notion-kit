import { Icon } from "@notion-kit/icons";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@notion-kit/ui/primitives";

import { ViewProps } from "@/row-view/view-props";
import { useTableViewCtx } from "@/table-contexts";

import type { RenderRowDetail } from "./read-only-row-view";

/** A scoped console inspector; it never changes the editor's row panels. */
export function ConsoleRowView({
  renderRowDetail,
  hideRowProperties,
}: {
  renderRowDetail?: RenderRowDetail;
  hideRowProperties?: boolean;
}) {
  const { table } = useTableViewCtx();
  return (
    <table.Subscribe
      selector={(state) => ({ id: state.tableGlobal.openedRowId })}
    >
      {({ id }) => {
        const row = id ? table.getCoreRowModel().rowsById[id] : undefined;
        const rows = table
          .getRowModel()
          .flatRows.filter((item) => !item.getIsGrouped());
        const index = rows.findIndex((item) => item.id === id);
        const previous = index > 0 ? rows[index - 1] : undefined;
        const next = index >= 0 ? rows[index + 1] : undefined;
        return (
          <Sheet
            open={!!id}
            onOpenChange={(open) => {
              if (!open) table.openRow(null);
            }}
          >
            <SheetContent
              data-slot="console-row-detail"
              hideClose
              className="flex w-full! flex-col overflow-hidden p-0 md:w-[min(75vw,960px)]! md:max-w-none"
            >
              <SheetHeader className="shrink-0 gap-4 border-b px-5 py-4 sm:px-8">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-wide text-secondary uppercase">
                    Record details
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="hint"
                      size="sm"
                      aria-label="Previous row"
                      disabled={!previous}
                      onClick={() => previous && table.openRow(previous.id)}
                    >
                      <Icon.Chevron side="left" />
                    </Button>
                    <Button
                      variant="hint"
                      size="sm"
                      aria-label="Next row"
                      disabled={!next}
                      onClick={() => next && table.openRow(next.id)}
                    >
                      <Icon.Chevron />
                    </Button>
                    <Button
                      variant="hint"
                      size="sm"
                      aria-label="Close row"
                      onClick={() => table.openRow(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
                <SheetTitle className="text-2xl font-semibold break-words">
                  {row
                    ? String(table.getTitleCell(row.id).cell.value || "Details")
                    : "Record no longer available"}
                </SheetTitle>
              </SheetHeader>
              <div className="min-h-0 min-w-0 flex-1 overflow-auto px-5 py-6 sm:px-8">
                {row ? (
                  <>
                    {!hideRowProperties && <ViewProps rowId={row.id} />}
                    <div key={row.id}>{renderRowDetail?.(row)}</div>
                  </>
                ) : (
                  <p role="status" className="text-sm text-secondary">
                    This record was removed or is no longer in this view. Close
                    this panel to return to the list.
                  </p>
                )}
              </div>
            </SheetContent>
          </Sheet>
        );
      }}
    </table.Subscribe>
  );
}
