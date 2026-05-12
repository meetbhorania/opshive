'use client'
import { useEffect, useState } from 'react'
import { A2AMessage } from '@/types/agent'

export function useA2AFeed() {
  const [messages, setMessages] = useState<A2AMessage[]>([])

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/feed')

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (!data.ping) {
          setMessages(prev => [data, ...prev].slice(0, 20))
        }
      } catch { }
    }

    ws.onerror = () => {
      // Backend not running — silent fail, will retry on next mount
    }

    return () => ws.close()
  }, [])

  return messages
}