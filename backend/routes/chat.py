from fastapi import APIRouter
from pydantic import BaseModel
from context.context_layer import mcp_context
from state import agent_registry
import google.generativeai as genai
import os, json
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

router = APIRouter()
model = genai.GenerativeModel("gemini-2.0-flash")

class ChatMessage(BaseModel):
    message: str

@router.post("/chat")
async def ceo_chat(body: ChatMessage):
    agents = agent_registry
    
    # Build context from all agent states
    agent_context = json.dumps([
        {
            "agent": a.state.name,
            "role": a.state.role,
            "status": a.state.status,
            "currentTask": a.state.current_task,
            "alert": a.state.alert_message,
            "priority": a.state.priority_score
        }
        for a in agents.values()
        if a.state.id != "ceo"
    ], indent=2)

    brief = mcp_context.get("latest_brief") or "No brief generated yet."
    scenario = mcp_context.get_scenario()

    prompt = f"""You are Dana Williams, the CEO Agent of NovaTech, a 12-person London startup.
You have real-time visibility into all departments through your 5 specialist agents.

Current agent status:
{agent_context}

Latest war room brief:
{brief}

Company context:
- Monthly burn: GBP{scenario.get('finance', {}).get('monthly_burn', 0)}
- Runway: {scenario.get('finance', {}).get('runway_months', 0)} months
- Team size: {scenario.get('team_size', 12)}

The user is asking you a direct question. Answer as the CEO — confident, concise, data-driven.
Maximum 3 sentences. Use specific numbers from the agent data where relevant.
Never say you are an AI. You are the CEO Agent.

User question: {body.message}"""

    try:
        response = model.generate_content(prompt)
        reply = response.text.strip()
    except Exception:
        # Fallback response using context
        fallback_responses = {
            "risk": "Our biggest risk right now is cash flow — 47,000 GBP in overdue invoices with only 4.2 months runway. Combined with a 340% support spike suggesting a product issue, we need to act on both fronts today.",
            "cash": "We have 47,000 GBP in overdue invoices outstanding across three clients, with a monthly burn of 68,000 GBP. At current trajectory we have 4.2 months runway — collections must be prioritised today.",
            "sales": "Our top prospect Barclays Enterprise has gone cold for 6 days, and RivalCo just cut prices by 15%. Alex needs to make contact today with an updated pitch that addresses the competitive pricing.",
            "support": "Support tickets are up 340% — the root cause appears to be API timeouts on checkout. This needs engineering escalation today as it directly impacts revenue and customer retention.",
            "default": "Based on current agent reports, our three priorities are: collect 47,000 GBP in overdue invoices, fix the checkout API causing the support spike, and re-engage Barclays Enterprise before RivalCo closes the deal."
        }
        question_lower = body.message.lower()
        reply = next(
            (v for k, v in fallback_responses.items() if k in question_lower),
            fallback_responses["default"]
        )

    return {
        "reply": reply,
        "from": "Dana Williams — CEO Agent",
        "based_on_agents": [a.state.id for a in agents.values() if a.state.alert_message]
    }