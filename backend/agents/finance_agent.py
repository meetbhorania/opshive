import google.generativeai as genai
from agents.base_agent import BaseAgent
import os, json
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class FinanceAgent(BaseAgent):
    def __init__(self):
        super().__init__("finance", "Morgan Lee", "Cash Flow Tracker")
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    async def analyse(self, scenario: dict) -> dict:
        self.set_status("thinking", "Scanning invoices and burn rate...")
        finance = scenario.get("finance", {})

        prompt = f"""You are the Finance Agent for {scenario.get('company')}.
Analyse this financial data and return a JSON object with keys:
- alert (bool)
- priority_score (int 1-10)
- summary (str, max 20 words)
- action (str, max 15 words)

Finance data:
- Overdue invoices: {json.dumps(finance.get('overdue_invoices', []))}
- Total exposure: £{finance.get('total_exposure', 0)}
- Monthly burn: £{finance.get('monthly_burn', 0)}
- Runway: {finance.get('runway_months', 0)} months

Respond ONLY with valid JSON, no markdown."""

        response = self.model.generate_content(prompt)
        result = json.loads(response.text.strip())

        if result.get("alert"):
            self.state.priority_score = result.get("priority_score", 8)
            self.set_status(
                "alert",
                result.get("summary", "Cash flow risk detected"),
                alert=result.get("action", "Chase overdue invoices immediately"),
                sending_to="ceo"
            )
        else:
            self.set_status("idle", "Finances stable")

        return result
