from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.agents import router as agents_router
from routes.scenario import router as scenario_router
from routes.brief import router as brief_router
from routes.websocket import router as ws_router

app = FastAPI(title="OpsHive API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents_router, prefix="/agents")
app.include_router(scenario_router, prefix="/scenario")
app.include_router(brief_router, prefix="/brief")
app.include_router(ws_router)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "OpsHive"}
