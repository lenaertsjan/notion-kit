import { Icon } from "@notion-kit/icons";
import { countFilterRules, TableViewMenuPage } from "@notion-kit/table-hook";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  MenuItemSelect,
} from "@notion-kit/ui/primitives";

import { MenuHeader } from "@/common";
import { EditGroupMenu } from "@/menus/edit-group-menu";
import { SelectGroupMenu } from "@/menus/select-group-menu";
import { SortMenu } from "@/menus/sort-menu";
import {
  FILTER_MENU_TOOLBAR_TRIGGER_ID,
  useMenuCoordinator,
  useTableViewCtx,
} from "@/table-contexts";

import { ReadOnlyPropsMenu } from "./read-only-props-menu";

/**
 * Read-only counterpart of `@/menus/table-view-menu`'s `TableViewMenu`.
 *
 * Only handles the pages a read-only console needs (Sort, Group, Properties)
 * and reuses their existing implementations unchanged (`SortMenu`,
 * `SelectGroupMenu`, `EditGroupMenu` have no data-mutating side effects of
 * their own). It deliberately has no case for `Props`'s sibling pages
 * (`CreateProp`, `EditProp`, `ChangePropType`, `DeletedProps`) or `Layout`:
 * navigating to any of those falls through to the default view-settings
 * page instead. There is also no "Lock/Unlock database" item — unlike the
 * full editor, a read-only table's lock can't be toggled from the UI.
 */
export function ReadOnlyTableViewMenu() {
  const { table } = useTableViewCtx();

  return (
    <table.Subscribe
      selector={(state) => ({
        menu: state.menu,
        sorting: state.sorting,
        grouping: state.grouping,
        groupingState: state.groupingState,
        columnsInfo: state.columnsInfo,
      })}
    >
      {() => <ReadOnlyTableViewMenuContent />}
    </table.Subscribe>
  );
}

function ReadOnlyTableViewMenuContent() {
  const { table } = useTableViewCtx();
  const menu = table.getTableMenuState();

  switch (menu.page) {
    case TableViewMenuPage.Sort:
      return (
        <>
          <MenuHeader
            id="sort"
            title="Sort"
            onBack={() => table.setTableMenuState({ open: true, page: null })}
          />
          <SortMenu />
        </>
      );
    case TableViewMenuPage.Props:
      return <ReadOnlyPropsMenu />;
    case TableViewMenuPage.SelectGroupBy:
      return <SelectGroupMenu />;
    case TableViewMenuPage.EditGroupBy:
      return <EditGroupMenu />;
    default:
      return <ReadOnlySettingsMenu />;
  }
}

function ReadOnlySettingsMenu() {
  const { filterMenu } = useMenuCoordinator();
  const { table } = useTableViewCtx();
  const groupedColumn = table.getGroupedColumnInfo();
  const filterCount = countFilterRules(table.getFilters());
  const sortingCount = table.atoms.sorting.get().length;
  const openMenu = (page: TableViewMenuPage) =>
    table.setTableMenuState({ open: true, page });

  return (
    <>
      <MenuHeader id="view-settings" title="View Settings" />
      <DropdownMenuGroup>
        <DropdownMenuItem
          icon={<Icon.FilterSmall />}
          label="Filter"
          onClick={() => filterMenu.handle.open(FILTER_MENU_TOOLBAR_TRIGGER_ID)}
        >
          <MenuItemSelect>{filterCount || ""}</MenuItemSelect>
        </DropdownMenuItem>
        <DropdownMenuItem
          closeOnClick={false}
          icon={<Icon.ArrowUpDown />}
          label="Sort"
          onClick={() => openMenu(TableViewMenuPage.Sort)}
        >
          <MenuItemSelect>{sortingCount || ""}</MenuItemSelect>
        </DropdownMenuItem>
        <DropdownMenuItem
          closeOnClick={false}
          icon={<Icon.SquareGridBelowLines />}
          label="Group"
          onClick={() =>
            openMenu(
              groupedColumn
                ? TableViewMenuPage.EditGroupBy
                : TableViewMenuPage.SelectGroupBy,
            )
          }
        >
          <MenuItemSelect>{groupedColumn?.name ?? ""}</MenuItemSelect>
        </DropdownMenuItem>
        <DropdownMenuItem
          closeOnClick={false}
          icon={<Icon.Sliders />}
          label="Properties"
          onClick={() => openMenu(TableViewMenuPage.Props)}
        />
      </DropdownMenuGroup>
    </>
  );
}
