from fastapi import APIRouter
from context.context_layer import mcp_context

router = APIRouter()

@router.get("/latest")
async def get_latest_brief():
    brief = mcp_context.get("latest_brief")
    if not brief:
        return {"brief": None, "ready": False}
    return {"brief": brief, "ready": True}

@router.get("/history")
async def get_brief_history():
    history = mcp_context.get("brief_history") or []
    return {"history": history, "count": len(history)}