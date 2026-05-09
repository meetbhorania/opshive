from fastapi import APIRouter
from mcp.context_layer import mcp_context

router = APIRouter()

@router.get("/latest")
async def get_latest_brief():
    brief = mcp_context.get("latest_brief")
    if not brief:
        return {"brief": None, "ready": False}
    return {"brief": brief, "ready": True}
