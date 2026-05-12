from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
import asyncio
import os
import json
from dotenv import load_dotenv
from context.context_layer import mcp_context
from state import agent_registry

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

router = APIRouter()
model = genai.GenerativeModel("gemini-2.5-flash")

generated_actions = []

class ApproveAction(BaseModel):
    action_id: str

@router.get("/actions")
async def get_actions():
    return {"actions": generated_actions}

@router.post("/actions/generate")
async def generate_actions():
    global generated_actions
    generated_actions = []

    scenario = mcp_context.get_scenario()
    company = scenario.get("company", "Your company")
    agents = agent_registry

    alert_agents = [
        a for a in agents.values()
        if a.state.alert_message and a.state.id != "ceo"
    ]

    for agent in alert_agents:
        prompt = f"""You are the {agent.state.name} ({agent.state.role}) for {company}.
Current alert: {agent.state.alert_message}
Current task: {agent.state.current_task}

Generate ONE specific autonomous action you would take right now.
Return ONLY valid JSON:
{{
  "agent_id": "{agent.state.id}",
  "agent_name": "{agent.state.name}",
  "action_type": "email" or "task" or "message" or "report",
  "title": "short action title under 8 words",
  "description": "what this action does in one sentence",
  "content": "actual draft content specific to {company}. Under 60 words.",
  "priority": "high" or "critical"
}}"""

        try:
            response = model.generate_content(prompt)
            text = response.text.strip().replace('```json', '').replace('```', '')
            action = json.loads(text)
            action['id'] = f"{agent.state.id}_{len(generated_actions)}"
            action['status'] = 'pending'
            generated_actions.append(action)
        except Exception as e:
            print(f"Action gen error for {agent.state.id}: {e}")
            fallbacks = {
                "sales": {
                    "id": f"sales_{len(generated_actions)}",
                    "agent_id": "sales",
                    "agent_name": "Alex Carter",
                    "action_type": "email",
                    "title": "Re-engage stale lead",
                    "description": "Draft outreach email to cold prospect",
                    "content": f"Hi, following up on our conversation about {company}. We have exciting updates I think would be valuable. Would you have 15 minutes this week for a quick call?",
                    "priority": "critical",
                    "status": "pending"
                },
                "finance": {
                    "id": f"finance_{len(generated_actions)}",
                    "agent_id": "finance",
                    "agent_name": "Morgan Lee",
                    "action_type": "email",
                    "title": "Chase overdue invoices",
                    "description": "Draft payment chase email to overdue clients",
                    "content": f"Hi, following up on the outstanding invoice for {company}. Could you confirm when we can expect payment? Please let us know if you have any questions.",
                    "priority": "critical",
                    "status": "pending"
                },
                "support": {
                    "id": f"support_{len(generated_actions)}",
                    "agent_id": "support",
                    "agent_name": "Riley Chen",
                    "action_type": "message",
                    "title": "Escalate to engineering",
                    "description": "Alert engineering team about critical bug",
                    "content": f"URGENT: {company} experiencing critical bug causing 300%+ ticket surge. All hands needed. Please investigate immediately and provide ETA for fix.",
                    "priority": "critical",
                    "status": "pending"
                }
            }
            if agent.state.id in fallbacks:
                generated_actions.append(fallbacks[agent.state.id])

    return {"actions": generated_actions, "count": len(generated_actions)}


@router.post("/actions/approve")
async def approve_action(body: ApproveAction):
    global generated_actions
    for action in generated_actions:
        if action['id'] == body.action_id:
            action['status'] = 'approved'
            asyncio.create_task(resolve_ceo_after_approval())
            return {"status": "approved", "action_id": body.action_id}
    return {"status": "not_found"}


@router.post("/actions/dismiss")
async def dismiss_action(body: ApproveAction):
    global generated_actions
    for action in generated_actions:
        if action['id'] == body.action_id:
            action['status'] = 'dismissed'
            return {"status": "dismissed"}
    return {"status": "not_found"}


@router.post("/actions/resolve-all")
async def resolve_all_agents():
    asyncio.create_task(resolve_sequence())
    return {"status": "resolving"}


async def resolve_ceo_after_approval():
    await asyncio.sleep(1.0)
    agent_registry["ceo"].set_status(
        "completed",
        "All systems resolved — monitoring resumed",
        alert=None
    )
    await asyncio.sleep(0.5)
    agent_registry["finance"].set_status(
        "completed",
        "Invoice collection initiated",
        alert=None,
        sending_to=None
    )
    await asyncio.sleep(0.5)
    agent_registry["support"].set_status(
        "completed",
        "Engineering escalation sent",
        alert=None,
        sending_to=None
    )


async def resolve_sequence():
    agents_to_resolve = [
        a for a in agent_registry.values()
        if a.state.status in ["alert", "sending"] and a.state.id != "ceo"
    ]
    for agent in agents_to_resolve:
        await asyncio.sleep(0.8)
        agent.set_status(
            "completed",
            "Issue resolved — action taken",
            alert=None,
            sending_to=None
        )
    await asyncio.sleep(1.0)
    agent_registry["ceo"].set_status(
        "completed",
        "All issues resolved — monitoring resumed",
        alert=None
    )