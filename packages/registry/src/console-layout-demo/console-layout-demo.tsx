"use client";

import { useState } from "react";

import { ConsoleLayout } from "@notion-kit/ui/console-layout";
import { AppBar } from "@notion-kit/ui/navbar/presets";
import { PageHeader } from "@notion-kit/ui/page-header";
import { Button } from "@notion-kit/ui/primitives";
import { StatCard } from "@notion-kit/ui/stat-card";

export default function ConsoleLayoutDemo() {
  const [section, setSection] = useState("Overview");
  return (
    <ConsoleLayout
      brand={<strong>bliv</strong>}
      navigationLabel="Demo navigation"
      navigation={["Overview", "Machines", "Credits"].map((label) => (
        <Button
          key={label}
          variant="hint"
          render={<a href={`#${label.toLowerCase()}`} />}
          aria-current={section === label ? "page" : undefined}
          onClick={() => setSection(label)}
        >
          {label}
        </Button>
      ))}
      contextBar={
        <AppBar
          brand="Demo workspace"
          showIdentity
          user={{ name: "Ada Lovelace" }}
        />
      }
      footer={<span className="text-xs text-secondary">Workspace console</span>}
    >
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title={section}
          subtitle="A responsive console built from notion-kit primitives."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Machines" value={12} caption="8 running" />
          <StatCard label="Credits" value="2,400" />
        </div>
      </div>
    </ConsoleLayout>
  );
}
