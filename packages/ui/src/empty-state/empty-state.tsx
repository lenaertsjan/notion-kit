import * as React from "react";

import { cn } from "@notion-kit/cn";

import { Button, typography } from "@/primitives";

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps {
  /** Icon rendered inside a soft circle above the title. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** A `{ label, onClick }` pair rendered as a `Button`, or a custom node. */
  action?: EmptyStateAction | React.ReactNode;
  className?: string;
}

function isEmptyStateAction(
  action: EmptyStateAction | React.ReactNode,
): action is EmptyStateAction {
  return (
    typeof action === "object" &&
    action !== null &&
    "label" in action &&
    "onClick" in action
  );
}

/**
 * Centered placeholder for an empty list or view: an icon in a soft circle,
 * a title, an optional description, and an optional action.
 */
function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const titleId = React.useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "flex flex-col items-center gap-3 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="flex size-12 items-center justify-center rounded-full bg-default/5 text-icon"
        >
          {icon}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <h3 id={titleId} className={cn(typography("h3"), "text-primary")}>
          {title}
        </h3>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      {action &&
        (isEmptyStateAction(action) ? (
          <Button size="sm" onClick={action.onClick} className="mt-1">
            {action.label}
          </Button>
        ) : (
          action
        ))}
    </section>
  );
}

export { EmptyState };
