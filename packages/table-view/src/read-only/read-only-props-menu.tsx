import { useState } from "react";

import { Icon } from "@notion-kit/icons";
import type { ColumnInfo } from "@notion-kit/table-hook";
import { IconBlock } from "@notion-kit/ui/icon-block";
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  Button,
  MenuItemAction,
} from "@notion-kit/ui/primitives";

import { DefaultIcon, MenuGroupHeader, MenuHeader } from "@/common";
import { useTableViewCtx } from "@/table-contexts";

/**
 * Read-only counterpart of `@/menus/props-menu`'s `PropsMenu` (the "columns"
 * panel). Keeps search and show/hide toggling, which the toolbar's
 * "columns" feature is really about, but drops everything that mutates the
 * schema: clicking a row no longer opens the rename/type/delete editor,
 * there is no "New property", no "Deleted properties" (restore), and no
 * column drag-reordering.
 */
export function ReadOnlyPropsMenu() {
  const { table } = useTableViewCtx();
  const [search, setSearch] = useState("");

  return (
    <table.Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnsInfo: state.columnsInfo,
        columnVisibility: state.columnVisibility,
      })}
    >
      {({ columnOrder, columnsInfo, columnVisibility }) => {
        const noShownProps =
          Object.values(columnVisibility).filter(Boolean).length === 1;
        const props = columnOrder.reduce<ColumnInfo[]>((acc, propId) => {
          const info = columnsInfo[propId]!;
          if (!info.isDeleted) acc.push({ ...info, id: propId });
          return acc;
        }, []);

        return (
          <>
            <MenuHeader
              title="Properties"
              onBack={() => table.setTableMenuState({ open: true, page: null })}
            />
            <Autocomplete
              items={props}
              itemToStringValue={(prop) => prop.name}
              value={search}
              onValueChange={setSearch}
              open
              autoHighlight="always"
              openOnInputClick
            >
              <AutocompleteInput
                clear
                onCancel={() => setSearch("")}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Search for a property..."
              />
              <AutocompleteContent variant="inline">
                <AutocompleteList>
                  <AutocompleteGroup>
                    <MenuGroupHeader
                      title="Properties"
                      action={
                        search ? null : noShownProps ? "Show all" : "Hide all"
                      }
                      onActionClick={table.toggleAllColumnsVisible}
                    />
                    <AutocompleteCollection>
                      {(prop: ColumnInfo) => (
                        <ReadOnlyPropertyItem
                          key={prop.id}
                          info={prop}
                          onVisibilityChange={() =>
                            table.setColumnInfo(prop.id, {
                              hidden: !prop.hidden,
                            })
                          }
                        />
                      )}
                    </AutocompleteCollection>
                  </AutocompleteGroup>
                </AutocompleteList>
                <AutocompleteEmpty className="px-3 text-start text-muted">
                  No results
                </AutocompleteEmpty>
              </AutocompleteContent>
            </Autocomplete>
          </>
        );
      }}
    </table.Subscribe>
  );
}

interface ReadOnlyPropertyItemProps {
  info: ColumnInfo;
  onVisibilityChange: () => void;
}

function ReadOnlyPropertyItem({
  info,
  onVisibilityChange,
}: ReadOnlyPropertyItemProps) {
  const { name, icon, hidden, type } = info;

  return (
    <AutocompleteItem
      label={name}
      value={info}
      icon={icon ? <IconBlock icon={icon} /> : <DefaultIcon type={type} />}
      className="*:data-[slot=menu-item-body]:leading-normal"
    >
      <MenuItemAction className="flex items-center text-muted [&_svg]:fill-current">
        <Button
          tabIndex={0}
          aria-label={`Toggle ${name} visibility`}
          disabled={type === "title"}
          variant="hint"
          className="size-6 p-0 disabled:opacity-40"
          onClick={(e) => {
            e.stopPropagation();
            onVisibilityChange();
          }}
        >
          {hidden ? <Icon.EyeHide /> : <Icon.Eye />}
        </Button>
      </MenuItemAction>
    </AutocompleteItem>
  );
}
