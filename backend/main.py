from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.agents import router as agents_router
from routes.scenario import router as scenario_router
from routes.brief import router as brief_router
from routes.websocket import router as ws_router
from routes.chat import router as chat_router
from routes.toggle import router as toggle_router
from routes.onboard import router as onboard_router
from routes.actions import router as actions_router

app = FastAPI(
    title="OpsHive API",
    version="1.0.0",
    default_response_class=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://opshive-seven.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import JSONResponse
import json

class UTF8JSONResponse(JSONResponse):
    def render(self, content) -> bytes:
        return json.dumps(
            content,
            ensure_ascii=False,
            allow_nan=False,
            indent=None,
            separators=(",", ":")
        ).encode("utf-8")

app.router.default_response_class = UTF8JSONResponse

app.include_router(agents_router, prefix="/agents")
app.include_router(scenario_router, prefix="/scenario")
app.include_router(brief_router, prefix="/brief")
app.include_router(ws_router)
app.include_router(chat_router, prefix="/ceo")
app.include_router(toggle_router, prefix="/agents")
app.include_router(onboard_router, prefix="/company")
app.include_router(actions_router, prefix="/agent")

@app.get("/health")
async def health():
    return UTF8JSONResponse({"status": "ok", "service": "OpsHive"})