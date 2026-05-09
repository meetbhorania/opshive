'use client'
import { useEffect, useState } from 'react'
import { AgentState } from '@/types/agent'
import { fetchAgentStatus } from '@/lib/api'

export function useAgentState() {
  const [agents, setAgents] = useState<AgentState[]>([])

  useEffect(() => {
    const poll = async () => {
      try {
        const data = await fetchAgentStatus()
        setAgents(data.agents || [])
      } catch {}
    }
    poll()
    const interval = setInterval(poll, 1000)
    return () => clearInterval(interval)
  }, [])

  return agents
}
