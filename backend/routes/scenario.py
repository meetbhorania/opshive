from fastapi import APIRouter
from mcp.context_layer import mcp_context
from orchestrator.coordinator import coordinator
from orchestrator.a2a_bus import a2a_bus
from state import agent_registry
import asyncio

router = APIRouter()

@router.post("/trigger")
async def trigger_crisis():
    """Trigger the full crisis demo scenario."""
    a2a_bus.clear()
    for agent in agent_registry.values():
        agent.reset()

    scenario = mcp_context.get_scenario()
    asyncio.create_task(run_crisis_sequence(scenario))
    return {"status": "triggered", "message": "Crisis scenario running"}

@router.post("/reset")
async def reset_scenario():
    mcp_context.reset()
    a2a_bus.clear()
    for agent in agent_registry.values():
        agent.reset()
    return {"status": "reset"}

async def run_crisis_sequence(scenario: dict):
    agents = agent_registry
    await asyncio.sleep(0.5)
    await agents["finance"].analyse(scenario)
    await asyncio.sleep(0.7)
    await agents["support"].analyse(scenario)
    await asyncio.sleep(0.7)
    await agents["marketing"].analyse(scenario)
    await asyncio.sleep(0.7)
    await agents["sales"].analyse(scenario)
    await asyncio.sleep(0.8)
    await agents["ops"].analyse(scenario)
    await asyncio.sleep(0.6)
    all_states = [a.state for a in agents.values() if a.state.id != "ceo"]
    await coordinator.coordinate(all_states)
    await asyncio.sleep(1.0)
    brief = await agents["ceo"].generate_brief([a.state.to_dict() for a in agents.values()])
    mcp_context.set("latest_brief", brief)
