import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(document.body).toBeDefined();
  });

  it("contains navigation elements", () => {
    render(<App />);
    expect(screen.getByRole("navigation")).toBeDefined();
  });
});
