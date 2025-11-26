import asyncio
import os
from mcp import ClientSession, StdioServerParameters
from mcp.client.sse import sse_client
from dotenv import load_dotenv

load_dotenv()

NESTJS_MCP_URL = os.getenv("NESTJS_MCP_URL", "http://localhost:3000/api/mcp/sse")

async def main():
    print("Starting Python Agent Service with tuple unpacking fix...")
    print(f"Connecting to NestJS MCP Server at {NESTJS_MCP_URL}...")
    
    async with sse_client(NESTJS_MCP_URL) as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            
            # List available tools from NestJS
            tools = await session.list_tools()
            print(f"Connected! Available tools: {[t.name for t in tools.tools]}")
            
            # Python Agent Service is now connected to NestJS MCP Server
            # In a full implementation, this would expose an API or listen to a queue
            # For now, it maintains the connection and can be extended to handle agent requests
            
            print("Python Agent Service is running and connected to MCP server...")
            
            # Keep alive
            while True:
                await asyncio.sleep(10)

if __name__ == "__main__":
    asyncio.run(main())
