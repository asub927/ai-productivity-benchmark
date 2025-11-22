import asyncio
import os
from mcp import ClientSession, StdioServerParameters
from mcp.client.sse import sse_client
from google.adk import Agent, Tool
from dotenv import load_dotenv

load_dotenv()

NESTJS_MCP_URL = os.getenv("NESTJS_MCP_URL", "http://localhost:3000/api/mcp/sse")

async def main():
    print(f"Connecting to NestJS MCP Server at {NESTJS_MCP_URL}...")
    
    async with sse_client(NESTJS_MCP_URL) as streams:
        async with ClientSession(streams.read, streams.write) as session:
            await session.initialize()
            
            # List available tools from NestJS
            tools = await session.list_tools()
            print(f"Connected! Available tools: {[t.name for t in tools.tools]}")
            
            # Initialize Agents with these tools
            # For now, we'll just keep the connection alive and listen for requests
            # In a real implementation, this service would expose an API or listen to a queue
            
            print("Python Agent Service is running...")
            
            # Keep alive
            while True:
                await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())
