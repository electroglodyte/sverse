import { describe, expect, it, mock } from "bun:test";
import { webFetch } from "./index";
import { webFetchSchema } from "./schema";

// Mock the global fetch function
global.fetch = mock(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve("Success response"),
  } as Response)
);

describe("webFetch Tool", () => {
  it("should parse valid input", () => {
    const result = webFetchSchema.safeParse({ url: "https://example.com" });
    expect(result.success).toBe(true);
  });

  it("should reject invalid URLs", () => {
    const result = webFetchSchema.safeParse({ url: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("should handle the main function", async () => {
    const output = await webFetch({ url: "https://example.com", method: "GET" });
    expect(output).toBe("Success response");
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
