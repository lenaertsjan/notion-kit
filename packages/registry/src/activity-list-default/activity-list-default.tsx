"use client";

import { ActivityList, type ActivityEvent } from "@notion-kit/ui/activity-list";

const events: ActivityEvent[] = [
  {
    id: "1",
    occurredAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    category: "Billing",
    action: "Suspended workspace",
    actor: "jan@example.com",
    resourceType: "workspace",
    resourceId: "ws_9f21",
    metadata: {
      reason: "Payment failed twice",
      previousStatus: "active",
    },
  },
  {
    id: "2",
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    category: "Access",
    action: "Rotated API key",
    actor: "jan@example.com",
    resourceType: "api key",
    resourceId: "key_c83a",
  },
  {
    id: "3",
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    category: "Billing",
    action: "Refunded invoice",
    actor: "support@example.com",
    resourceType: "invoice",
    resourceId: "inv_0132",
    summary: "Refunded the annual plan after a billing dispute.",
  },
];

export default function ActivityListDefault() {
  return (
    <div className="w-120">
      <ActivityList events={events} />
    </div>
  );
}
