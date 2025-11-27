#!/bin/bash

# Python Agent Service - Local Execution Script
# This script runs the Python agent service locally using stdio transport

echo "Starting Python Agent Service (stdio transport)..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check for required environment variables
if [ -z "$GEMINI_API_KEY" ]; then
    echo "Warning: GEMINI_API_KEY not set. Some features may not work."
fi

# Run the Python service
python main.py
