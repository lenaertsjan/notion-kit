import { useId, useRef, useState } from "react";

import { cn } from "@notion-kit/cn";
import { Icon } from "@notion-kit/icons";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
  PopoverTrigger,
  TooltipPreset,
} from "@notion-kit/ui/primitives";

import {
  FILTER_MENU_TOOLBAR_TRIGGER_ID,
  SORT_MENU_TOOLBAR_TRIGGER_ID,
  useMenuCoordinator,
  useTableViewCtx,
} from "@/table-contexts";

import { ReadOnlyTableViewMenu } from "./read-only-view-menu";

/**
 * Read-only counterpart of `@/tools/toolbar`'s `Toolbar`.
 *
 * Keeps search, filter, and sort (independent of the settings menu already),
 * and routes "..." to `ReadOnlyTableViewMenu` for grouping/columns. Drops the
 * "New" row-creation button, and the still-unwired "automations"/"open as
 * full page" placeholders the editor's toolbar renders, since they don't fit
 * a data-you-can-never-edit console.
 */
export function ReadOnlyToolbar({ className }: { className?: string }) {
  const { table } = useTableViewCtx();

  // `state.menu` (the settings dropdown's open/page state) is read
  // synchronously below via `getTableMenuState()`. Without subscribing to
  // it, this component would never re-render when it changes, and the
  // `DropdownMenu`'s controlled `open` prop would stay stuck at whatever it
  // was on the first render — mirrors `@/tools/toolbar`'s `Toolbar`.
  return (
    <table.Subscribe selector={(state) => state.menu}>
      {() => <ReadOnlyToolbarContent className={className} />}
    </table.Subscribe>
  );
}

function ReadOnlyToolbarContent({ className }: { className?: string }) {
  const settingsRef = useRef<HTMLButtonElement>(null);
  const { table } = useTableViewCtx();
  const { filterMenu, sortMenu } = useMenuCoordinator();
  const tableMenu = table.getTableMenuState();

  return (
    <div className={cn("flex items-center justify-end gap-0.5", className)}>
      <TooltipPreset description="Filter" side="top">
        <PopoverTrigger
          id={FILTER_MENU_TOOLBAR_TRIGGER_ID}
          handle={filterMenu.handle}
          render={
            <Button
              variant="nav-icon"
              aria-label="Filter"
              className="[&_svg]:fill-current"
            >
              <Icon.FilterSmall />
            </Button>
          }
        />
      </TooltipPreset>
      <DropdownMenuTrigger
        id={SORT_MENU_TOOLBAR_TRIGGER_ID}
        handle={sortMenu.handle}
        render={
          <Button
            variant="nav-icon"
            aria-label="Sort"
            className="[&_svg]:fill-current"
          >
            <Icon.ArrowUpDownSmall />
          </Button>
        }
      />
      <ReadOnlyToolbarSearch />
      <DropdownMenu
        open={tableMenu.open}
        onOpenChange={(open) =>
          table.setTableMenuState({
            open,
            page: open ? tableMenu.page : null,
          })
        }
      >
        <DropdownMenuTrigger
          render={
            <Button
              variant="nav-icon"
              aria-label="Settings"
              ref={settingsRef}
              className="[&_svg]:fill-current"
            >
              <Icon.SlidersSmall />
            </Button>
          }
        />
        <DropdownMenuContent collisionPadding={12} className="w-72">
          <ReadOnlyTableViewMenu />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ReadOnlyToolbarSearch() {
  const { table } = useTableViewCtx();
  const searchInputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex items-center">
      <TooltipPreset description="Search" side="top">
        <Button
          variant="nav-icon"
          aria-label="Search"
          aria-controls={searchInputId}
          aria-expanded={searchOpen}
          className="[&_svg]:fill-current"
          onClick={() => {
            setSearchOpen(!searchOpen);
            if (!searchOpen) inputRef.current?.focus();
          }}
        >
          <Icon.MagnifyingGlassSmall />
        </Button>
      </TooltipPreset>
      <table.Subscribe selector={(state) => String(state.globalFilter ?? "")}>
        {(globalFilter) => (
          <Input
            ref={inputRef}
            id={searchInputId}
            clear={searchOpen}
            variant="flat"
            className={cn(
              "transition-[width,opacity] duration-200 ease-in-out",
              searchOpen ? "w-[150px] opacity-100" : "w-0 p-0 opacity-0",
            )}
            aria-label="Search table"
            aria-hidden={!searchOpen}
            tabIndex={searchOpen ? undefined : -1}
            placeholder="Search"
            value={globalFilter}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            onCancel={table.resetGlobalFilter}
          />
        )}
      </table.Subscribe>
    </div>
  );
}
