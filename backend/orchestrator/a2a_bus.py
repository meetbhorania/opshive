import asyncio
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Callable, Literal

Priority = Literal["low", "medium", "high", "critical"]

@dataclass
class A2AMessage:
    from_agent: str
    to_agent: str
    message: str
    priority: Priority = "medium"
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())

    def to_dict(self):
        return {
            "from": self.from_agent,
            "to": self.to_agent,
            "message": self.message,
            "priority": self.priority,
            "timestamp": self.timestamp,
        }

class A2ABus:
    def __init__(self):
        self._queue: asyncio.Queue = asyncio.Queue()
        self._history: List[A2AMessage] = []
        self._listeners: List[Callable] = []

    def subscribe(self, callback: Callable):
        self._listeners.append(callback)

    async def send(self, msg: A2AMessage):
        self._history.append(msg)
        self._queue.put_nowait(msg)
        for listener in self._listeners:
            try:
                await listener(msg)
            except Exception:
                pass

    async def send_message(self, from_agent: str, to_agent: str, message: str, priority: Priority = "medium"):
        msg = A2AMessage(from_agent=from_agent, to_agent=to_agent, message=message, priority=priority)
        await self.send(msg)

    def get_history(self) -> List[dict]:
        return [m.to_dict() for m in self._history[-20:]]

    def clear(self):
        self._history.clear()
        while not self._queue.empty():
            self._queue.get_nowait()

a2a_bus = A2ABus()
