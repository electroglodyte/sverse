import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { getSupabaseClient } from "@/utils/supabaseClient";
import { 
  type SupabaseDbSchema, 
  type SupabaseQuerySchema, 
  type SupabaseInsertSchema,
  supabaseDbSchema 
} from "./schema";

// Handle a database query operation
export const querySupabase = async (params: SupabaseQuerySchema): Promise<Record<string, any>[]> => {
  try {
    const supabase = getSupabaseClient();
    const { table, select, filter, limit } = params;

    // Start building the query
    let query = supabase.from(table).select(select);

    // Apply filter if provided
    if (filter) {
      const { column, operator, value } = filter;
      query = query.filter(column, operator, value);
    }

    // Apply limit if provided
    if (limit) {
      query = query.limit(limit);
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      throw new Error(`Database query error: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error in querySupabase:", error);
    throw new Error(`Failed to query database: ${(error as Error).message}`);
  }
};

// Handle a database insert operation
export const insertSupabase = async (params: SupabaseInsertSchema): Promise<Record<string, any>> => {
  try {
    const supabase = getSupabaseClient();
    const { table, data } = params;

    // Perform the insert
    const { data: result, error } = await supabase.from(table).insert(data).select();

    if (error) {
      throw new Error(`Database insert error: ${error.message}`);
    }

    return result?.[0] || { success: true };
  } catch (error) {
    console.error("Error in insertSupabase:", error);
    throw new Error(`Failed to insert data: ${(error as Error).message}`);
  }
};

// Handle both operations
export const supabaseDb = async (args: SupabaseDbSchema): Promise<Record<string, any>> => {
  try {
    const { operation, params } = args;

    if (operation === "query") {
      return { rows: await querySupabase(params) };
    } else if (operation === "insert") {
      return { result: await insertSupabase(params) };
    }

    throw new Error(`Unknown operation: ${operation}`);
  } catch (error) {
    console.error("Error in supabaseDb:", error);
    throw new Error(`Database operation failed: ${(error as Error).message}`);
  }
};

export const supabaseDbTool: ToolRegistration<SupabaseDbSchema> = {
  name: "supabase_db",
  description: "Perform operations on the Supabase database",
  inputSchema: makeJsonSchema(supabaseDbSchema),
  handler: async (args: SupabaseDbSchema) => {
    try {
      const parsedArgs = supabaseDbSchema.parse(args);
      const result = await supabaseDb(parsedArgs);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error in supabaseDbTool handler:", error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  },
};
