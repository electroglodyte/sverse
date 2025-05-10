import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { type WebFetchSchema, webFetchSchema } from "./schema";

export const webFetch = async (args: WebFetchSchema): Promise<string> => {
  try {
    const { url, method, headers } = args;
    
    // Using native fetch API
    const response = await fetch(url, {
      method,
      headers: headers || {},
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.text();
    return data.substring(0, 1000); // Limit response size
  } catch (error) {
    console.error("Error in webFetch:", error);
    throw new Error(`Failed to fetch data: ${(error as Error).message}`);
  }
};

export const webFetchTool: ToolRegistration<WebFetchSchema> = {
  name: "web_fetch",
  description: "Fetches data from a specified URL and returns the content",
  inputSchema: makeJsonSchema(webFetchSchema),
  handler: async (args: WebFetchSchema) => {
    try {
      const parsedArgs = webFetchSchema.parse(args);
      const result = await webFetch(parsedArgs);
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error("Error in webFetchTool handler:", error);
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
