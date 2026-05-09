import google.generativeai as genai
from agents.base_agent import BaseAgent
import os, json

class SalesAgent(BaseAgent):
    def __init__(self):
        super().__init__("sales", "Alex Carter", "Pipeline Monitor")
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    async def analyse(self, scenario: dict) -> dict:
        self.set_status("thinking", "Scanning pipeline health...")
        leads = scenario.get("crm", {}).get("leads", [])
        stale = [l for l in leads if l.get("last_contact_days", 0) >= 3]
        pipeline_drop = scenario.get("crm", {}).get("pipeline_change_pct", 0)

        prompt = f"""You are the Sales Agent for {scenario.get('company')}.
Analyse this CRM data and return a JSON object with keys:
- alert (bool)
- priority_score (int 1-10)
- summary (str, max 20 words)
- action (str, max 15 words)

CRM data:
- Stale leads (no contact 3+ days): {json.dumps(stale)}
- Pipeline change this month: {pipeline_drop}%

Respond ONLY with valid JSON, no markdown."""

        response = self.model.generate_content(prompt)
        result = json.loads(response.text.strip())

        if result.get("alert"):
            self.state.priority_score = result.get("priority_score", 5)
            self.set_status(
                "alert",
                result.get("summary", "Pipeline risk detected"),
                alert=result.get("action", "Review stale leads immediately"),
                sending_to="finance"
            )
        else:
            self.set_status("idle", "Pipeline healthy")

        return result
