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

    // Method to handle SSE connection from Controller
    async handleConnection(res: express.Response) {
        this.logger.log('New MCP SSE connection');
        const transport = new SSEServerTransport('/api/mcp/sse', res);

        // Do not await connect() as it blocks until connection closes
        this.server.connect(transport).catch(err => {
            this.logger.error('MCP Connection error', err);
        });

        // Poll for sessionId to be available
        let attempts = 0;
        const maxAttempts = 10;
        const checkSessionId = setInterval(() => {
            const sessionId = (transport as any).sessionId;
            if (sessionId) {
                clearInterval(checkSessionId);
                this.transports.set(sessionId, transport);
                this.logger.log(`Registered session: ${sessionId}`);

                // Clean up on close
                res.on('close', () => {
                    this.transports.delete(sessionId);
                    this.logger.log(`Closed session: ${sessionId}`);
                });
            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(checkSessionId);
                    this.logger.error('Could not retrieve sessionId from transport after multiple attempts');
                }
            }
        }, 100);
    }

    // Method to handle incoming messages from Controller
    async handleMessage(req: express.Request, res: express.Response) {
        this.logger.log('New MCP message received');
        const sessionId = req.query.sessionId as string;
        if (!sessionId) {
            res.status(400).send('Missing sessionId');
            return;
        }
        // We need to find the transport associated with this session.
        // However, the current SDK SSEServerTransport doesn't expose a global registry easily.
        // But wait, the SDK's SSEServerTransport.handlePostMessage is a static method or similar?
        // No, looking at SDK docs/usage:
        // The SSEServerTransport instance is created per connection.
        // We need to route the POST request to the correct transport instance.

        // Actually, the SSEServerTransport logic is:
        // 1. GET /sse -> creates transport, sends 'endpoint' event with ?sessionId=...
        // 2. POST /sse?sessionId=... -> client sends message here.

        // The issue is: how do we get the transport instance back?
        // The SDK's SSEServerTransport doesn't seem to manage a global map of sessions.
        // We might need to maintain a map of sessionId -> transport.

        // Let's check how we can handle this.
        // If we look at the SDK source or examples (which I can't do directly), 
        // usually one would use an adapter that handles both.

        // Since I don't have the SDK source, I'll implement a simple map.
        // But wait, SSEServerTransport might handle this if we pass the request to it?
        // No, it's instantiated per response.

        // Let's try to maintain a map of transports.
        await this.handleIncomingMessage(sessionId, req, res);
    }

    private transports = new Map<string, SSEServerTransport>();

    async handleIncomingMessage(sessionId: string, req: express.Request, res: express.Response) {
        const transport = this.transports.get(sessionId);
        if (!transport) {
            this.logger.warn(`Session not found: ${sessionId}`);
            res.status(404).send('Session not found');
            return;
        }

        try {
            // Call handlePostMessage on the transport
            // The SDK expects req.body to be available
            await (transport as any).handlePostMessage(req, res);
            this.logger.log(`Successfully handled message for session: ${sessionId}`);
        } catch (error) {
            this.logger.error(`Error handling POST message for session ${sessionId}:`, error);
            if (!res.headersSent) {
                res.status(500).send('Internal server error');
            }
        }
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
