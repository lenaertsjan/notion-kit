import { waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ReasonDialogObject } from "@/__tests__/component-objects/reason-dialog";

describe("ReasonDialog", () => {
  it("ReasonDialog_ReasonEmpty_ConfirmDisabled", () => {
    const dialog = ReasonDialogObject.render({ onConfirm: vi.fn() });

    expect(dialog.confirm()).toBeDisabled();
  });

  it("ReasonDialog_ReasonEntered_ConfirmEnabled", async () => {
    const dialog = ReasonDialogObject.render({ onConfirm: vi.fn() });

    await dialog.typeReason("Closing a duplicate account");

    expect(dialog.confirm()).toBeEnabled();
  });

  it("ReasonDialog_ConfirmationPhraseSet_ConfirmDisabledUntilPhraseMatches", async () => {
    const dialog = ReasonDialogObject.render({
      onConfirm: vi.fn(),
      confirmationPhrase: "DELETE",
    });

    await dialog.typeReason("Removing the workspace permanently");
    expect(dialog.confirm()).toBeDisabled();

    await dialog.typeConfirmation("DELETE", "delete");
    expect(dialog.confirm()).toBeDisabled();

    await dialog.typeConfirmation("DELETE", "DELETE");
    expect(dialog.confirm()).toBeEnabled();
  });

  it("ReasonDialog_Confirmed_CallsOnConfirmWithTrimmedReason", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const dialog = ReasonDialogObject.render({ onConfirm });

    await dialog.typeReason("  Refunding the annual plan  ");
    await dialog.submit();

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith("Refunding the annual plan");
    });
  });

  it("ReasonDialog_OnConfirmRejects_ShowsMessageAndStaysOpen", async () => {
    const onConfirm = vi
      .fn()
      .mockRejectedValue(new Error("Server rejected the request"));
    const dialog = ReasonDialogObject.render({ onConfirm });

    await dialog.typeReason("Suspending for a billing dispute");
    await dialog.submit();

    await waitFor(() => {
      expect(dialog.message()).toHaveTextContent("Server rejected the request");
    });
    expect(dialog.dialog()).toBeInTheDocument();
    expect(dialog.reasonField()).toBeInTheDocument();
  });
});
