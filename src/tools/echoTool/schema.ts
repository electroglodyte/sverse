import { z } from "zod";

export const echoSchema = z.object({
  message: z.string().describe("The message to echo back"),
  uppercase: z.boolean().default(false).describe("Whether to convert the message to uppercase")
});

export type EchoSchema = z.infer<typeof echoSchema>;
