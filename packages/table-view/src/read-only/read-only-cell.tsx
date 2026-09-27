import type { CellInstance } from "@notion-kit/table-hook";

import type { ReadOnlyValueProps } from "@/plugins/registry";
import { useTableViewCtx } from "@/table-contexts";

/**
 * Renders a cell's live value through the plugin's `renderReadOnlyValue`
 * adapter instead of `renderCell`.
 *
 * `renderReadOnlyValue` already exists on every built-in plugin to display
 * historical edit-log snapshots (see `@/edit-log`). It renders a plain,
 * non-interactive value with no `CellTrigger`/popover wiring, which is
 * exactly what a live read-only cell needs too: no editor can be opened,
 * and clicks are free to bubble up to the row (see `ReadOnlyTableRow`).
 *
 * The adapter below feeds it the cell's *current* value/config instead of a
 * logged snapshot. Every implementation validates its input with `zod` and
 * falls back to `textValue` on a mismatch, so unusual shapes (e.g. computed
 * `created-time`/`last-edited-time` cells) degrade to plain text instead of
 * crashing.
 */
export function ReadOnlyCellValue({ cell }: { cell: CellInstance }) {
  const { plugins } = useTableViewCtx();
  const plugin = cell.getPlugin();
  const uiPlugin = plugins.getUiPlugin(plugin.id);
  const info = cell.getInfo();
  const textValue = cell.getTextValue();

  if (!uiPlugin.renderReadOnlyValue) return <>{textValue}</>;

  const props: ReadOnlyValueProps = {
    value: cell.getData(),
    config: info.config,
    property: {
      id: cell.column.id,
      name: info.name,
      icon: info.icon,
      type: info.type,
      config: info.config,
    },
    textValue,
  };

  return <>{uiPlugin.renderReadOnlyValue(props)}</>;
}
