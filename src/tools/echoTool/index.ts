import type { ToolRegistration } from "@/types";
import { makeJsonSchema } from "@/utils/makeJsonSchema";
import { type EchoSchema, echoSchema } from "./schema";

export const echo = (args: EchoSchema): string => {
  try {
    const { message, uppercase } = args;
    return uppercase ? message.toUpperCase() : message;
  } catch (error) {
    console.error("Error in echo:", error);
    throw new Error(`Failed to process message: ${(error as Error).message}`);
  }
};

export const echoTool: ToolRegistration<EchoSchema> = {
  name: "echo",
  description: "Simply echoes back the message you send",
  inputSchema: makeJsonSchema(echoSchema),
  handler: (args: EchoSchema) => {
    try {
      const parsedArgs = echoSchema.parse(args);
      const result = echo(parsedArgs);
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      console.error("Error in echoTool handler:", error);
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
