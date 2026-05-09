# OpsHive

**Autonomous AI Operations Centre for Startups**

Built for AI DevCamp 2026 | Google ADK + Gemini + A2A + MCP

---

## What it does

OpsHive is a multi-agent system where 6 specialised AI agents — Sales, Finance, Marketing, Support, Ops, and CEO — monitor every department of a startup simultaneously. Agents communicate via A2A protocol, share context via MCP, and the CEO agent watches everything 24/7, delivering a spoken war room brief when a crisis is detected.

The UI is a visual office — miniature characters sitting at desks, animated in real time as agents work.

---

## Stack

- **Google ADK** — agent orchestration
- **Gemini 1.5 Flash** via Vertex AI — agent reasoning
- **A2A Protocol** — inter-agent communication
- **MCP** — shared context layer
- **FastAPI + Python** — backend
- **Next.js + Tailwind** — frontend visual office UI
- **Google Cloud TTS** — CEO spoken brief

---

## Quick start

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env  # fill in your keys
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## Branches

- `main` — stable demo-ready code only
- `dev/backend` — Meet's working branch
- `dev/frontend` — teammate's working branch
