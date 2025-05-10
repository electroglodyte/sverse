#!/usr/bin/env node

// Version is automatically updated during release process
export const VERSION = "0.1.0";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createTools } from "./tools";


/* You can remove this section if you don't need to validate command line arguments */
/* You'll have to handle the error yourself */
/*
const expectedArgs = [
	"expected-arg-1",
	"expected-arg-2",
]
const args = process.argv.slice(2);
if (args.length < expectedArgs.length) {
	console.error("CLI arguments not provided. If you are getting this error and don't know why, you probably need to remove CLI argument logic in main.ts");
	process.exit(1);
}
*/

// Initialize server
const server = new Server(
	{
		name: "SVerse Web Tools",
		version: VERSION,
	},
	{
		capabilities: {
			tools: {},
		},
	},
);

const tools = createTools();

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
	console.error("ListTools request received");
	const toolList = tools.map(({ handler, ...tool }) => tool);
	console.error(`Returning ${toolList.length} tools: ${toolList.map(t => t.name).join(", ")}`);
	return { tools: toolList };
});

// Register tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	try {
		const { name, arguments: args } = request.params;
		console.error(`CallTool request received for tool: ${name}`);
		
		const tool = tools.find((t) => t.name === name);

		if (!tool) {
			console.error(`Unknown tool requested: ${name}`);
			throw new Error(`Unknown tool: ${name}`);
		}

		console.error(`Executing tool ${name} with args:`, args);
		const result = await tool.handler(args);
		console.error(`Tool ${name} executed successfully`);
		return result;
	} catch (error) {
		console.error(`Error executing tool:`, error);
		return {
			content: [
				{
					type: "text",
					text: `Error: ${error instanceof Error ? error.message : String(error)}`,
				},
			],
			isError: true,
		};
	}
});

// Start server
async function runServer() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("SVerse MCP Server running on stdio");
	console.error(`Available tools: ${tools.map(t => t.name).join(", ")}`);
}

runServer().catch((error) => {
	console.error("Fatal error running server:", error);
	process.exit(1);
});
