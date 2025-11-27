# Python Agent Service

This service provides AI agent capabilities using Google ADK and connects to the NestJS backend via the Model Context Protocol (MCP).

## Architecture

The Python Agent Service uses **stdio transport** to communicate with the MCP server. This means it runs locally and communicates via standard input/output streams rather than HTTP/SSE.

## Prerequisites

- Python 3.10+
- Node.js 20+ (for running NestJS backend locally)
- Required environment variables (see `.env.example`)

## Installation

```bash
# Install Python dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env and add your GEMINI_API_KEY
```

## Running Locally

### Option 1: Using the run script (Recommended)

```bash
./run_local.sh
```

### Option 2: Direct Python execution

```bash
python main.py
```

## How It Works

1. The Python service starts and initializes a stdio MCP client
2. It connects to a local NestJS backend process via stdio streams
3. The service lists available MCP tools from the backend
4. It maintains the connection and can invoke tools as needed

## Available Tools

The service can access the following tools from the NestJS backend:
- `create_task` - Create a new task
- `get_user_tasks` - Get all tasks for a user
- `create_project` - Create a new project
- `get_user_projects` - Get all projects for a user

## Development

To extend the Python service with additional agent capabilities:

1. Add new agent logic in `main.py`
2. Use `session.call_tool()` to invoke backend tools
3. Implement custom agent workflows using Google ADK

## Deployment

**Note**: This service is designed to run locally, not on Cloud Run. The stdio transport requires direct process communication, which is not suitable for cloud deployment.

If you need to deploy this service to the cloud in the future, consider:
- Refactoring to use WebSocket transport
- Running as a sidecar container alongside the backend
- Using a message queue for asynchronous communication

## Troubleshooting

### "Could not connect to MCP server"
- Ensure the NestJS backend is running locally
- Check that the backend path in `main.py` is correct

### "GEMINI_API_KEY not set"
- Add your API key to the `.env` file
- Ensure the `.env` file is in the `python-agent-service` directory

### "Module not found" errors
- Run `pip install -r requirements.txt` to install dependencies
- Ensure you're using Python 3.10 or higher
