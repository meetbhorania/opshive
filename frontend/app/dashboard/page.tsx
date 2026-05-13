'use client'
import { useState, useEffect } from 'react'
import { useAgentState } from '@/hooks/useAgentState'
import { useA2AFeed } from '@/hooks/useA2AFeed'
import { triggerCrisis, resetScenario, fetchLatestBrief } from '@/lib/api'
import dynamic from 'next/dynamic'
const OfficeScene = dynamic(() => import('@/components/office/OfficeScene'), { ssr: false })

export default function Dashboard() {
    const agents = useAgentState()
    const messages = useA2AFeed()
    const [brief, setBrief] = useState<string | null>(null)
    const [chatInput, setChatInput] = useState('')
    const [chatResponse, setChatResponse] = useState<string | null>(null)
    const [chatLoading, setChatLoading] = useState(false)
    const [triggering, setTriggering] = useState(false)
    const [currentTime, setCurrentTime] = useState('')
    const [activeTab, setActiveTab] = useState<'office' | 'agents' | 'chat'>('office')
    const [companyName, setCompanyName] = useState('NovaTech')
    const [actions, setActions] = useState<any[]>([])

    useEffect(() => {
        const stored = localStorage.getItem('opshive_company')
        if (stored) {
            const data = JSON.parse(stored)
            setCompanyName(data.name)
        }
    }, [])

    useEffect(() => {
        const tick = () => setCurrentTime(new Date().toLocaleTimeString('en-GB'))
        tick()
        const interval = setInterval(tick, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const poll = async () => {
            const data = await fetchLatestBrief()
            if (data.ready) setBrief(data.brief)
        }
        const interval = setInterval(poll, 2000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const pollActions = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/agent/actions')
                const data = await res.json()
                setActions(data.actions || [])
            } catch { }
        }
        const interval = setInterval(pollActions, 2000)
        return () => clearInterval(interval)
    }, [])

    const handleTrigger = async () => {
        setTriggering(true)
        await triggerCrisis()
        setTimeout(() => setTriggering(false), 10000)
    }

    const handleReset = async () => {
        await resetScenario()
        setBrief(null)
        setChatResponse(null)
        setActions([])
    }

    const handleChat = async () => {
        if (!chatInput.trim()) return
        setChatLoading(true)
        try {
            const res = await fetch('http://127.0.0.1:8000/ceo/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: chatInput })
            })
            const data = await res.json()
            setChatResponse(data.reply)
            setChatInput('')
        } catch {
            setChatResponse('CEO Agent unavailable.')
        }
        setChatLoading(false)
    }

    const handleAction = async (actionId: string, decision: 'approve' | 'dismiss') => {
        try {
            await fetch(`http://127.0.0.1:8000/agent/actions/${decision}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action_id: actionId })
            })
            setActions(prev => prev.map(a =>
                a.id === actionId
                    ? { ...a, status: decision === 'approve' ? 'approved' : 'dismissed' }
                    : a
            ))
        } catch { }
    }

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'alert': return { bg: '#FEF2F2', border: '#FECACA', badge: '#FEE2E2', badgeText: '#991B1B', dot: '#E24B4A', label: 'Alert' }
            case 'thinking': return { bg: '#FFFBEB', border: '#FDE68A', badge: '#FEF3C7', badgeText: '#92400E', dot: '#EF9F27', label: 'Thinking' }
            case 'sending': return { bg: '#EFF6FF', border: '#BFDBFE', badge: '#DBEAFE', badgeText: '#1E40AF', dot: '#378ADD', label: 'Sending' }
            case 'completed': return { bg: '#F0FDF4', border: '#86EFAC', badge: '#DCFCE7', badgeText: '#166534', dot: '#22C55E', label: '✓ Resolved' }
            default: return { bg: '#F0FDF4', border: '#BBF7D0', badge: '#DCFCE7', badgeText: '#166534', dot: '#639922', label: 'Idle' }
        }
    }

    const getPriorityConfig = (priority: string) => {
        switch (priority) {
            case 'critical': return { bg: '#FEE2E2', text: '#991B1B' }
            case 'high': return { bg: '#FEF3C7', text: '#92400E' }
            default: return { bg: '#F1F5F9', text: '#475569' }
        }
    }

    const alertCount = agents.filter(a => a.status === 'alert').length
    const pendingActions = actions.filter(a => a.status === 'pending')

    const tabs = [
        { key: 'office', label: '🏢 Office View' },
        { key: 'agents', label: '📊 Agent Status' },
        { key: 'chat', label: '💬 CEO Chat' },
    ]

    return (
        <main style={{ minHeight: '100vh', background: '#F8F7F4', fontFamily: 'system-ui, sans-serif' }}>

            {/* Top bar */}
            <div style={{ background: '#ffffff', borderBottom: '1px solid #E8E5DE', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#639922' }} />
                    <span style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a18' }}>
                        Ops<span style={{ color: '#639922' }}>Hive</span>
                    </span>
                    <span style={{ color: '#888780', fontSize: '13px' }}>· {companyName} Operations Centre</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#888780' }}>{currentTime}</span>
                    {alertCount > 0
                        ? <span style={{ fontSize: '12px', color: '#DC2626', background: '#FEE2E2', padding: '4px 10px', borderRadius: '20px', fontWeight: '500' }}>⚠ {alertCount} active alerts</span>
                        : <span style={{ fontSize: '12px', color: '#166634', background: '#DCFCE7', padding: '4px 10px', borderRadius: '20px', fontWeight: '500' }}>✓ All systems nominal</span>
                    }
                    <button onClick={handleTrigger} disabled={triggering} style={{ background: triggering ? '#888780' : '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                        {triggering ? 'Running...' : 'Trigger Crisis'}
                    </button>
                    <button onClick={handleReset} style={{ background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                        Reset
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', height: 'calc(100vh - 57px)' }}>

                {/* Left — tabbed panel */}
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    {/* Tab bar */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #E8E5DE', background: '#ffffff' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                style={{
                                    padding: '10px 20px', fontSize: '12px', fontWeight: '500',
                                    border: 'none',
                                    borderBottom: activeTab === tab.key ? '2px solid #639922' : '2px solid transparent',
                                    background: 'transparent',
                                    color: activeTab === tab.key ? '#639922' : '#888780',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Office View Tab */}
                    {activeTab === 'office' && (
                        <div style={{ flex: 1, position: 'relative', minHeight: '400px' }}>
                            <OfficeScene />
                            <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {agents.map(agent => {
                                    const cfg = getStatusConfig(agent.status)
                                    return (
                                        <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.6)', borderRadius: '20px', padding: '4px 10px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot }} />
                                            <span style={{ fontSize: '11px', color: '#ffffff' }}>{agent.name.split(' ')[0]}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Agent Status Tab */}
                    {activeTab === 'agents' && (
                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#F8F7F4', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', alignContent: 'start' }}>
                            {agents.filter(a => a.id !== 'ceo').map(agent => {
                                const cfg = getStatusConfig(agent.status)
                                return (
                                    <div key={agent.id} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '12px', padding: '14px', transition: 'all 0.3s' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a18' }}>{agent.name}</span>
                                            <span style={{ fontSize: '11px', fontWeight: '500', background: cfg.badge, color: cfg.badgeText, padding: '2px 8px', borderRadius: '20px' }}>{cfg.label}</span>
                                        </div>
                                        <p style={{ fontSize: '11px', color: '#444441', lineHeight: '1.5', margin: '0 0 4px' }}>{agent.currentTask}</p>
                                        {agent.alertMessage && (
                                            <p style={{ fontSize: '11px', color: '#DC2626', lineHeight: '1.5', margin: '4px 0 0' }}>→ {agent.alertMessage}</p>
                                        )}
                                        {agent.sendingTo && (
                                            <p style={{ fontSize: '11px', color: '#1D4ED8', margin: '4px 0 0' }}>↗ sending to {agent.sendingTo}</p>
                                        )}
                                        {agent.activityLog && agent.activityLog.length > 0 && (
                                            <div style={{ marginTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '8px' }}>
                                                {agent.activityLog.slice(-3).map((log: any, i: number, arr: any[]) => (
                                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', flexShrink: 0, background: i === arr.length - 1 ? cfg.dot : '#CBD5E1' }} />
                                                        <span style={{ fontSize: '10px', color: i === arr.length - 1 ? '#1a1a18' : '#94A3B8', fontWeight: i === arr.length - 1 ? '500' : '400' }}>
                                                            {log.action}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                            {agents.filter(a => a.id === 'ceo').map(agent => {
                                const cfg = getStatusConfig(agent.status)
                                return (
                                    <div key={agent.id} style={{ gridColumn: '1 / -1', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#166534', flexShrink: 0 }}>DW</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a18' }}>Dana Williams — CEO Agent</span>
                                                <span style={{ fontSize: '11px', fontWeight: '500', background: cfg.badge, color: cfg.badgeText, padding: '2px 8px', borderRadius: '20px' }}>{cfg.label}</span>
                                            </div>
                                            <p style={{ fontSize: '11px', color: '#444441', margin: 0 }}>{agent.currentTask}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* CEO Chat Tab */}
                    {activeTab === 'chat' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', background: '#F8F7F4', gap: '16px', overflow: 'hidden' }}>
                            <div>
                                <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a18', margin: '0 0 4px' }}>Ask Dana Williams</h2>
                                <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>CEO Agent — always-on, aware of all departments</p>
                            </div>
                            {chatResponse ? (
                                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', color: '#1E40AF' }}>DW</div>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#1E40AF' }}>Dana Williams</span>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#1E3A8A', lineHeight: '1.7', margin: 0 }}>{chatResponse}</p>
                                </div>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Try asking:</p>
                                    {[
                                        'What is our biggest risk right now?',
                                        'What should I focus on first today?',
                                        'How is our cash flow looking?',
                                        'What is the support team dealing with?'
                                    ].map(q => (
                                        <button
                                            key={q}
                                            onClick={() => setChatInput(q)}
                                            style={{ textAlign: 'left', background: '#ffffff', border: '1px solid #E8E5DE', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#444441', cursor: 'pointer' }}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleChat()}
                                    placeholder="Ask the CEO anything..."
                                    style={{ flex: 1, background: '#ffffff', border: '1px solid #E8E5DE', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#1a1a18', outline: 'none' }}
                                />
                                <button
                                    onClick={handleChat}
                                    disabled={chatLoading}
                                    style={{ background: '#639922', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', opacity: chatLoading ? 0.5 : 1 }}
                                >
                                    {chatLoading ? '...' : 'Ask'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right panel */}
                <div style={{ borderLeft: '1px solid #E8E5DE', display: 'flex', flexDirection: 'column', background: '#ffffff', overflow: 'hidden' }}>

                    {/* A2A feed */}
                    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid #E8E5DE', flexShrink: 0 }}>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#888780', textTransform: 'uppercase', letterSpacing: '0.05em' }}>A2A Message Feed</span>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                            {messages.length === 0 ? (
                                <p style={{ padding: '16px', fontSize: '12px', color: '#888780' }}>Waiting for agent messages...</p>
                            ) : messages.map((msg, i) => {
                                const pc = getPriorityConfig(msg.priority)
                                return (
                                    <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid #F1F5F9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#639922' }}>{msg.from}</span>
                                            <span style={{ fontSize: '11px', color: '#888780' }}>→</span>
                                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#378ADD' }}>{msg.to}</span>
                                            <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: '500', background: pc.bg, color: pc.text, padding: '2px 6px', borderRadius: '4px' }}>{msg.priority}</span>
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#444441', lineHeight: '1.5', margin: 0 }}>{msg.message}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Agent Actions */}
                    <div style={{ borderTop: '1px solid #E8E5DE', padding: '12px 16px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E24B4A' }} />
                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#888780', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent Actions</span>
                            {pendingActions.length > 0 && (
                                <span style={{ marginLeft: 'auto', fontSize: '10px', background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '10px', fontWeight: '500' }}>
                                    {pendingActions.length} pending
                                </span>
                            )}
                        </div>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {pendingActions.length === 0 ? (
                                <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Actions appear after crisis is triggered...</p>
                            ) : pendingActions.map(action => (
                                <div key={action.id} style={{ background: '#F8F7F4', border: '1px solid #E8E5DE', borderRadius: '10px', padding: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: '600', color: '#639922' }}>{action.agent_name}</span>
                                        <span style={{ fontSize: '10px', background: '#EAF3DE', color: '#3B6D11', padding: '1px 6px', borderRadius: '4px' }}>{action.action_type}</span>
                                        {action.priority === 'critical' && (
                                            <span style={{ fontSize: '10px', background: '#FEE2E2', color: '#991B1B', padding: '1px 6px', borderRadius: '4px', marginLeft: 'auto' }}>critical</span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '12px', fontWeight: '500', color: '#1a1a18', margin: '0 0 4px' }}>{action.title}</p>
                                    <p style={{ fontSize: '11px', color: '#888780', margin: '0 0 8px', lineHeight: '1.5' }}>{action.content}</p>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button
                                            onClick={() => handleAction(action.id, 'approve')}
                                            style={{ flex: 1, background: '#1a1a18', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px', fontSize: '11px', fontWeight: '500', cursor: 'pointer' }}
                                        >
                                            ✓ Authorise — CEO will execute
                                        </button>
                                        <button
                                            onClick={() => handleAction(action.id, 'dismiss')}
                                            style={{ background: '#F1F5F9', color: '#888780', border: 'none', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', cursor: 'pointer' }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CEO Brief */}
                    <div style={{ borderTop: '1px solid #E8E5DE', padding: '16px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#639922' }} />
                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#888780', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CEO War Room Brief</span>
                        </div>
                        <div style={{ background: '#F8F7F4', borderRadius: '8px', padding: '12px', minHeight: '60px' }}>
                            {brief
                                ? <p style={{ fontSize: '12px', color: '#1a1a18', lineHeight: '1.7', margin: 0 }}>{brief}</p>
                                : <p style={{ fontSize: '12px', color: '#888780', margin: 0 }}>Brief appears after crisis is triggered...</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}