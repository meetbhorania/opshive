from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional, Literal, List
from datetime import datetime

AgentStatus = Literal["idle", "thinking", "sending", "alert"]
AgentID = Literal["sales", "finance", "marketing", "support", "ops", "ceo"]

@dataclass
class AgentActivity:
    action: str
    timestamp: str
    status: AgentStatus

@dataclass
class AgentState:
    id: AgentID
    name: str
    role: str
    status: AgentStatus = "idle"
    current_task: str = "Monitoring..."
    sending_to: Optional[AgentID] = None
    alert_message: Optional[str] = None
    priority_score: int = 0
    last_updated: str = field(default_factory=lambda: datetime.now().isoformat())
    activity_log: List[dict] = field(default_factory=list)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "status": self.status,
            "currentTask": self.current_task,
            "sendingTo": self.sending_to,
            "alertMessage": self.alert_message,
            "priorityScore": self.priority_score,
            "lastUpdated": self.last_updated,
            "activityLog": self.activity_log[-5:],
        }

class BaseAgent(ABC):
    def __init__(self, agent_id: AgentID, name: str, role: str):
        self.state = AgentState(id=agent_id, name=name, role=role)

    def set_status(self, status: AgentStatus, task: str = "", alert: str = None, sending_to: AgentID = None):
        self.state.status = status
        if task:
            self.state.current_task = task
        self.state.alert_message = alert
        self.state.sending_to = sending_to
        self.state.last_updated = datetime.now().isoformat()

        self.state.activity_log.append({
            "action": task or status,
            "status": status,
            "timestamp": self.state.last_updated
        })
        self.state.activity_log = self.state.activity_log[-10:]

    def reset(self):
        self.state.status = "idle"
        self.state.current_task = "Monitoring..."
        self.state.sending_to = None
        self.state.alert_message = None
        self.state.priority_score = 0
        self.state.last_updated = datetime.now().isoformat()
        self.state.activity_log = []

    @abstractmethod
    async def analyse(self, scenario: dict) -> dict:
        pass