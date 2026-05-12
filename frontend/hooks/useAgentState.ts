'use client'
import { useEffect, useState } from 'react'
import { AgentState } from '@/types/agent'

export function useAgentState() {
  const [agents, setAgents] = useState<AgentState[]>([])
  const [prevAgents, setPrevAgents] = useState<Record<string, string>>({})

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/agents/status')
        const data = await res.json()
        const newAgents: AgentState[] = data.agents || []

        setAgents(prev => {
          const updated = newAgents.map(agent => {
            const old = prev.find(a => a.id === agent.id)
            if (!old) return agent
            if (old.status !== agent.status || old.currentTask !== agent.currentTask) {
              return { ...agent, _transitioning: true }
            }
            return agent
          })
          return updated
        })
      } catch { }
    }

    poll()
    const interval = setInterval(poll, 1000)
    return () => clearInterval(interval)
  }, [])

  return agents
}