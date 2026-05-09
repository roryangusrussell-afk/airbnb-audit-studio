import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UrlForm } from "./UrlForm";

function setup() {
  const onSubmit = vi.fn();
  render(<UrlForm onSubmit={onSubmit} />);
  const input = screen.getByPlaceholderText(/airbnb\.com\/rooms/i);
  const button = screen.getByRole("button", { name: /audit my listing free/i });
  return { onSubmit, input, button };
}

describe("UrlForm", () => {
  it("rejects an empty submission with a paste-prompt message", () => {
    const { onSubmit, button } = setup();
    fireEvent.click(button);
    expect(screen.getByRole("alert")).toHaveTextContent(/please paste/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects an unparseable URL", () => {
    const { onSubmit, input, button } = setup();
    fireEvent.change(input, { target: { value: "not a url" } });
    fireEvent.click(button);
    expect(screen.getByRole("alert")).toHaveTextContent(/doesn't look right/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects a non-Airbnb hostname", () => {
    const { onSubmit, input, button } = setup();
    fireEvent.change(input, { target: { value: "https://www.example.com/rooms/12345" } });
    fireEvent.click(button);
    expect(screen.getByRole("alert")).toHaveTextContent(/doesn't look like an Airbnb URL/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects an Airbnb URL without /rooms/<id>", () => {
    const { onSubmit, input, button } = setup();
    fireEvent.change(input, { target: { value: "https://www.airbnb.com/help" } });
    fireEvent.click(button);
    expect(screen.getByRole("alert")).toHaveTextContent(/\/rooms\//i);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("accepts a fully-qualified Airbnb listing URL", () => {
    const { onSubmit, input, button } = setup();
    fireEvent.change(input, { target: { value: "https://www.airbnb.com/rooms/12345" } });
    fireEvent.click(button);
    expect(onSubmit).toHaveBeenCalledWith("https://www.airbnb.com/rooms/12345");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("auto-prepends https:// when the user pastes a bare host", () => {
    const { onSubmit, input, button } = setup();
    fireEvent.change(input, { target: { value: "www.airbnb.com/rooms/777" } });
    fireEvent.click(button);
    expect(onSubmit).toHaveBeenCalledWith("https://www.airbnb.com/rooms/777");
  });

  it("clears the error message as soon as the user edits the input", () => {
    const { input, button } = setup();
    fireEvent.click(button);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "h" } });
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("disables the submit button while loading", () => {
    const onSubmit = vi.fn();
    render(<UrlForm onSubmit={onSubmit} loading />);
    const button = screen.getByRole("button", { name: /audit my listing free/i });
    expect(button).toBeDisabled();
  });
});
