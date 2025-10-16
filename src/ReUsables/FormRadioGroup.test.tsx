import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FormRadioGroup from "./FormRadioGroup";
import { describe, it, expect, vi } from "vitest";

const options = [
  { id: "opt1", value: "one", label: "Option One" },
  { id: "opt2", value: "two", label: "Option Two" },
  { id: "opt3", value: "three", label: "Option Three" },
];

describe("FormRadioGroup Component", () => {
  describe("Rendering & selection", () => {
    it("positive case - renders and selects correct radio based on value", () => {
      render(
        <FormRadioGroup
          label="Test Label"
          name="testGroup"
          value="two"
          options={options}
          onChange={() => {}}
        />
      );

      expect(screen.getByLabelText("Option Two")).toBeChecked();
      expect(screen.getByLabelText("Option One")).not.toBeChecked();
    });

    it("negative case - no option selected when value does not match", () => {
      render(
        <FormRadioGroup
          label="Test Label"
          name="testGroup"
          value="nonexistent"
          options={options}
          onChange={() => {}}
        />
      );

      options.forEach((opt) => {
        expect(screen.getByLabelText(opt.label)).not.toBeChecked();
      });
    });

    it("neutral case - user changes selection triggers onChange", () => {
      const handleChange = vi.fn();
      render(
        <FormRadioGroup
          label="Test Label"
          name="testGroup"
          value="one"
          options={options}
          onChange={handleChange}
        />
      );

      const optionTwo = screen.getByLabelText("Option Two");
      fireEvent.click(optionTwo);
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Validation feedback", () => {
    it("positive case - shows invalid feedback when isInvalid and feedback provided", () => {
      render(
        <FormRadioGroup
          label="Test Label"
          name="testGroup"
          value="one"
          options={options}
          onChange={() => {}}
          isInvalid={true}
          feedback="This field is required"
        />
      );

      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("negative case - does not show feedback when feedback missing", () => {
      render(
        <FormRadioGroup
          label="Test Label"
          name="testGroup"
          value="one"
          options={options}
          onChange={() => {}}
          isInvalid={true}
        />
      );

      expect(
        screen.queryByText("This field is required")
      ).not.toBeInTheDocument();
    });

    it("neutral case - does not show feedback when isInvalid is false", () => {
      render(
        <FormRadioGroup
          label="Test Label"
          name="testGroup"
          value="one"
          options={options}
          onChange={() => {}}
          feedback="This field is required"
        />
      );

      expect(
        screen.queryByText("This field is required")
      ).not.toBeInTheDocument();
    });
  });

  describe("Required attribute", () => {
    it("positive case - radios are required when required=true", () => {
      render(
        <FormRadioGroup
          label="Test Label"
          name="testGroup"
          value=""
          options={options}
          onChange={() => {}}
          required={true}
        />
      );

      expect(screen.getByLabelText("Option One")).toBeRequired();
    });

    it("negative case - radios are not required when required=false", () => {
      render(
        <FormRadioGroup
          label="Test Label"
          name="testGroup"
          value=""
          options={options}
          onChange={() => {}}
          required={false}
        />
      );

      expect(screen.getByLabelText("Option One")).not.toBeRequired();
    });

    it("neutral case - radios are required by default (required not passed)", () => {
      render(
        <FormRadioGroup
          label="Test Label"
          name="testGroup"
          value=""
          options={options}
          onChange={() => {}}
        />
      );

      expect(screen.getByLabelText("Option One")).toBeRequired();
    });
  });
});
