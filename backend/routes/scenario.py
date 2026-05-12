from fastapi import APIRouter
from context.context_layer import mcp_context
from orchestrator.coordinator import coordinator
from orchestrator.a2a_bus import a2a_bus
from state import agent_registry
from datetime import datetime
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
        "finance": ("alert", "47,000 GBP overdue invoices - cash flow critical", "Chase all overdue invoices today"),
        "support": ("alert", "Tickets up 340% - API timeout on checkout", "Engineering must fix checkout API today"),
        "marketing": ("sending", "RivalCo cut prices 15% - act now", "Update sales pitch deck immediately"),
        "sales": ("alert", "Top prospect cold 6 days - deal at risk", "Call Barclays Enterprise today"),
        "ops": ("sending", "Two engineers double-booked on deadline", "Reassign Dev B to gateway refactor"),
    }

    # Phase 1 — detection
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

    # Phase 2 — A2A coordination
    await asyncio.sleep(1.0)
    all_states = [a.state for a in agents.values() if a.state.id != "ceo"]
    await coordinator.coordinate(all_states)
    await asyncio.sleep(1.0)

    # Phase 3 — CEO generates brief and detects suspicious item
    try:
        brief = await agents["ceo"].generate_brief([a.state.to_dict() for a in agents.values()])
    except Exception:
        brief = "Attention. Three critical issues require immediate action. Finance reports 47,000 GBP in overdue invoices threatening cash flow. Support tickets have spiked 340% due to API timeouts. Top sales prospect cold for six days. Recommended priority: chase invoices today, escalate API fix, call top prospect immediately."

    mcp_context.set("latest_brief", brief)
    history = mcp_context.get("brief_history") or []
    history.insert(0, {
        "brief": brief,
        "timestamp": datetime.now().isoformat(),
        "triggered_by": "crisis_scenario"
    })
    mcp_context.set("brief_history", history[:5])

    # Phase 4 — auto resolve low priority agents
    await asyncio.sleep(1.5)
    low_priority = ["marketing", "ops", "sales"]
    for agent_id in low_priority:
        await asyncio.sleep(0.8)
        agents[agent_id].set_status(
            "completed",
            f"Issue resolved autonomously",
            alert=None,
            sending_to=None
        )
        await a2a_bus.send_message(
            from_agent=agent_id,
            to_agent="ceo",
            message=f"{agents[agent_id].state.name} has resolved their issue autonomously.",
            priority="low"
        )

    # Phase 5 — CEO flags suspicious high-priority item for founder
    await asyncio.sleep(1.0)
    company = scenario.get("company", "your company")
    suspicious_item = {
        "id": "ceo_flag_001",
        "agent_id": "ceo",
        "agent_name": "Dana Williams — CEO",
        "action_type": "approval",
        "title": "CEO flagged: Cash flow risk requires founder decision",
        "content": f"Finance exposure of 47,000 GBP combined with 4-month runway is critical for {company}. I recommend immediately contacting all overdue clients personally. This decision requires your authorisation as it impacts client relationships.",
        "priority": "critical",
        "status": "pending",
        "ceo_recommendation": True
    }

    # Store the suspicious item
    from routes.actions import generated_actions
    generated_actions.clear()
    generated_actions.append(suspicious_item)

    agents["ceo"].set_status(
        "alert",
        "Suspicious risk detected — awaiting founder approval",
        alert="Cash flow risk flagged — founder decision required"
    )

    mcp_context.set("latest_brief", brief)