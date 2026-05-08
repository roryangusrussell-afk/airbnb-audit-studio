import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmailGateModal } from "./EmailGateModal";

function setup({ open = true } = {}) {
  const onSubmit = vi.fn();
  const onOpenChange = vi.fn();
  render(<EmailGateModal open={open} onOpenChange={onOpenChange} onSubmit={onSubmit} />);
  // Find the form by walking up from the submit button. Submitting via
  // fireEvent.submit avoids jsdom's HTML5 type="email" validation and
  // exercises the component's own validation regex.
  const button = open ? screen.getByRole("button", { name: /email me my report/i }) : null;
  const form = button?.closest("form") ?? null;
  const submit = () => form && fireEvent.submit(form);
  return { onSubmit, onOpenChange, submit };
}

describe("EmailGateModal", () => {
  it("rejects an empty email", () => {
    const { onSubmit, submit } = setup();
    submit();
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects an obviously malformed email", () => {
    const { onSubmit, submit } = setup();
    const input = screen.getByPlaceholderText(/you@host\.com/i);
    fireEvent.change(input, { target: { value: "not-an-email" } });
    submit();
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects an email missing a TLD", () => {
    const { onSubmit, submit } = setup();
    const input = screen.getByPlaceholderText(/you@host\.com/i);
    fireEvent.change(input, { target: { value: "host@example" } });
    submit();
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("trims surrounding whitespace and submits a valid address", () => {
    const { onSubmit, submit } = setup();
    const input = screen.getByPlaceholderText(/you@host\.com/i);
    fireEvent.change(input, { target: { value: "  host@example.com  " } });
    submit();
    expect(onSubmit).toHaveBeenCalledWith("host@example.com");
  });

  it("clears the validation error as soon as the user edits the field", () => {
    const { submit } = setup();
    const input = screen.getByPlaceholderText(/you@host\.com/i);
    submit();
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "h" } });
    expect(screen.queryByText(/valid email/i)).toBeNull();
  });

  it("invokes onOpenChange(false) when the user clicks the skip link", () => {
    const { onOpenChange, onSubmit } = setup();
    fireEvent.click(screen.getByRole("button", { name: /skip/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not render the dialog when closed", () => {
    setup({ open: false });
    expect(screen.queryByPlaceholderText(/you@host\.com/i)).toBeNull();
  });
});
