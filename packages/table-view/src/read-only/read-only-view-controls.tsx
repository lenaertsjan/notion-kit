import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  Popover,
  PopoverContent,
} from "@notion-kit/ui/primitives";

import { FilterMenu } from "@/menus/filter-menu";
import { SortMenu } from "@/menus/sort-menu";
import { useMenuCoordinator } from "@/table-contexts";
import { ActiveBar } from "@/tools/active-bar";

import {
  ReadOnlyToolbar,
  type ReadOnlyToolbarVariant,
} from "./read-only-toolbar";

/**
 * Read-only counterpart of `@/tools/view-controls`'s `ViewControls`.
 *
 * `ActiveBar` (the active filter/sort chip row) is reused unchanged, it has
 * no data-mutating affordances. `BulkEditBar` is dropped entirely: with no
 * row-selection checkboxes rendered anywhere in the read-only body, its
 * selection count is always zero and it already renders nothing, but leaving
 * it out makes that guarantee explicit rather than incidental.
 */
export function ReadOnlyViewControls({
  toolbar = "icons",
  actions,
  meta,
}: {
  toolbar?: ReadOnlyToolbarVariant;
  actions?: ReactNode;
  meta?: ReactNode;
}) {
  const { filterMenu, sortMenu } = useMenuCoordinator();

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <ReadOnlyToolbar variant={toolbar} />
        <div className="ml-auto flex flex-wrap items-center gap-3 text-xs text-secondary">
          {meta}
          {actions}
        </div>
      </div>
      <ActiveBar />
      <Popover handle={filterMenu.handle}>
        <PopoverContent
          aria-label="Filters"
          align="start"
          side="bottom"
          collisionPadding={12}
          className="max-h-[min(70vh,720px)] w-[min(750px,calc(100vw-24px))] overflow-auto"
        >
          <FilterMenu />
        </PopoverContent>
      </Popover>
      <DropdownMenu handle={sortMenu.handle}>
        <DropdownMenuContent
          align="start"
          side="bottom"
          collisionPadding={12}
          className="w-80"
        >
          <SortMenu />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
