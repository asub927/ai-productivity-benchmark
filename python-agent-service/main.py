import asyncio
import os
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from dotenv import load_dotenv

load_dotenv()

async def main():
    print("Starting Python Agent Service with stdio transport...")
    
    # Use stdio transport for local execution
    server_params = StdioServerParameters(
        command="node",
        args=["dist/main.js"],  # Adjust path to your NestJS backend if running locally
        env=None
    )
    
    async with stdio_client(server_params) as (read_stream, write_stream):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            
            # List available tools from NestJS
            tools = await session.list_tools()
            print(f"Connected! Available tools: {[t.name for t in tools.tools]}")
            
            # Python Agent Service is now connected to NestJS MCP Server via stdio
            # In a full implementation, this would expose an API or listen to a queue
            # For now, it maintains the connection and can be extended to handle agent requests
            
            print("Python Agent Service is running and connected to MCP server via stdio...")
            
            # Keep alive
            while True:
                await asyncio.sleep(10)

if __name__ == "__main__":
    asyncio.run(main())
