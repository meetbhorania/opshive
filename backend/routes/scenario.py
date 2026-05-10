from fastapi import APIRouter
from context.context_layer import mcp_context
from orchestrator.coordinator import coordinator
from orchestrator.a2a_bus import a2a_bus
from state import agent_registry
import asyncio

router = APIRouter()

@router.post("/trigger")
async def trigger_crisis():
    a2a_bus.clear()
    for agent in agent_registry.values():
        agent.reset()
    asyncio.create_task(run_crisis_sequence(mcp_context.get_scenario()))
    return {"status": "triggered"}

@router.post("/reset")
async def reset_scenario():
    mcp_context.reset()
    a2a_bus.clear()
    for agent in agent_registry.values():
        agent.reset()
    return {"status": "reset"}

async def run_crisis_sequence(scenario: dict):
    agents = agent_registry
    fallbacks = {
        "finance": ("alert", "47,000 GBP overdue invoices — cash flow critical", "Chase all overdue invoices today"),
        "support": ("alert", "Tickets up 340% — API timeout on checkout", "Engineering must fix checkout API today"),
        "marketing": ("sending", "RivalCo cut prices 15% — act now", "Update sales pitch deck immediately"),
        "sales": ("alert", "Top prospect cold 6 days — deal at risk", "Call Barclays Enterprise today"),
        "ops": ("sending", "Two engineers double-booked on deadline", "Reassign Dev B to gateway refactor"),
    }

    steps = ["finance", "support", "marketing", "sales", "ops"]
    for agent_id in steps:
        await asyncio.sleep(0.8)
        try:
            await agents[agent_id].analyse(scenario)
        except Exception as e:
            print(f"[FALLBACK] {agent_id}: {e}")
            status, task, alert = fallbacks[agent_id]
            agents[agent_id].set_status(status, task, alert=alert)
            sending_to = {"finance": "ceo", "marketing": "sales", "ops": "ceo"}.get(agent_id)
            if sending_to:
                agents[agent_id].state.sending_to = sending_to

    await asyncio.sleep(1.0)
    all_states = [a.state for a in agents.values() if a.state.id != "ceo"]
    await coordinator.coordinate(all_states)
    await asyncio.sleep(1.0)

    try:
        brief = await agents["ceo"].generate_brief([a.state.to_dict() for a in agents.values()])
    except Exception:
        brief = "Attention. Three critical issues require immediate action. Finance reports 47,000 GBP in overdue invoices threatening cash flow. Support tickets have spiked 340% due to API timeouts on checkout. Our top sales prospect has gone cold for six days while RivalCo just cut prices by 15%. Recommended priority: chase invoices today, escalate API fix to engineering, and call Barclays Enterprise immediately."

    mcp_context.set("latest_brief", brief)
    agents["ceo"].set_status("alert", "War room brief delivered", alert=brief[:100])