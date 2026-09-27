import * as React from "react";

import { cn } from "@notion-kit/cn";

import { typography } from "@/primitives";

export interface DescriptionListItemData {
  key?: string;
  term: React.ReactNode;
  value: React.ReactNode;
}

export interface DescriptionListItemProps extends React.ComponentProps<"div"> {
  term: React.ReactNode;
  value: React.ReactNode;
}

/**
 * A single term/value row. Use directly when composing a description list by
 * hand instead of passing `items` to {@link DescriptionList}.
 */
function DescriptionListItem({
  className,
  term,
  value,
  ...props
}: DescriptionListItemProps) {
  return (
    <div
      data-slot="description-list-item"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      <dt className={cn(typography("label"), "text-muted")}>{term}</dt>
      <dd className="text-sm wrap-break-word text-primary">{value}</dd>
    </div>
  );
}

export interface DescriptionListProps
  extends Omit<React.ComponentProps<"dl">, "children"> {
  items: DescriptionListItemData[];
  /**
   * Number of columns the rows are laid out in.
   * @default 1
   */
  columns?: 1 | 2;
}

/**
 * Renders a list of term/value pairs as a semantic `<dl>`.
 */
function DescriptionList({
  className,
  items,
  columns = 1,
  ...props
}: DescriptionListProps) {
  return (
    <dl
      data-slot="description-list"
      className={cn(
        "grid grid-cols-1 gap-x-6 gap-y-4",
        columns === 2 && "sm:grid-cols-2",
        className,
      )}
      {...props}
    >
      {items.map((item, index) => (
        <DescriptionListItem
          key={item.key ?? index}
          term={item.term}
          value={item.value}
        />
      ))}
    </dl>
  );
}

export { DescriptionList, DescriptionListItem };
