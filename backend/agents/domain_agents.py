import google.generativeai as genai
from agents.base_agent import BaseAgent
import os, json
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class MarketingAgent(BaseAgent):
    def __init__(self):
        super().__init__("marketing", "Jamie Patel", "Competitor Watch")
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    async def analyse(self, scenario: dict) -> dict:
        self.set_status("thinking", "Scanning competitor activity...")
        mkt = scenario.get("marketing", {})

        prompt = f"""You are the Marketing Agent for {scenario.get('company')}.
Analyse competitor data and return JSON with keys:
- alert (bool)
- priority_score (int 1-10)
- summary (str, max 20 words)
- action (str, max 15 words)

Data: {json.dumps(mkt)}
Respond ONLY with valid JSON, no markdown."""

        response = self.model.generate_content(prompt)
        result = json.loads(response.text.strip())

        if result.get("alert"):
            self.state.priority_score = result.get("priority_score", 6)
            self.set_status("sending", result.get("summary", "Competitor price cut detected"),
                          alert=result.get("action"), sending_to="sales")
        else:
            self.set_status("idle", "Market stable")
        return result


class SupportAgent(BaseAgent):
    def __init__(self):
        super().__init__("support", "Riley Chen", "Ticket Triage")
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    async def analyse(self, scenario: dict) -> dict:
        self.set_status("thinking", "Scanning support queue...")
        sup = scenario.get("support", {})

        prompt = f"""You are the Support Agent for {scenario.get('company')}.
Analyse support data and return JSON with keys:
- alert (bool)
- priority_score (int 1-10)
- summary (str, max 20 words)
- action (str, max 15 words)

Data: {json.dumps(sup)}
Respond ONLY with valid JSON, no markdown."""

        response = self.model.generate_content(prompt)
        result = json.loads(response.text.strip())

        if result.get("alert"):
            self.state.priority_score = result.get("priority_score", 9)
            self.set_status("alert", result.get("summary", "Support spike detected"),
                          alert=result.get("action"), sending_to="ops")
        else:
            self.set_status("idle", "Support queue normal")
        return result


class OpsAgent(BaseAgent):
    def __init__(self):
        super().__init__("ops", "Sam Brooks", "Task Coordinator")
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    async def analyse(self, scenario: dict) -> dict:
        self.set_status("thinking", "Scanning task board and team capacity...")
        ops = scenario.get("ops", {})

        prompt = f"""You are the Ops Agent for {scenario.get('company')}.
Analyse ops data and return JSON with keys:
- alert (bool)
- priority_score (int 1-10)
- summary (str, max 20 words)
- action (str, max 15 words)

Data: {json.dumps(ops)}
Respond ONLY with valid JSON, no markdown."""

        response = self.model.generate_content(prompt)
        result = json.loads(response.text.strip())

        if result.get("alert"):
            self.state.priority_score = result.get("priority_score", 5)
            self.set_status("sending", result.get("summary", "Deadline conflict detected"),
                          alert=result.get("action"), sending_to="ceo")
        else:
            self.set_status("idle", "Operations normal")
        return result
