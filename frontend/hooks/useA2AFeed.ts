'use client'
import { useEffect, useState } from 'react'
import { A2AMessage } from '@/types/agent'
import { createA2AFeedSocket } from '@/lib/api'

export function useA2AFeed() {
  const [messages, setMessages] = useState<A2AMessage[]>([])

  useEffect(() => {
    const ws = createA2AFeedSocket((msg: A2AMessage) => {
      setMessages(prev => [msg, ...prev].slice(0, 20))
    })
    return () => ws.close()
  }, [])

  return messages
}
