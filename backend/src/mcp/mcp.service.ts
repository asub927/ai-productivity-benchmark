import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { z } from 'zod';
import * as express from 'express';

@Injectable()
export class McpService implements OnModuleInit {
    private server: McpServer;
    private readonly logger = new Logger(McpService.name);
    private tools: Map<string, any> = new Map();

    constructor() {
        this.server = new McpServer({
            name: 'ai-productivity-backend',
            version: '1.0.0',
        });
    }

    async onModuleInit() {
        this.logger.log('Initializing MCP Server...');
        // Tools will be registered by other services calling registerTool
    }

    registerTool(
        name: string,
        description: string,
        schema: any,
        handler: (args: any) => Promise<any>
    ) {
        this.logger.log(`Registering tool: ${name}`);
        this.server.tool(name, description, schema, handler);
        this.tools.set(name, { description, schema, handler });
    }

    getTools() {
        return Array.from(this.tools.entries()).map(([name, meta]) => ({
            name,
            description: meta.description,
            schema: meta.schema
        }));
    }

    // Method to attach SSE transport to an Express app
    async attachToExpress(app: express.Application, path: string = '/sse') {
        this.logger.log(`Setting up MCP SSE endpoint at ${path}`);

        // Create a route handler that will handle SSE connections
        app.get(path, async (req, res) => {
            this.logger.log('New MCP SSE connection');
            const transport = new SSEServerTransport(path, res);
            await this.server.connect(transport);
        });

        this.logger.log(`MCP Server endpoint configured at ${path}`);
    }

    // Direct execution for internal agents (kept for backward compatibility if needed)
    async executeTool(name: string, args: any) {
        const tool = this.tools.get(name);
        if (!tool) {
            throw new Error(`Tool ${name} not found`);
        }
        return tool.handler(args);
    }
}
