import { z } from "zod";

// Query schema for querying data from a Supabase table
export const supabaseQuerySchema = z.object({
  table: z.string().min(1).describe("The name of the table to query"),
  select: z.string().default("*").describe("Columns to select (default: all columns)"),
  filter: z.object({
    column: z.string().describe("Column name to filter on"),
    operator: z.enum([
      "eq", "neq", "gt", "gte", "lt", "lte", "like", "ilike", "is", "in", "contains"
    ]).describe("Filter operator (eq, neq, gt, gte, lt, lte, like, ilike, is, in, contains)"),
    value: z.any().describe("Value to compare against")
  }).optional().describe("Optional filter criteria"),
  limit: z.number().int().positive().max(1000).optional().describe("Maximum number of rows to return")
});

// Insert schema for adding data to a Supabase table
export const supabaseInsertSchema = z.object({
  table: z.string().min(1).describe("The name of the table to insert into"),
  data: z.record(z.any()).describe("The data to insert as a key-value object")
});

// Combined schema that accepts either a query or insert operation
export const supabaseDbSchema = z.discriminatedUnion("operation", [
  z.object({
    operation: z.literal("query").describe("Perform a database query operation"),
    params: supabaseQuerySchema.describe("Query parameters")
  }).describe("Query operation for retrieving data from the database"),  // Added description here
  z.object({
    operation: z.literal("insert").describe("Perform a database insert operation"),
    params: supabaseInsertSchema.describe("Insert parameters")
  }).describe("Insert operation for adding data to the database")  // Added description here
]);

// Also add a description to the value field itself
z.any().describe("Any valid JSON value");

export type SupabaseDbSchema = z.infer<typeof supabaseDbSchema>;
export type SupabaseQuerySchema = z.infer<typeof supabaseQuerySchema>;
export type SupabaseInsertSchema = z.infer<typeof supabaseInsertSchema>;
