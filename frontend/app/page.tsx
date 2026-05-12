'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const INDUSTRIES = [
  'B2B SaaS', 'Fintech', 'Healthcare', 'E-commerce',
  'Developer Tools', 'AI / ML', 'Logistics', 'Other'
]

export default function LoginPage() {
  const [step, setStep] = useState<'login' | 'onboard' | 'loading'>('login')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [goal, setGoal] = useState('')
  const [loadingText, setLoadingText] = useState('')
  const router = useRouter()

  const handleLogin = () => {
    if (password === 'novatech2026') {
      setStep('onboard')
    } else {
      setError('Access denied. Invalid credentials.')
    }
  }

  const handleOnboard = async () => {
    if (!companyName || !industry || !teamSize || !goal) {
      setError('Please fill in all fields.')
      return
    }
    setStep('loading')

    const messages = [
      `Initialising ${companyName} operations centre...`,
      'Configuring Sales Agent — scanning market data...',
      'Configuring Finance Agent — setting up cash flow tracking...',
      'Configuring Marketing Agent — loading competitor watch...',
      'Configuring Support Agent — connecting ticket triage...',
      'Configuring Ops Agent — mapping team structure...',
      'CEO Agent online — Dana Williams is watching...',
      `${companyName} operations centre ready.`
    ]

    // Start showing messages
    for (let i = 0; i < messages.length - 1; i++) {
      setLoadingText(messages[i])
      await new Promise(r => setTimeout(r, 700))
    }

    // Call backend to generate company scenario
    try {
      await fetch('http://127.0.0.1:8000/company/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companyName,
          industry: industry,
          team_size: teamSize,
          goal: goal
        })
      })
    } catch (e) {
      console.log('Onboard API error:', e)
    }

    setLoadingText(messages[messages.length - 1])
    await new Promise(r => setTimeout(r, 800))

    localStorage.setItem('opshive_company', JSON.stringify({
      name: companyName,
      industry,
      teamSize,
      goal
    }))

    router.push('/dashboard')
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a09',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(#639922 1px, transparent 1px), linear-gradient(90deg, #639922 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px', height: '400px',
        background: '#639922', opacity: 0.04,
        borderRadius: '50%', filter: 'blur(80px)'
      }} />

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: '100%', maxWidth: '420px', padding: '0 20px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#639922', opacity: 1 - i * 0.2 }} />
            ))}
          </div>
          <h1 style={{ fontSize: '52px', fontWeight: '700', color: '#ffffff', margin: 0, letterSpacing: '-1px' }}>
            Ops<span style={{ color: '#639922' }}>Hive</span>
          </h1>
          <p style={{ color: '#444441', fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
            AI Operations Centre
          </p>
        </div>

        {/* Step 1 — Login */}
        {step === 'login' && (
          <div style={{ background: '#111110', border: '1px solid #2a2a28', borderRadius: '16px', padding: '28px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '11px', color: '#444441', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>CEO Access Code</p>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Enter access code"
                style={{ width: '100%', background: '#1a1a18', border: '1px solid #2a2a28', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {error && <p style={{ fontSize: '12px', color: '#E24B4A', margin: 0 }}>{error}</p>}
            <button
              onClick={handleLogin}
              style={{ background: '#639922', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%' }}
            >
              Enter Command Centre
            </button>
            <p style={{ fontSize: '11px', color: '#2a2a28', textAlign: 'center', margin: 0 }}>
              Demo access code: novatech2026
            </p>
          </div>
        )}

        {/* Step 2 — Company Onboarding */}
        {step === 'onboard' && (
          <div style={{ background: '#111110', border: '1px solid #2a2a28', borderRadius: '16px', padding: '28px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', margin: '0 0 4px' }}>Set up your operations centre</h2>
              <p style={{ fontSize: '12px', color: '#444441', margin: 0 }}>Tell us about your company — agents will configure automatically.</p>
            </div>

            {/* Company name */}
            <div>
              <p style={{ fontSize: '11px', color: '#444441', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>Company name</p>
              <input
                type="text"
                value={companyName}
                onChange={e => { setCompanyName(e.target.value); setError('') }}
                placeholder="e.g. BrewStack, NovaTech"
                style={{ width: '100%', background: '#1a1a18', border: '1px solid #2a2a28', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ffffff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Industry */}
            <div>
              <p style={{ fontSize: '11px', color: '#444441', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>Industry</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {INDUSTRIES.map(ind => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    style={{
                      padding: '6px 12px', fontSize: '12px', borderRadius: '20px', cursor: 'pointer',
                      background: industry === ind ? '#639922' : '#1a1a18',
                      color: industry === ind ? '#ffffff' : '#888780',
                      border: industry === ind ? '1px solid #639922' : '1px solid #2a2a28',
                      transition: 'all 0.15s'
                    }}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            {/* Team size */}
            <div>
              <p style={{ fontSize: '11px', color: '#444441', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>Team size</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['1-5', '6-15', '16-50', '50+'].map(size => (
                  <button
                    key={size}
                    onClick={() => setTeamSize(size)}
                    style={{
                      flex: 1, padding: '8px', fontSize: '12px', borderRadius: '8px', cursor: 'pointer',
                      background: teamSize === size ? '#639922' : '#1a1a18',
                      color: teamSize === size ? '#ffffff' : '#888780',
                      border: teamSize === size ? '1px solid #639922' : '1px solid #2a2a28',
                      transition: 'all 0.15s'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <p style={{ fontSize: '11px', color: '#444441', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>What are you building?</p>
              <textarea
                value={goal}
                onChange={e => { setGoal(e.target.value); setError('') }}
                placeholder="e.g. We are building a B2B invoicing platform for UK freelancers. Goal is to reach 500 paying customers by end of year..."
                rows={3}
                style={{ width: '100%', background: '#1a1a18', border: '1px solid #2a2a28', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#ffffff', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'system-ui' }}
              />
            </div>

            {error && <p style={{ fontSize: '12px', color: '#E24B4A', margin: 0 }}>{error}</p>}

            <button
              onClick={handleOnboard}
              style={{ background: '#639922', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', width: '100%' }}
            >
              Launch Operations Centre →
            </button>
          </div>
        )}

        {/* Step 3 — Loading */}
        {step === 'loading' && (
          <div style={{ background: '#111110', border: '1px solid #2a2a28', borderRadius: '16px', padding: '40px 28px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: '10px', height: '10px', borderRadius: '50%', background: '#639922',
                  animation: `pulse ${0.8 + i * 0.2}s ease-in-out infinite alternate`
                }} />
              ))}
            </div>
            <p style={{ fontSize: '14px', color: '#ffffff', textAlign: 'center', margin: 0, lineHeight: '1.6' }}>{loadingText}</p>
            <p style={{ fontSize: '11px', color: '#444441', margin: 0 }}>Configuring your AI agent team...</p>
          </div>
        )}

        <p style={{ color: '#2a2a28', fontSize: '11px', letterSpacing: '0.05em' }}>
          GDG London · AI DevCamp 2026
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          from { opacity: 0.3; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </main>
  )
}