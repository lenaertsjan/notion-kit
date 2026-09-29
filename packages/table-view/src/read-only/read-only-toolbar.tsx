import { useId, useRef, useState } from "react";
import type React from "react";

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
export type ReadOnlyToolbarVariant = "icons" | "chips";

export interface ReadOnlyToolbarProps {
  className?: string;
  /**
   * `icons` (default) is the compact Notion toolbar. `chips` renders labelled
   * outlined buttons left-aligned with an always-visible search box, the
   * layout a data console expects above a table.
   */
  variant?: ReadOnlyToolbarVariant;
}

export function ReadOnlyToolbar({
  className,
  variant = "icons",
}: ReadOnlyToolbarProps) {
  const { table } = useTableViewCtx();

  // `state.menu` (the settings dropdown's open/page state) is read
  // synchronously below via `getTableMenuState()`. Without subscribing to
  // it, this component would never re-render when it changes, and the
  // `DropdownMenu`'s controlled `open` prop would stay stuck at whatever it
  // was on the first render — mirrors `@/tools/toolbar`'s `Toolbar`.
  return (
    <table.Subscribe selector={(state) => state.menu}>
      {() => <ReadOnlyToolbarContent className={className} variant={variant} />}
    </table.Subscribe>
  );
}

function ReadOnlyToolbarContent({
  className,
  variant = "icons",
}: ReadOnlyToolbarProps) {
  const settingsRef = useRef<HTMLButtonElement>(null);
  const { table } = useTableViewCtx();
  const { filterMenu, sortMenu } = useMenuCoordinator();
  const tableMenu = table.getTableMenuState();
  const chips = variant === "chips";
  const chipButton = (label: string, icon: React.ReactNode) =>
    chips ? (
      <Button variant="primary" size="xs" className="gap-1 px-2 text-xs">
        {icon}
        {label}
      </Button>
    ) : (
      <Button
        variant="nav-icon"
        aria-label={label}
        className="[&_svg]:fill-current"
      >
        {icon}
      </Button>
    );

  return (
    <div
      className={cn(
        "flex min-w-0 flex-wrap items-center",
        chips ? "justify-start gap-2" : "justify-end gap-0.5",
        className,
      )}
    >
      {chips ? <ReadOnlyToolbarSearch variant="chips" /> : null}
      <TooltipPreset description="Filter" side="top">
        <PopoverTrigger
          id={FILTER_MENU_TOOLBAR_TRIGGER_ID}
          handle={filterMenu.handle}
          render={chipButton("Filter", <Icon.FilterSmall />)}
        />
      </TooltipPreset>
      <DropdownMenuTrigger
        id={SORT_MENU_TOOLBAR_TRIGGER_ID}
        handle={sortMenu.handle}
        render={chipButton("Sort", <Icon.ArrowUpDownSmall />)}
      />
      {!chips && <ReadOnlyToolbarSearch />}
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
            chips ? (
              <Button
                variant="primary"
                size="xs"
                ref={settingsRef}
                className="gap-1 px-2 text-xs"
              >
                <Icon.SlidersSmall />
                Columns
              </Button>
            ) : (
              <Button
                variant="nav-icon"
                aria-label="Settings"
                ref={settingsRef}
                className="[&_svg]:fill-current"
              >
                <Icon.SlidersSmall />
              </Button>
            )
          }
        />
        <DropdownMenuContent collisionPadding={12} className="w-72">
          <ReadOnlyTableViewMenu />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ReadOnlyToolbarSearch({
  variant = "icons",
}: {
  variant?: ReadOnlyToolbarVariant;
}) {
  const { table } = useTableViewCtx();
  const searchInputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  if (variant === "chips") {
    return (
      <table.Subscribe selector={(state) => String(state.globalFilter ?? "")}>
        {(globalFilter) => (
          <Input
            ref={inputRef}
            id={searchInputId}
            search
            clear
            className="h-8 w-44 max-w-full text-sm"
            aria-label="Search table"
            placeholder="Search"
            value={globalFilter}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            onCancel={table.resetGlobalFilter}
          />
        )}
      </table.Subscribe>
    );
  }

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
