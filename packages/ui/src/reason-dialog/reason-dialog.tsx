import * as React from "react";

import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  FieldError,
  FieldLabel,
  Input,
  Spinner,
  Textarea,
} from "@/primitives";

export interface ReasonDialogProps {
  /** The dialog title. */
  title: string;
  /** Additional context shown below the title. */
  description?: React.ReactNode;
  /** Label for the confirming action. */
  confirmLabel: string;
  /** Label for the cancelling action. Defaults to `"Cancel"`. */
  cancelLabel?: string;
  /** Uses the destructive button style and copy when `true`. */
  destructive?: boolean;
  /**
   * When set, the confirm action stays disabled until the operator types this
   * phrase exactly into an additional confirmation field.
   */
  confirmationPhrase?: string;
  /** Label for the reason field. Defaults to `"Reason"`. */
  reasonLabel?: string;
  reasonPlaceholder?: string;
  /** Minimum trimmed reason length. Defaults to `1`. */
  minReasonLength?: number;
  /** Maximum trimmed reason length. Defaults to `1000`. */
  maxReasonLength?: number;
  /** Extra fields rendered above the reason field. */
  children?: React.ReactNode;
  /** Called with the trimmed reason once the operator confirms. */
  onConfirm: (reason: string) => void | Promise<void>;
  onCancel?: () => void;
}

/**
 * Renders inside a caller-controlled `Dialog` root, like `AlertModal`. Every
 * confirmation requires a written reason, and destructive actions additionally
 * require typing a confirmation phrase.
 */
function ReasonDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  confirmationPhrase,
  reasonLabel = "Reason",
  reasonPlaceholder,
  minReasonLength = 1,
  maxReasonLength = 1000,
  children,
  onConfirm,
  onCancel,
}: ReasonDialogProps) {
  const reasonId = React.useId();
  const phraseId = React.useId();
  const [reason, setReason] = React.useState("");
  const [phrase, setPhrase] = React.useState("");
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const trimmedReason = reason.trim();
  const reasonValid =
    trimmedReason.length >= minReasonLength &&
    trimmedReason.length <= maxReasonLength;
  const phraseValid = !confirmationPhrase || phrase === confirmationPhrase;
  const canSubmit = reasonValid && phraseValid;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isPending) return;
    startTransition(async () => {
      try {
        await onConfirm(trimmedReason);
        setSubmitError(null);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : String(error));
      }
    });
  };

  return (
    <DialogContent hideClose className="flex w-100 flex-col items-start gap-4">
      <DialogHeader>
        <DialogTitle className="text-base font-normal tracking-wide">
          {title}
        </DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        {children}
        <Field>
          <FieldLabel htmlFor={reasonId}>{reasonLabel}</FieldLabel>
          <Textarea
            id={reasonId}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={reasonPlaceholder}
            disabled={isPending}
            required
          />
        </Field>
        {confirmationPhrase && (
          <Field>
            <FieldLabel htmlFor={phraseId}>
              {`Type "${confirmationPhrase}" to confirm`}
            </FieldLabel>
            <Input
              id={phraseId}
              value={phrase}
              onChange={(event) => setPhrase(event.target.value)}
              disabled={isPending}
              autoComplete="off"
            />
          </Field>
        )}
        <FieldError>{submitError}</FieldError>
        <DialogFooter className="py-1.5">
          <Button
            type="submit"
            variant={destructive ? "red-fill" : "blue"}
            size="sm"
            className="w-full"
            disabled={!canSubmit || isPending}
          >
            {confirmLabel}
            {isPending && <Spinner />}
          </Button>
          <DialogClose
            render={
              <Button
                type="button"
                size="sm"
                className="w-full"
                disabled={isPending}
                onClick={onCancel}
              >
                {cancelLabel}
              </Button>
            }
          />
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export { ReasonDialog };
