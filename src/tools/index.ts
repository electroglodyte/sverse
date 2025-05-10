import type { ToolRegistration } from "@/types";
import { someFunctionTool } from "./exampleTool";
import { supabaseDbTool } from "./supabaseDb";
import { webFetchTool } from "./webFetch";

// biome-ignore lint/suspicious/noExplicitAny: Any is fine here because all tools validate their input schemas.
export const createTools = (): ToolRegistration<any>[] => {
	return [
		{
			...someFunctionTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => someFunctionTool.handler(args),
		},
		{
			...webFetchTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => webFetchTool.handler(args),
		},
		{
			...supabaseDbTool,
			// biome-ignore lint/suspicious/noExplicitAny: All tools validate their input schemas, so any is fine.
			handler: (args: any) => supabaseDbTool.handler(args),
		},
	];
};