import { Icon } from "@notion-kit/icons";
import { appendFilterNode, createFilterRule } from "@notion-kit/table-hook";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from "@notion-kit/ui/primitives";

import { CalcMenu } from "@/menus/calc-menu";
import {
  getDefaultSortingMethod,
  getSortingDirectionLabels,
} from "@/menus/sorting-options";
import {
  FILTER_MENU_TOOLBAR_TRIGGER_ID,
  useMenuCoordinator,
  useTableViewCtx,
} from "@/table-contexts";

interface ReadOnlyPropMenuProps {
  propId: string;
}

/**
 * The per-column header menu for a read-only table.
 *
 * This is a deliberately trimmed copy of `@/menus/prop-menu`'s `PropMenu`:
 * it keeps only the view-shaping actions (filter, sort, group, calculate,
 * freeze, hide, wrap) and drops everything that edits the property itself
 * (rename/description, change type, insert, duplicate, delete).
 *
 * We can't reuse `PropMenu` and gate it with the table's `locked` flag: the
 * full editor treats `locked` as "disable this whole menu" (see
 * `TableHeaderCellTrigger`), which would also block filter/sort/group/freeze
 * for read-only consumers. Composing a smaller, purpose-built menu keeps
 * those view controls fully functional without touching the shared,
 * already-tested `PropMenu`.
 */
export function ReadOnlyPropMenu({ propId }: ReadOnlyPropMenuProps) {
  const { filterMenu } = useMenuCoordinator();
  const { table } = useTableViewCtx();

  const info = table.getColumnInfo(propId);
  const plugin = table.getColumnPlugin(propId);
  const column = table.getColumn(propId);
  if (!column) return null;

  const defaultSortingMethod = getDefaultSortingMethod(plugin);
  const sortingLabels = getSortingDirectionLabels(defaultSortingMethod);
  const sortColumn = (desc: boolean) => {
    if (defaultSortingMethod) {
      table.setColumnSortingMethod(propId, defaultSortingMethod.id);
    }
    table.setSorting([{ id: propId, desc }]);
  };
  const addFilter = () => {
    const operator = plugin.filtering?.operators[0];
    if (!operator) return;
    const filters = table.getFilters();
    table.setFilters(
      appendFilterNode(
        filters,
        filters?.id ?? "",
        createFilterRule(propId, operator.id),
      ),
    );
    filterMenu.handle.open(FILTER_MENU_TOOLBAR_TRIGGER_ID);
  };
  const canFreeze = table.getCanFreezeColumn(propId);
  const canUnfreeze = table.getFreezingState()?.colId === propId;
  const pinColumns = () => table.toggleColumnFreezed(propId);
  const hideProp = () => table.setColumnInfo(propId, { hidden: true });
  const wrapProp = () => table.toggleColumnWrapped(propId, (v) => !v);

  return (
    <DropdownMenuGroup>
      <DropdownMenuItem
        icon={<Icon.FilterSmall />}
        label="Filter"
        onClick={addFilter}
      />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger icon={<Icon.ArrowUpDown />} label="Sort" />
        <DropdownMenuContent sideOffset={-4} className="w-50">
          <DropdownMenuGroup>
            <DropdownMenuItem
              icon={<Icon.ArrowUp className="size-4" />}
              label={sortingLabels.ascending}
              onClick={() => sortColumn(false)}
            />
            <DropdownMenuItem
              icon={<Icon.ArrowDown className="size-4" />}
              label={sortingLabels.descending}
              onClick={() => sortColumn(true)}
            />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenuSub>
      <table.Subscribe selector={(state) => state.grouping}>
        {(grouping) => (
          <DropdownMenuItem
            icon={<Icon.SquareGridBelowLines />}
            label={grouping.includes(propId) ? "Ungroup" : "Group"}
            onClick={() =>
              table.setGroupingColumn((v) => (v === propId ? null : propId))
            }
          />
        )}
      </table.Subscribe>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger icon={<Icon.Sum />} label="Calculate" />
        <DropdownMenuContent
          sideOffset={-4}
          className="w-50"
          collisionPadding={12}
        >
          <CalcMenu id={propId} />
        </DropdownMenuContent>
      </DropdownMenuSub>
      <DropdownMenuItem
        disabled={!canFreeze}
        onClick={pinColumns}
        {...(canUnfreeze
          ? { icon: <Icon.PinStrikeThrough />, label: "Unfreeze columns" }
          : { icon: <Icon.Pin />, label: "Freeze up to column" })}
        className="[&_svg]:w-3"
      />
      {info.type !== "title" && (
        <DropdownMenuItem
          onClick={hideProp}
          icon={<Icon.EyeHideInversePadded className="size-6" />}
          label="Hide in view"
        />
      )}
      <DropdownMenuItem
        onClick={wrapProp}
        {...(info.wrapped
          ? { icon: <Icon.ArrowLineRight />, label: "Unwrap text" }
          : { icon: <Icon.ArrowUTurnDownLeft />, label: "Wrap text" })}
      />
    </DropdownMenuGroup>
  );
}
