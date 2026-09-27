import * as React from "react";

import { cn } from "@notion-kit/cn";
import { useCopyToClipboard } from "@notion-kit/hooks";
import { Icon } from "@notion-kit/icons";

import {
  Button,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  TooltipPreset,
} from "@/primitives";

const COPIED_TIMEOUT_MS = 2000;

export interface CopySecretFieldProps {
  /** Label describing the secret, e.g. "API key". */
  label: string;
  /** The secret value. Shown once; never persisted by this component. */
  value: string;
  description?: React.ReactNode;
  /** Rendered as a soft callout, e.g. "This key will not be shown again." */
  warning?: React.ReactNode;
  /** Called after the value is written to the clipboard. */
  onCopied?: () => void;
  className?: string;
}

/**
 * Displays a one-time secret with a reveal toggle and a copy-to-clipboard
 * button. The value is only ever held in the props the caller passes in; this
 * component does not persist it anywhere.
 */
function CopySecretField({
  label,
  value,
  description,
  warning,
  onCopied,
  className,
}: CopySecretFieldProps) {
  const inputId = React.useId();
  const [visible, setVisible] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const { copy } = useCopyToClipboard({
    onSuccess: () => {
      setCopied(true);
      onCopied?.();
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => setCopied(false),
        COPIED_TIMEOUT_MS,
      );
    },
  });

  return (
    <Field className={className}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      <div className="flex items-center gap-1.5">
        <Input
          id={inputId}
          type={visible ? "text" : "password"}
          value={value}
          readOnly
          className="font-mono"
        />
        <TooltipPreset description={visible ? "Hide" : "Show"}>
          <Button
            type="button"
            variant="icon"
            aria-label={visible ? "Hide" : "Show"}
            onClick={() => setVisible((prev) => !prev)}
          >
            {visible ? <Icon.EyeHide /> : <Icon.Eye />}
          </Button>
        </TooltipPreset>
        <TooltipPreset description={copied ? "Copied" : "Copy"}>
          <Button
            type="button"
            variant="icon"
            aria-label={copied ? "Copied" : "Copy"}
            onClick={() => void copy(value)}
          >
            {copied ? <Icon.Check /> : <Icon.Copy />}
          </Button>
        </TooltipPreset>
      </div>
      {warning && (
        <div
          role="note"
          className={cn(
            "rounded-md border border-orange/30 bg-orange/10 px-3 py-2",
            "text-xs text-orange",
          )}
        >
          {warning}
        </div>
      )}
    </Field>
  );
}

export { CopySecretField };
