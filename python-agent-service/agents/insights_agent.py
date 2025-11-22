from google.adk import Agent
from google.generativeai import GenerativeModel
import json

class InsightsAgent:
    def __init__(self, mcp_session):
        self.mcp_session = mcp_session
        self.model = GenerativeModel("gemini-2.0-flash-exp")
        
    async def analyze(self, user_id: str):
        # Call MCP tool to get analytics
        # analytics = await self.mcp_session.call_tool("get_analytics", {"userId": user_id})
        
        prompt = f"""Analyze productivity patterns. Return JSON."""
        
        response = await self.model.generate_content_async(prompt)
        try:
            return json.loads(response.text)
        except:
            return {"error": "Failed to parse", "raw": response.text}
