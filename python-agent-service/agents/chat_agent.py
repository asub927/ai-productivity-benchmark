from google.adk import Agent
from google.generativeai import GenerativeModel
import os

class ChatAgent:
    def __init__(self, mcp_session):
        self.mcp_session = mcp_session
        self.model = GenerativeModel("gemini-2.0-flash-exp")
        
    async def chat(self, user_id: str, message: str, history: list = []):
        # Convert tools from MCP to Gemini format if needed
        # For this demo, we'll assume the agent can call tools via the session
        
        chat = self.model.start_chat(history=[])
        response = await chat.send_message(message)
        
        return response.text
