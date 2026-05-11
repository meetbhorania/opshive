'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = () => {
    if (password === 'novatech2026') {
      setLoading(true)
      setTimeout(() => router.push('/dashboard'), 1500)
    } else {
      setError('Access denied. Invalid credentials.')
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#639922 1px, transparent 1px), linear-gradient(90deg, #639922 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#639922] opacity-5 rounded-full blur-3xl" />

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#639922] animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-[#639922] animate-pulse delay-75" />
            <div className="w-3 h-3 rounded-full bg-[#639922] animate-pulse delay-150" />
          </div>
          <h1 className="text-6xl font-bold text-white tracking-tight">
            Ops<span className="text-[#639922]">Hive</span>
          </h1>
          <p className="text-[#888780] text-sm tracking-widest uppercase">
            NovaTech Operations Centre
          </p>
        </div>

        {/* Login box */}
        <div className="bg-[#111110] border border-[#2a2a28] rounded-2xl p-8 w-80 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[#888780] text-xs uppercase tracking-widest">
              CEO Access Code
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter access code"
              className="bg-[#1a1a18] border border-[#2a2a28] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#639922] transition-colors placeholder-[#444441]"
            />
          </div>

          {error && (
            <p className="text-[#E24B4A] text-xs">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-[#639922] hover:bg-[#7ab82a] disabled:opacity-50 text-white font-medium py-3 rounded-lg text-sm transition-colors"
          >
            {loading ? 'Authenticating...' : 'Enter Command Centre'}
          </button>
        </div>

        <p className="text-[#444441] text-xs">
          GDG London · AI DevCamp 2026
        </p>
      </div>
    </main>
  )
}