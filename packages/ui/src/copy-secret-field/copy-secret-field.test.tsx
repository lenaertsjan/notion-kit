import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CopySecretField } from "./copy-secret-field";

const SECRET = "blv_agent_abc123";

function renderField(
  props: Partial<ComponentProps<typeof CopySecretField>> = {},
) {
  // `userEvent.setup()` attaches its own clipboard stub to `navigator.clipboard`,
  // replacing anything defined beforehand, so spy on it only after this call.
  const user = userEvent.setup();
  render(<CopySecretField label="API key" value={SECRET} {...props} />);
  return { user };
}

describe("CopySecretField", () => {
  it("CopySecretField_CopyClicked_WritesValueToClipboard", async () => {
    const onCopied = vi.fn();
    const { user } = renderField({ onCopied });
    const writeText = vi.spyOn(navigator.clipboard, "writeText");

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith(SECRET);
    expect(onCopied).toHaveBeenCalledOnce();
    expect(
      await screen.findByRole("button", { name: "Copied" }),
    ).toBeInTheDocument();
  });

  it("CopySecretField_ToggleClicked_HidesThenShowsValue", async () => {
    const { user } = renderField();

    const field = screen.getByLabelText<HTMLInputElement>("API key");
    expect(field).toHaveAttribute("type", "text");
    expect(field).toHaveValue(SECRET);

    await user.click(screen.getByRole("button", { name: "Hide" }));
    expect(field).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "Show" }));
    expect(field).toHaveAttribute("type", "text");
  });

  it("CopySecretField_WarningProvided_RendersCallout", () => {
    renderField({ warning: "This key will not be shown again." });

    expect(screen.getByRole("note")).toHaveTextContent(
      "This key will not be shown again.",
    );
  });
});
