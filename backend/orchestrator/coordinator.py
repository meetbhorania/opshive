import asyncio
from orchestrator.a2a_bus import a2a_bus
from agents.base_agent import AgentState
from typing import List

class OpsCoordinator:
    def __init__(self):
        self.priority_order = ["finance", "support", "sales", "marketing", "ops"]

    async def coordinate(self, agent_states: List[AgentState]) -> List[dict]:
        alerts = [s for s in agent_states if s.status == "alert"]
        alerts.sort(key=lambda a: a.priority_score, reverse=True)

        briefing_points = []
        for agent in alerts:
            if agent.alert_message:
                priority = "critical" if agent.priority_score >= 8 else "high" if agent.priority_score >= 5 else "medium"
                await a2a_bus.send_message(
                    from_agent=agent.id,
                    to_agent="ceo",
                    message=f"{agent.name} reports: {agent.alert_message}",
                    priority=priority
                )
                briefing_points.append({
                    "agent": agent.id,
                    "name": agent.name,
                    "message": agent.alert_message,
                    "priority_score": agent.priority_score
                })

        sending_agents = [s for s in agent_states if s.status == "sending" and s.sending_to]
        for agent in sending_agents:
            await a2a_bus.send_message(
                from_agent=agent.id,
                to_agent=agent.sending_to,
                message=agent.current_task,
                priority="medium"
            )

        return briefing_points

coordinator = OpsCoordinator()
