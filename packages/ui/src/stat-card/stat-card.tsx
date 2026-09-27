import type * as React from "react";

import { cn, cva, type VariantProps } from "@notion-kit/cn";

const statValueVariants = cva("text-2xl font-semibold tabular-nums", {
  variants: {
    tone: {
      default: "text-primary",
      warning: "text-orange",
      danger: "text-red",
    },
  },
  defaultVariants: { tone: "default" },
});

export type StatCardTone = NonNullable<
  VariantProps<typeof statValueVariants>["tone"]
>;

export interface StatCardProps {
  /** Small muted label identifying the stat. Doubles as the accessible name when interactive. */
  label: string;
  value: React.ReactNode;
  caption?: React.ReactNode;
  icon?: React.ReactNode;
  /** Renders the card as a link. */
  href?: string;
  /** Renders the card as a button. */
  onClick?: () => void;
  tone?: StatCardTone;
  /**
   * `card` (default) draws a bordered tile. `inline` renders the value above
   * the label with no box, for a KPI row such as "Logs in the last 7 days".
   */
  variant?: "card" | "inline";
  className?: string;
}

const cardClassName =
  "flex flex-col gap-1.5 rounded-lg border border-border bg-transparent p-4 text-left text-primary shadow-xs";
const inlineClassName = "flex flex-col gap-0.5 text-left text-primary";
const inlineInteractiveClassName =
  "cursor-pointer rounded-sm transition-colors hover:text-blue focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring";
const interactiveClassName =
  "cursor-pointer transition-colors hover:bg-default/5 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring";

/**
 * A dense stat tile: a label row with an optional icon, a large tabular
 * value, and an optional caption. Renders as a link, a button, or a static
 * `div` depending on which of `href`/`onClick` is given.
 */
function StatCard({
  label,
  value,
  caption,
  icon,
  href,
  onClick,
  tone = "default",
  variant = "card",
  className,
}: StatCardProps) {
  const interactive = Boolean(href ?? onClick);
  const inline = variant === "inline";
  const rootClassName = cn(
    inline ? inlineClassName : cardClassName,
    interactive && (inline ? inlineInteractiveClassName : interactiveClassName),
    className,
  );

  const content = inline ? (
    <>
      <span className={cn(statValueVariants({ tone }), "text-[26px]/8")}>
        {value}
      </span>
      <span className="flex items-center gap-1 text-xs text-secondary">
        {icon && (
          <span
            aria-hidden="true"
            className="shrink-0 text-icon [&_svg]:size-3.5"
          >
            {icon}
          </span>
        )}
        {label}
      </span>
      {caption && <span className="text-xs text-muted">{caption}</span>}
    </>
  ) : (
    <>
      <span className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted">{label}</span>
        {icon && (
          <span aria-hidden="true" className="shrink-0 text-icon">
            {icon}
          </span>
        )}
      </span>
      <span className={statValueVariants({ tone })}>{value}</span>
      {caption && <span className="text-xs text-muted">{caption}</span>}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        aria-label={label}
        data-tone={tone}
        data-variant={variant}
        className={rootClassName}
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        data-tone={tone}
        data-variant={variant}
        className={rootClassName}
      >
        {content}
      </button>
    );
  }

  return (
    <div data-tone={tone} data-variant={variant} className={rootClassName}>
      {content}
    </div>
  );
}

export interface StatCardGridProps {
  children: React.ReactNode;
  className?: string;
}

/** Responsive grid for laying out a row of `StatCard`s. */
function StatCardGrid({ children, className }: StatCardGridProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {children}
    </div>
  );
}

export { StatCard, StatCardGrid };
