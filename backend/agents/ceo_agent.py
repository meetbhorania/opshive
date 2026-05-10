import google.generativeai as genai
from agents.base_agent import BaseAgent
import os, json
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class CEOAgent(BaseAgent):
    def __init__(self):
        super().__init__("ceo", "Dana Williams", "CEO — Always-On Supervisor")
        self.model = genai.GenerativeModel("gemini-2.0-flash")
        self.watched_alerts = []

    def receive_alert(self, agent_id: str, message: str, priority: int):
        self.watched_alerts.append({
            "from": agent_id,
            "message": message,
            "priority": priority
        })

    async def generate_brief(self, all_agent_states: list) -> str:
        self.set_status("thinking", "Synthesising war room brief...")

        alerts_summary = json.dumps([
            {"agent": a.get("id"), "alert": a.get("alertMessage"), "priority": a.get("priorityScore")}
            for a in all_agent_states if a.get("alertMessage")
        ], indent=2)

        prompt = f"""You are the CEO Agent of NovaTech, a 12-person London startup.
Your 5 department agents have just reported the following alerts:

{alerts_summary}

Generate a concise, spoken CEO war room brief. It must:
- Be under 80 words
- Start with "Attention. Three critical issues require immediate action."
- List the top 3 issues with one sentence each
- End with one recommended priority action
- Sound authoritative, calm, and urgent
- Be suitable for text-to-speech

Return ONLY the brief text, no JSON, no formatting."""

        response = self.model.generate_content(prompt)
        brief = response.text.strip()
        self.set_status("alert", "War room brief delivered", alert=brief[:80] + "...")
        return brief

    async def analyse(self, scenario: dict) -> dict:
        self.set_status("thinking", "Watching all departments...")
        return {"status": "monitoring"}
