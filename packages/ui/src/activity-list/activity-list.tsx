import * as React from "react";
import { format, formatDistanceToNow } from "date-fns";

import { cn } from "@notion-kit/cn";

import { Badge } from "@/primitives";

export interface ActivityEvent {
  id: string;
  occurredAt: string | Date;
  category?: string;
  action: string;
  actor?: string;
  resourceType?: string;
  resourceId?: string;
  summary?: React.ReactNode;
  metadata?: Record<string, string>;
}

export interface ActivityListProps {
  events: ActivityEvent[];
  emptyMessage?: string;
  onSelect?: (event: ActivityEvent) => void;
  className?: string;
}

/**
 * Reads an operator's activity/audit trail. Each row shows when the event
 * happened, who did what to which resource, and an optional metadata
 * disclosure for anything not worth surfacing by default.
 */
function ActivityList({
  events,
  emptyMessage = "No activity yet",
  onSelect,
  className,
}: ActivityListProps) {
  if (events.length === 0) {
    return (
      <p className={cn("text-sm text-muted", className)}>{emptyMessage}</p>
    );
  }

  return (
    <ol className={cn("flex flex-col gap-3", className)}>
      {events.map((event) => (
        <ActivityRow key={event.id} event={event} onSelect={onSelect} />
      ))}
    </ol>
  );
}

function ActivityRow({
  event,
  onSelect,
}: {
  event: ActivityEvent;
  onSelect?: (event: ActivityEvent) => void;
}) {
  const occurredAt = new Date(event.occurredAt);
  const metadataEntries = event.metadata ? Object.entries(event.metadata) : [];
  const context = [
    event.actor,
    [event.resourceType, event.resourceId].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="flex flex-col gap-1 border-b border-border pb-3 last:border-none last:pb-0">
      {onSelect ? (
        <button
          type="button"
          aria-label={event.action}
          onClick={() => onSelect(event)}
          className="flex flex-col items-start gap-0.5 text-left"
        >
          <ActivityRowContent
            event={event}
            occurredAt={occurredAt}
            context={context}
          />
        </button>
      ) : (
        <div className="flex flex-col gap-0.5">
          <ActivityRowContent
            event={event}
            occurredAt={occurredAt}
            context={context}
          />
        </div>
      )}
      {metadataEntries.length > 0 && (
        <details className="text-xs text-muted">
          <summary className="cursor-pointer select-none">Details</summary>
          <dl className="mt-1 grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1">
            {metadataEntries.map(([key, value]) => (
              <React.Fragment key={key}>
                <dt className="font-medium text-secondary">{key}</dt>
                <dd>{value}</dd>
              </React.Fragment>
            ))}
          </dl>
        </details>
      )}
    </li>
  );
}

function ActivityRowContent({
  event,
  occurredAt,
  context,
}: {
  event: ActivityEvent;
  occurredAt: Date;
  context: string;
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <time
          dateTime={occurredAt.toISOString()}
          title={format(occurredAt, "PPpp")}
          className="text-xs text-muted"
        >
          {formatDistanceToNow(occurredAt, { addSuffix: true })}
        </time>
        {event.category && <Badge variant="gray">{event.category}</Badge>}
      </div>
      <p className="text-sm font-medium text-primary">{event.action}</p>
      {context && <p className="text-xs text-muted">{context}</p>}
      {event.summary && (
        <div className="text-sm text-secondary">{event.summary}</div>
      )}
    </>
  );
}

export { ActivityList };
