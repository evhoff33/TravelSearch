import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";

beforeAll(() => {
  // Setup any global test requirements
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  // Cleanup after all tests
});
