import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CopyButton } from "./CopyButton";

describe("CopyButton", () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("copies the value when clicked and shows the 'Copied!' state", async () => {
    render(<CopyButton value="payload" />);
    const button = screen.getByRole("button", { name: /copy/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(writeText).toHaveBeenCalledWith("payload");
    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  it("reverts to the default label after the timeout", async () => {
    render(<CopyButton value="payload" label="Copy code" resetMs={500} />);
    const button = screen.getByRole("button", { name: /copy code/i });

    await act(async () => {
      fireEvent.click(button);
    });
    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(screen.getByRole("button", { name: /copy code/i })).toBeInTheDocument();
  });
});
