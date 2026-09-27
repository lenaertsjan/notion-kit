import { useState } from "react";

import { cn } from "@notion-kit/cn";
import { Icon } from "@notion-kit/icons";
import type { HeaderInstance } from "@notion-kit/table-hook";
import { IconBlock } from "@notion-kit/ui/icon-block";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  TooltipDescription,
  TooltipPreset,
} from "@notion-kit/ui/primitives";

import { DefaultIcon } from "@/common";
import { useTableViewCtx } from "@/table-contexts";
import { TableHeaderCellResizer } from "@/table-header/table-header-cell";

import { ReadOnlyPropMenu } from "./read-only-prop-menu";

interface ReadOnlyTableHeaderCellProps {
  header: HeaderInstance;
}

/**
 * Read-only counterpart of `TableHeaderCell`.
 *
 * The full editor disables the header cell's menu trigger entirely while the
 * table is `locked` (see `TableHeaderCellTrigger`), which would also block
 * filter/sort/group/freeze/hide. A read-only table wants those to stay
 * available, so this variant never disables the trigger and always opens
 * `ReadOnlyPropMenu` instead of the full `PropMenu`.
 *
 * Column drag-reordering is intentionally dropped (no `Sortable.Item`
 * wrapper): it isn't part of the requested feature set and dropping it keeps
 * the read-only bundle free of any `@dnd-kit` dependency.
 */
export function ReadOnlyTableHeaderCell({
  header,
}: ReadOnlyTableHeaderCellProps) {
  const { table } = useTableViewCtx();
  const info = header.column.getInfo();
  const isResizing = header.column.getIsResizing();
  const [menuOpen, setMenuOpen] = useState(false);
  const style: React.CSSProperties = { width: header.column.getWidth() };

  return (
    <div
      className="relative flex h-full flex-row whitespace-nowrap"
      style={style}
    >
      <DropdownMenu modal={false} open={menuOpen} onOpenChange={setMenuOpen}>
        <TooltipPreset
          description={
            info.description ? (
              <>
                <TooltipDescription text={info.name} />
                <TooltipDescription type="secondary" text={info.description} />
              </>
            ) : (
              info.name
            )
          }
          side="top"
        >
          <DropdownMenuTrigger
            aria-label={info.name}
            data-table-header-slot="table-header-cell-trigger"
            className={cn(isResizing && "bg-transparent")}
            render={
              <Button
                variant="cell"
                className="flex h-full min-w-0 flex-1 items-center gap-1 overflow-hidden px-2 text-sm"
              />
            }
          >
            {info.icon ? (
              <IconBlock
                icon={info.icon}
                className="size-4 p-0 opacity-60 dark:opacity-45"
              />
            ) : (
              <DefaultIcon type={info.type} className="fill-default/45" />
            )}
            <div className="truncate">{info.name}</div>
            {info.description ? (
              <Icon.Info className="size-3 fill-icon" />
            ) : null}
          </DropdownMenuTrigger>
        </TooltipPreset>
        <DropdownMenuContent align="start" sideOffset={0} className="w-55">
          <ReadOnlyPropMenu propId={header.column.id} />
        </DropdownMenuContent>
      </DropdownMenu>
      <TableHeaderCellResizer header={header} table={table} />
    </div>
  );
}
