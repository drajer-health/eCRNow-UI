import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormButtonGroup from "./FormButtonGroup";
import { describe, it, expect, vi } from "vitest";

describe("FormButtonGroup Component", () => {
  it("positive case - renders with all props and triggers onClick", () => {
    const handleClick = vi.fn();
    render(
      <FormButtonGroup
        label="Submit"
        onClick={handleClick}
        type="submit"
        className="custom-class"
      />
    );

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("custom-class");
    expect(button).toHaveAttribute("type", "submit");

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("negative case - renders without label and still clickable", () => {
    const handleClick = vi.fn();
    render(<FormButtonGroup label={""} onClick={handleClick} type="button" />);

    const button = screen.getByRole("button");
    expect(button.textContent).toBe(""); // No label text
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("neutral case - renders with default type when type is not provided", () => {
    const handleClick = vi.fn();
    render(<FormButtonGroup label="Default Button" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: "Default Button" });
    expect(button).toHaveAttribute("type", "button"); // default type
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
