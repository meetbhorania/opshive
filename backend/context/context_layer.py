import json
from pathlib import Path
from typing import Any, Optional

class MCPContextLayer:
    """Shared context layer — all agents read from and write to this."""
    def __init__(self):
        self._context: dict = {}
        self._scenario_path = Path(__file__).parent.parent / "data" / "demo_scenario.json"
        self._load_scenario()

    def _load_scenario(self):
        with open(self._scenario_path) as f:
            self._context["scenario"] = json.load(f)

    def get(self, key: str) -> Optional[Any]:
        return self._context.get(key)

    def set(self, key: str, value: Any):
        self._context[key] = value

    def get_scenario(self) -> dict:
        return self._context.get("scenario", {})

    def get_full_context(self) -> dict:
        return self._context

    def reset(self):
        self._load_scenario()
        keys_to_remove = [k for k in self._context if k != "scenario"]
        for k in keys_to_remove:
            del self._context[k]

mcp_context = MCPContextLayer()
