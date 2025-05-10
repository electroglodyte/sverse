import { describe, expect, it, mock, spyOn } from "bun:test";
import { supabaseDb } from "./index";
import { supabaseDbSchema } from "./schema";
import * as supabaseClient from "@/utils/supabaseClient";

// Mock data
const mockData = [
  { id: 1, name: "Test Item 1" },
  { id: 2, name: "Test Item 2" }
];

// Mock Supabase client
const mockFrom = mock(() => ({
  select: mock(() => ({
    filter: mock(() => ({
      limit: mock(() => ({
        then: mock(() => Promise.resolve({ data: mockData, error: null }))
      })),
      then: mock(() => Promise.resolve({ data: mockData, error: null }))
    })),
    limit: mock(() => ({
      then: mock(() => Promise.resolve({ data: mockData, error: null }))
    })),
    then: mock(() => Promise.resolve({ data: mockData, error: null }))
  })),
  insert: mock(() => ({
    select: mock(() => ({
      then: mock(() => Promise.resolve({ data: [{ id: 3, name: "New Item" }], error: null }))
    }))
  }))
}));

// Mock getSupabaseClient
const mockSupabaseClient = {
  from: mockFrom
};

describe("supabaseDb Tool", () => {
  // Mock the getSupabaseClient function
  spyOn(supabaseClient, "getSupabaseClient").mockReturnValue(mockSupabaseClient as any);

  it("should parse valid query input", () => {
    const result = supabaseDbSchema.safeParse({
      operation: "query",
      params: { table: "items", select: "*" }
    });
    expect(result.success).toBe(true);
  });

  it("should parse valid insert input", () => {
    const result = supabaseDbSchema.safeParse({
      operation: "insert",
      params: { table: "items", data: { name: "Test Item" } }
    });
    expect(result.success).toBe(true);
  });

  it("should handle query operation", async () => {
    const output = await supabaseDb({
      operation: "query",
      params: { table: "items", select: "*" }
    });
    
    expect(output).toHaveProperty("rows");
    expect(mockFrom).toHaveBeenCalledWith("items");
  });

  it("should handle insert operation", async () => {
    const output = await supabaseDb({
      operation: "insert",
      params: { table: "items", data: { name: "New Item" } }
    });
    
    expect(output).toHaveProperty("result");
    expect(mockFrom).toHaveBeenCalledWith("items");
  });
});
