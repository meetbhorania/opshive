# OpsHive — AI Operations Centre

> The autonomous AI operations team for anyone building a company.

**Live Demo:** https://opshive-seven.vercel.app  
**Backend:** https://opshive-production.up.railway.app  
**Built at:** GDG London · AI DevCamp 2026

---

## What is OpsHive?

OpsHive is a multi-agent AI operations centre where six specialised agents monitor a startup's operations simultaneously, communicate via A2A protocol, share context via MCP, and deliver autonomous war room briefs.

You describe your company. Six AI agents wake up, monitor everything, and act — so you can focus on building.

---

## Demo

1. Go to https://opshive-seven.vercel.app
2. Click **"Launch OpsHive"**
3. Enter access code: `novatech2026`
4. Fill in your company details
5. Click **"Trigger Crisis"**
6. Watch six AI agents detect, collaborate and resolve in real time

---

## The Six Agents

| Agent | Name | Domain |
|---|---|---|
| Sales | Alex Carter | Pipeline, deals, prospects |
| Finance | Morgan Lee | Cash flow, invoices, runway |
| Marketing | Jamie Patel | Competitors, pricing, campaigns |
| Support | Riley Chen | Tickets, SLA, escalations |
| Ops | Sam Brooks | Engineering, deadlines, capacity |
| CEO | Dana Williams | Synthesises everything, war room brief |

---

## How It Works

```
User describes company
        ↓
Gemini AI generates custom company scenario
        ↓
Crisis triggered → all 6 agents scan simultaneously
        ↓
Agents communicate via A2A protocol
        ↓
Low priority agents auto-resolve → GREEN ✅
        ↓
CEO flags suspicious item → founder approves ONE thing
        ↓
All agents resolve → systems stable
```

---

## Tech Stack

### Backend
- **FastAPI** — Python REST API + WebSocket server
- **Google ADK** — Agent Development Kit for multi-agent orchestration
- **Gemini 2.5 Flash** — LLM powering all 6 agents via Google AI Studio
- **A2A Protocol** — Agent-to-agent communication layer
- **MCP Context Layer** — Shared memory across all agents
- **WebSockets** — Real-time A2A message streaming
- **Railway** — Always-on backend deployment

### Frontend
- **Next.js 14** — React framework
- **React Three Fiber** — 3D office visual scene
- **Three.js** — 3D rendering engine
- **Framer Motion** — Animations and scroll reveals
- **TypeScript** — Type safety
- **Vercel** — Frontend deployment

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│  Next.js + React Three Fiber + Framer Motion │
│  Landing Page → Login → Dashboard → 3D Office│
└──────────────────┬──────────────────────────┘
                   │ REST + WebSocket
┌──────────────────▼──────────────────────────┐
│                  Backend                     │
│              FastAPI + Python                │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │         Agent Registry              │    │
│  │  Sales · Finance · Marketing        │    │
│  │  Support · Ops · CEO                │    │
│  └──────────────┬──────────────────────┘    │
│                 │ A2A Protocol               │
│  ┌──────────────▼──────────────────────┐    │
│  │         MCP Context Layer           │    │
│  │    Shared state across all agents   │    │
│  └──────────────┬──────────────────────┘    │
│                 │                           │
│  ┌──────────────▼──────────────────────┐    │
│  │         Gemini 2.5 Flash            │    │
│  │    Real AI reasoning per agent      │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## API Endpoints

```
GET  /health                    — Health check
GET  /agents/status             — All 6 agent states
POST /scenario/trigger          — Trigger crisis sequence
POST /scenario/reset            — Reset all agents
GET  /brief/latest              — CEO war room brief
GET  /brief/history             — Brief history
POST /ceo/chat                  — Chat with CEO agent
POST /company/onboard           — Generate custom company scenario
GET  /agent/actions             — Pending agent actions
POST /agent/actions/approve     — Approve agent action
POST /agent/actions/dismiss     — Dismiss agent action
POST /agent/actions/resolve-all — Auto-resolve all agents
WS   /ws/feed                   — Live A2A message stream
```

---

## Running Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google AI Studio API key (Gemini)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create .env file
echo "GOOGLE_API_KEY=your_gemini_api_key" > .env

uvicorn main:app --reload --reload-dir . --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

---

## Project Structure

```
opshive/
├── backend/
│   ├── main.py                 ← FastAPI app
│   ├── state.py                ← Agent registry
│   ├── agents/
│   │   ├── base_agent.py       ← AgentState + base class
│   │   ├── sales_agent.py
│   │   ├── finance_agent.py
│   │   ├── domain_agents.py    ← Marketing, Support, Ops
│   │   └── ceo_agent.py
│   ├── orchestrator/
│   │   ├── a2a_bus.py          ← A2A message bus
│   │   └── coordinator.py      ← Agent coordination
│   ├── context/
│   │   └── context_layer.py    ← MCP shared context
│   ├── routes/
│   │   ├── agents.py
│   │   ├── scenario.py         ← Crisis sequence
│   │   ├── brief.py
│   │   ├── chat.py             ← CEO chat
│   │   ├── actions.py          ← Agent actions
│   │   ├── onboard.py          ← Company onboarding
│   │   └── websocket.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx            ← Landing page
│   │   ├── login/page.tsx      ← Login + onboarding
│   │   └── dashboard/page.tsx  ← War room dashboard
│   ├── components/
│   │   └── office/
│   │       └── OfficeScene.tsx ← 3D office (React Three Fiber)
│   ├── hooks/
│   │   ├── useAgentState.ts
│   │   └── useA2AFeed.ts
│   ├── lib/
│   │   └── api.ts
│   └── types/
│       └── agent.ts
└── README.md
```

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://opshive-seven.vercel.app |
| Backend | Railway | https://opshive-production.up.railway.app |

---

## Built By

**Meet Bhorania**  
AI Engineer & Founder  
🌐 [meetbhorania.com](https://meetbhorania.com)  
💼 [LinkedIn](https://www.linkedin.com/in/meetbhorania)  
🐙 [GitHub](https://github.com/meetbhorania)

**Manan Suthar**  
Frontend Engineer  
💼 [LinkedIn](https://www.linkedin.com/in/manansuthar/)

---

## Event

Built at **GDG London — AI DevCamp 2026**  
Category: Multi-Agent AI Systems  
Stack: Google ADK · Gemini AI · Vertex AI · MCP · A2A

---

*OpsHive — Six agents. One goal. Run your company autonomously.*
