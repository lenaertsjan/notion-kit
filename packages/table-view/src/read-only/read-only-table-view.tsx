import type { PartialTableViewState, TableProps } from "@notion-kit/table-hook";
import type { CellPlugin } from "@notion-kit/table-hook/plugins";

import { Table } from "@/common";
import {
  DEFAULT_PLUGINS,
  type DefaultPlugins,
  type TablePluginPair,
} from "@/plugins";
import {
  MenuCoordinatorProvider,
  TableViewWrapper,
  useTableViewCtx,
} from "@/table-contexts";

import { readOnlyDefaultColumn } from "./read-only-default-column";
import { ReadOnlyRowView, type RenderRowDetail } from "./read-only-row-view";
import type { ReadOnlyRowClickHandler } from "./read-only-table-body";
import { ReadOnlyTableBody } from "./read-only-table-body";
import { ReadOnlyTableHeader } from "./read-only-table-header";
import type { ReadOnlyToolbarVariant } from "./read-only-toolbar";
import { ReadOnlyViewControls } from "./read-only-view-controls";

export type {
  ReadOnlyRowClickHandler,
  RenderRowDetail,
  ReadOnlyToolbarVariant,
};

export type ReadOnlyTableViewProps<
  TPlugins extends CellPlugin[] = DefaultPlugins,
> = Omit<TableProps<TPlugins>, "plugins"> & {
  plugins?: TablePluginPair<TPlugins>;
  /**
   * Called when a row is clicked anywhere outside of an interactive child
   * (links, buttons, form controls). Fires alongside the table's own
   * "open row" behaviour (`table.openRow`), which opens the read-only detail
   * drawer — see `ReadOnlyRowView` — so this is an *additional* hook for a
   * consumer's own side effects (routing, analytics, syncing external
   * state), not a replacement for it.
   */
  onRowClick?: ReadOnlyRowClickHandler;
  /**
   * Renders extra content inside the row detail drawer, below the read-only
   * property list every row already shows.
   */
  renderRowDetail?: RenderRowDetail;
  /**
   * Omit the built-in property list from the row detail drawer, so
   * `renderRowDetail` is the only detail content.
   */
  hideRowProperties?: boolean;
  /** Toolbar style: compact Notion icons, or labelled chips with a search box. */
  toolbar?: ReadOnlyToolbarVariant;
};

/**
 * Forces the table into a permanently locked state.
 *
 * `locked` (`TableViewState.locked`) is the table-hook flag that already
 * disables cell editors, hides the add-row control and row-action menu, and
 * disables row drag-and-drop across every layout (see e.g.
 * `plugins/renderers.tsx`, `table-body/table-row.tsx`,
 * `row-view/view-props.tsx`). `ReadOnlyTableView` forces it on unconditionally
 * so consumers can't accidentally (or a future edit accidentally) render an
 * editable table by omitting it. There is deliberately no UI in this preset
 * that calls `table.toggleTableLocked`, so once set it can't be flipped back
 * from within the table itself.
 */
function forceLocked<TPlugins extends CellPlugin[]>(
  props: Omit<TableProps<TPlugins>, "plugins" | "defaultColumn">,
): Omit<TableProps<TPlugins>, "plugins" | "defaultColumn"> {
  const { view, defaultView, ...rest } = props as typeof props & {
    view?: PartialTableViewState;
    defaultView?: PartialTableViewState;
  };
  if (view) {
    return { ...rest, view: { ...view, locked: true } } as typeof props;
  }
  return {
    ...rest,
    defaultView: { ...defaultView, locked: true },
  } as typeof props;
}

/**
 * A read-only preset of `TableView` for data an operator can view, filter,
 * sort, and group, but never edit.
 *
 * It reuses `TableViewWrapper` (the same context/state provider `TableView`
 * itself is built on) and swaps in:
 * - `readOnlyDefaultColumn` — cells render through each plugin's
 *   `renderReadOnlyValue` instead of `renderCell`, and headers through
 *   `ReadOnlyTableHeaderCell`. Any `defaultColumn` passed in props is
 *   ignored: cell/header rendering is the mechanism this preset's read-only
 *   guarantee rests on, so it isn't a caller-overridable option.
 * - `ReadOnlyTableBody` — a non-sortable body with no add-row control.
 * - `ReadOnlyViewControls` — the toolbar and active filter/sort bar, without
 *   the bulk-edit bar.
 * - `ReadOnlyRowView` — the same side/full/dialog "open row" panels as the
 *   full editor (already read-only once locked), extended with
 *   `renderRowDetail`.
 *
 * Board/List/Timeline/Calendar layouts are out of scope: this preset always
 * renders the table (grid) layout regardless of `view.layout`.
 */
export function ReadOnlyTableView<
  TPlugins extends CellPlugin[] = DefaultPlugins,
>({
  children,
  onRowClick,
  renderRowDetail,
  hideRowProperties,
  toolbar = "icons",
  plugins = DEFAULT_PLUGINS as unknown as TablePluginPair<TPlugins>,
  ...rest
}: ReadOnlyTableViewProps<TPlugins>) {
  const { defaultColumn: _ignoredDefaultColumn, ...props } = rest;
  const wrapperProps = forceLocked<TPlugins>(props);

  return (
    <TableViewWrapper<TPlugins>
      {...wrapperProps}
      plugins={plugins}
      defaultColumn={
        readOnlyDefaultColumn as TableProps<TPlugins>["defaultColumn"]
      }
    >
      <MenuCoordinatorProvider>
        <Table.Root className="flex flex-col gap-4">
          <Table.Content
            data-slot="table-view-toolbar-container"
            className="sticky top-0 z-(--z-row) w-full min-w-0 overflow-x-clip bg-main pb-2"
          >
            <ReadOnlyViewControls toolbar={toolbar} />
          </Table.Content>
          <ReadOnlyContent onRowClick={onRowClick} />
          {children}
        </Table.Root>
        <ReadOnlyRowView
          renderRowDetail={renderRowDetail}
          hideRowProperties={hideRowProperties}
        />
      </MenuCoordinatorProvider>
    </TableViewWrapper>
  );
}

function ReadOnlyContent({
  onRowClick,
}: {
  onRowClick?: ReadOnlyRowClickHandler;
}) {
  const { table } = useTableViewCtx();

  return (
    <div
      data-slot="table-view-scroll-container"
      className="w-full min-w-0 overflow-x-auto"
    >
      <table.Subscribe
        selector={(state) => ({
          columnResizing: state.columnResizing,
          columnSizing: state.columnSizing,
          // `ReadOnlyTableBody` reads `table.getRowModel()` straight from
          // the table instance rather than from this selector, so it only
          // reflects filtering/search once *something* it's nested under
          // re-renders. Subscribing to these here (unused otherwise) is
          // what forces that re-render — mirrors `TableViewWrapper`'s
          // `Content()`, which subscribes to the same fields for the same
          // reason.
          globalFilter: state.globalFilter as unknown,
          filters: state.tableGlobal.filters as unknown,
        })}
      >
        {() => {
          // `column.getWidth()` returns `calc(var(--col-<id>-size) * 1px)`
          // (see `table-hook/src/features/columns-info.ts`), so these CSS
          // variables must be defined on an ancestor or every column
          // collapses to 0 width. Mirrors `TableViewContent`.
          const columnSizeVars = table
            .getFlatHeaders()
            .reduce<Record<string, number>>(
              (sizes, header) => ({
                ...sizes,
                [`--header-${header.id}-size`]: header.getSize(),
                [`--col-${header.column.id}-size`]: header.column.getSize(),
              }),
              {},
            );

          return (
            <Table.Content
              role="table"
              data-notion-slot="notion-table-view"
              className="relative float-left min-w-full pb-0 lining-nums tabular-nums select-none"
            >
              <div className="relative" style={columnSizeVars}>
                <ReadOnlyTableHeader />
                <ReadOnlyTableBody onRowClick={onRowClick} />
              </div>
            </Table.Content>
          );
        }}
      </table.Subscribe>
    </div>
  );
}
