from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from orchestrator.a2a_bus import a2a_bus
import asyncio, json

router = APIRouter()
connected_clients: list[WebSocket] = []

async def broadcast_message(msg):
    dead = []
    for ws in connected_clients:
        try:
            await ws.send_text(json.dumps(msg.to_dict()))
        except Exception:
            dead.append(ws)
    for ws in dead:
        connected_clients.remove(ws)

a2a_bus.subscribe(broadcast_message)

@router.websocket("/ws/feed")
async def websocket_feed(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        for msg in a2a_bus.get_history():
            await websocket.send_text(json.dumps(msg))
        while True:
            await asyncio.sleep(1)
            await websocket.send_text(json.dumps({"ping": True}))
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
