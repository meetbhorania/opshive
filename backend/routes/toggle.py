from fastapi import APIRouter
from pydantic import BaseModel
from state import agent_registry

router = APIRouter()

class ToggleRequest(BaseModel):
    agent_id: str
    active: bool

@router.post("/toggle")
async def toggle_agent(body: ToggleRequest):
    agent = agent_registry.get(body.agent_id)
    if not agent:
        return {"error": f"Agent {body.agent_id} not found"}
    
    if not body.active:
        agent.set_status("idle", "Agent offline")
        agent.state.priority_score = 0
        agent.state.alert_message = None
        agent.state.sending_to = None
    else:
        agent.set_status("idle", "Monitoring...")

    return {
        "agent_id": body.agent_id,
        "active": body.active,
        "status": agent.state.status
    }

@router.get("/toggle/status")
async def get_toggle_status():
    return {
        agent_id: {
            "active": agent.state.current_task != "Agent offline",
            "status": agent.state.status
        }
        for agent_id, agent in agent_registry.items()
    }