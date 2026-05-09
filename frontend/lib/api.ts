const BASE = 'http://localhost:8000'

export async function fetchAgentStatus() {
  const res = await fetch(`${BASE}/agents/status`)
  return res.json()
}

export async function triggerCrisis() {
  const res = await fetch(`${BASE}/scenario/trigger`, { method: 'POST' })
  return res.json()
}

export async function resetScenario() {
  const res = await fetch(`${BASE}/scenario/reset`, { method: 'POST' })
  return res.json()
}

export async function fetchLatestBrief() {
  const res = await fetch(`${BASE}/brief/latest`)
  return res.json()
}

export function createA2AFeedSocket(onMessage: (msg: any) => void): WebSocket {
  const ws = new WebSocket('ws://localhost:8000/ws/feed')
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (!data.ping) onMessage(data)
    } catch {}
  }
  return ws
}
