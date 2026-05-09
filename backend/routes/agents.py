from fastapi import APIRouter
from state import agent_registry

router = APIRouter()

@router.get("/status")
async def get_all_agent_status():
    return {
        "agents": [agent.state.to_dict() for agent in agent_registry.values()]
    }

@router.get("/status/{agent_id}")
async def get_agent_status(agent_id: str):
    agent = agent_registry.get(agent_id)
    if not agent:
        return {"error": "Agent not found"}
    return agent.state.to_dict()
