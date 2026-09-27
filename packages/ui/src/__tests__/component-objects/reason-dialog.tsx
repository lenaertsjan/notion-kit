import { render, screen, within } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";

import { Dialog } from "@/primitives";
import { ReasonDialog, type ReasonDialogProps } from "@/reason-dialog";

export class ReasonDialogObject {
  private constructor(
    readonly user: UserEvent,
    private readonly reasonLabel: string,
    private readonly confirmLabel: string,
    private readonly cancelLabel: string,
  ) {}

  static render(
    props: Partial<Pick<ReasonDialogProps, "title" | "confirmLabel">> &
      Omit<ReasonDialogProps, "title" | "confirmLabel">,
  ) {
    const user = userEvent.setup();
    const title = props.title ?? "Suspend workspace";
    const confirmLabel = props.confirmLabel ?? "Suspend";

    render(
      <Dialog open>
        <ReasonDialog {...props} title={title} confirmLabel={confirmLabel} />
      </Dialog>,
    );

    return new ReasonDialogObject(
      user,
      props.reasonLabel ?? "Reason",
      confirmLabel,
      props.cancelLabel ?? "Cancel",
    );
  }

  dialog() {
    return screen.getByRole("dialog");
  }

  reasonField() {
    return within(this.dialog()).getByRole("textbox", {
      name: this.reasonLabel,
    });
  }

  confirmationField(phrase: string) {
    return within(this.dialog()).getByRole("textbox", {
      name: `Type "${phrase}" to confirm`,
    });
  }

  confirm() {
    return within(this.dialog()).getByRole("button", {
      name: this.confirmLabel,
    });
  }

  cancel() {
    return within(this.dialog()).getByRole("button", {
      name: this.cancelLabel,
    });
  }

  message() {
    return within(this.dialog()).getByRole("alert");
  }

  async typeReason(value: string) {
    await this.user.type(this.reasonField(), value);
  }

  async typeConfirmation(phrase: string, value: string) {
    const field = this.confirmationField(phrase);
    await this.user.clear(field);
    await this.user.type(field, value);
  }

  async submit() {
    await this.user.click(this.confirm());
  }
}
