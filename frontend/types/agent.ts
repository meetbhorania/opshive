export type AgentID = 'sales' | 'finance' | 'marketing' | 'support' | 'ops' | 'ceo'
export type AgentStatus = 'idle' | 'thinking' | 'sending' | 'alert'
export type MessagePriority = 'low' | 'medium' | 'high' | 'critical'

export interface AgentState {
  id: AgentID
  name: string
  role: string
  status: AgentStatus
  currentTask: string
  sendingTo?: AgentID
  alertMessage?: string
  priorityScore: number
  lastUpdated: string
}

export interface A2AMessage {
  from: AgentID
  to: AgentID
  message: string
  priority: MessagePriority
  timestamp: string
}

export interface BriefResponse {
  brief: string | null
  ready: boolean
}

export interface AgentsResponse {
  agents: AgentState[]
}
