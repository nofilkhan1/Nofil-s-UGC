import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";
import { FormField, TextAreaField } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/status-badge";

describe("shared UI accessibility", () => {
  it("associates labels, hints, and errors with fields", () => {
    render(<><FormField label="Campaign title" name="title" hint="Use a clear title." /><TextAreaField label="Brief" name="brief" error="Add more detail." /></>);
    expect(screen.getByLabelText("Campaign title")).toHaveAttribute("aria-describedby", "title-hint");
    expect(screen.getByLabelText("Brief")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Add more detail.");
  });

  it("prevents a disabled button from firing", () => {
    let count = 0;
    render(<Button disabled onClick={() => { count += 1; }}>Publish campaign</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Publish campaign" }));
    expect(count).toBe(0);
  });

  it("exposes application status as text", () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText("approved")).toBeVisible();
  });
});
