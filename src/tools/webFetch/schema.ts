import { z } from "zod";

export const webFetchSchema = z.object({
  url: z.string().url("Valid URL is required").describe("The URL to fetch data from"),
  method: z.enum(["GET", "POST"]).default("GET").describe("HTTP method to use for the request"),
  headers: z.record(z.string()).optional().describe("Optional HTTP headers to include"),
});

export type WebFetchSchema = z.infer<typeof webFetchSchema>;
