import type * as React from "react";

import { cn } from "@notion-kit/cn";

import { typography } from "@/primitives";

export interface PageHeaderProps {
  /** Small uppercase label rendered above the title. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-aligned actions, such as buttons or a menu trigger. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Console page header: an optional eyebrow, an `h1` title, an optional
 * subtitle, and a right-aligned actions slot.
 */
function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow && (
          <span className="text-xs tracking-wide text-muted uppercase">
            {eyebrow}
          </span>
        )}
        <h1 className={cn(typography("h2"), "text-primary")}>{title}</h1>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </header>
  );
}

export { PageHeader };
