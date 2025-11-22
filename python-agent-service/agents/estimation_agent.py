from google.adk import Agent
from google.generativeai import GenerativeModel
import json

class EstimationAgent:
    def __init__(self, mcp_session):
        self.mcp_session = mcp_session
        self.model = GenerativeModel("gemini-2.0-flash-exp")
        
    async def estimate(self, user_id: str, task_description: str):
        # In a real implementation, we would call self.mcp_session.call_tool("get_user_tasks", ...)
        # to get historical data.
        
        prompt = f"""Estimate time for this task: "{task_description}"
        Return JSON: {{ "humanTime": number, "aiTime": number, "confidence": number, "category": string }}"""
        
        response = await self.model.generate_content_async(prompt)
        try:
            return json.loads(response.text)
        except:
            return {"error": "Failed to parse", "raw": response.text}
