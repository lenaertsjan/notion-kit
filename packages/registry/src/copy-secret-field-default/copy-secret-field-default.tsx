"use client";

import { CopySecretField } from "@notion-kit/ui/copy-secret-field";

export default function CopySecretFieldDefault() {
  return (
    <div className="w-100">
      <CopySecretField
        label="New API key"
        value="blv_agent_7Qm2pX9vLk4RtE1nWc8ZyB3sHd6JaF0g"
        description="Store this key somewhere safe."
        warning="This key is shown only once and cannot be retrieved again."
      />
    </div>
  );
}
