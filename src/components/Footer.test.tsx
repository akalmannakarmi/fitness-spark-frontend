import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders the brand name and copyright", () => {
    render(<Footer />);
    expect(
      screen.getByText(/Fitness Spark\. All rights reserved\./)
    ).toBeInTheDocument();
  });

  it("renders the current year", () => {
    render(<Footer />);
    expect(
      screen.getByText(new RegExp(String(new Date().getFullYear())))
    ).toBeInTheDocument();
  });
});
