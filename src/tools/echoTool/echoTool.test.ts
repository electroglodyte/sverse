import { describe, expect, it } from "bun:test";
import { echo } from "./index";
import { echoSchema } from "./schema";

describe("echo Tool", () => {
  it("should parse valid input", () => {
    const result = echoSchema.safeParse({ message: "Hello World" });
    expect(result.success).toBe(true);
  });

  it("should echo the message back as-is", () => {
    const output = echo({ message: "Hello World", uppercase: false });
    expect(output).toBe("Hello World");
  });

  it("should echo the message back in uppercase", () => {
    const output = echo({ message: "Hello World", uppercase: true });
    expect(output).toBe("HELLO WORLD");
  });
});
