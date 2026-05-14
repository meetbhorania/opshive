'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const ROTATING_WORDS = ['autonomous AI team', 'six AI agents', 'operations centre', 'founding team']

function RotatingHeadline() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(i => (i + 1) % ROTATING_WORDS.length)
        }, 2500)
        return () => clearInterval(interval)
    }, [])

    return (
        <h1 style={{
            fontSize: 'clamp(44px, 7vw, 82px)',
            fontWeight: '700', lineHeight: '1.08',
            letterSpacing: '-2.5px', margin: '0 0 24px',
            color: 'rgba(255,255,255,0.92)'
        }}>
            The{' '}
            <motion.span
                key={index}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #639922 0%, #a8d86e 50%, #378ADD 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}
            >
                {ROTATING_WORDS[index]}
            </motion.span>
            {' '}for anyone<br />building a company.
        </h1>
    )
}

function SpotlightCard({
    children, delay = 0, accent = '#639922', style,
}: {
    children: React.ReactNode
    delay?: number
    accent?: string
    style?: React.CSSProperties
}) {
    const [hovered, setHovered] = useState(false)
    const [mouse, setMouse] = useState({ x: 0, y: 0 })
    const ref = useRef<HTMLDivElement>(null)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ rotateX: 1.5, rotateY: 3, scale: 1.015, transition: { duration: 0.35 } }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={e => {
                if (!ref.current) return
                const r = ref.current.getBoundingClientRect()
                setMouse({ x: e.clientX - r.left, y: e.clientY - r.top })
            }}
            style={{
                background: '#0a0d16',
                border: `1px solid ${hovered ? accent + '50' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '20px', padding: '36px',
                position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.3s', cursor: 'default',
                transformStyle: 'preserve-3d', ...style
            }}
        >
            {hovered && (
                <div style={{
                    position: 'absolute', left: mouse.x - 200, top: mouse.y - 200,
                    width: '400px', height: '400px',
                    background: `radial-gradient(circle, ${accent}14 0%, transparent 70%)`,
                    borderRadius: '50%', pointerEvents: 'none'
                }} />
            )}
            <div style={{
                position: 'absolute', top: 0, left: 0,
                width: hovered ? '100%' : '0%', height: '1px',
                background: `linear-gradient(90deg, ${accent}80, transparent)`,
                transition: 'width 0.5s ease'
            }} />
            {children}
        </motion.div>
    )
}

function PricingCard({ plan, delay }: { plan: any, delay: number }) {
    const [hovered, setHovered] = useState(false)
    const [mouse, setMouse] = useState({ x: 0, y: 0 })
    const ref = useRef<HTMLDivElement>(null)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ rotateX: 1, rotateY: 2, scale: 1.01, transition: { duration: 0.3 } }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={e => {
                if (!ref.current) return
                const r = ref.current.getBoundingClientRect()
                setMouse({ x: e.clientX - r.left, y: e.clientY - r.top })
            }}
            style={{
                background: plan.popular ? 'rgba(99,153,34,0.08)' : '#0a0d16',
                border: plan.popular ? '1px solid rgba(99,153,34,0.4)' : `1px solid ${hovered ? plan.accent + '40' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '20px', padding: '36px 28px',
                position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.3s', transformStyle: 'preserve-3d'
            }}
        >
            {hovered && (
                <div style={{
                    position: 'absolute', left: mouse.x - 200, top: mouse.y - 200,
                    width: '400px', height: '400px',
                    background: `radial-gradient(circle, ${plan.accent}12 0%, transparent 70%)`,
                    borderRadius: '50%', pointerEvents: 'none'
                }} />
            )}
            <div style={{
                position: 'absolute', top: 0, left: 0,
                width: hovered || plan.popular ? '100%' : '0%', height: '1px',
                background: `linear-gradient(90deg, ${plan.accent}80, transparent)`,
                transition: 'width 0.5s ease'
            }} />
            {plan.popular && (
                <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'rgba(99,153,34,0.2)', border: '1px solid rgba(99,153,34,0.4)',
                    borderRadius: '20px', padding: '3px 10px',
                    fontSize: '10px', color: '#a8d86e', fontWeight: '600', letterSpacing: '0.06em'
                }}>MOST POPULAR</div>
            )}
            <div style={{ fontSize: '13px', fontWeight: '600', color: plan.accent, marginBottom: '16px', letterSpacing: '0.04em' }}>{plan.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '48px', fontWeight: '700', color: '#fff', letterSpacing: '-2px', lineHeight: '1' }}>{plan.price}</span>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>{plan.period}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '0 0 28px', lineHeight: '1.5' }}>{plan.description}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {plan.features.map((f: string, j: number) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '16px', height: '16px', borderRadius: '50%',
                            background: `${plan.accent}20`, border: `1px solid ${plan.accent}40`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, fontSize: '9px', color: plan.accent
                        }}>✓</div>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>{f}</span>
                    </div>
                ))}
            </div>
            <Link href="/login" style={{
                display: 'block', textAlign: 'center',
                background: plan.popular ? '#639922' : 'rgba(255,255,255,0.06)',
                border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: '#fff', padding: '12px', borderRadius: '10px',
                fontSize: '14px', fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s'
            }}
                onMouseEnter={e => { e.currentTarget.style.background = plan.popular ? '#7ab82a' : 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.background = plan.popular ? '#639922' : 'rgba(255,255,255,0.06)' }}
            >{plan.cta}</Link>
        </motion.div>
    )
}

function CityBackground() {
    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, #050810 0%, #0a0e1a 40%, #0d1628 65%, #0a1a0a 100%)'
            }} />
            {[
                [8, 4], [15, 8], [25, 3], [35, 6], [48, 2], [55, 9], [68, 4], [78, 7], [88, 3], [95, 6],
                [12, 15], [28, 12], [42, 18], [58, 11], [72, 16], [85, 13], [5, 20], [38, 22], [65, 19],
                [20, 28], [50, 25], [75, 30], [10, 35], [45, 32], [80, 27]
            ].map(([x, y], i) => (
                <div key={i} style={{
                    position: 'absolute', left: `${x}%`, top: `${y}%`,
                    width: i % 3 === 0 ? '2px' : '1px', height: i % 3 === 0 ? '2px' : '1px',
                    borderRadius: '50%', background: '#fff',
                    opacity: 0.2 + (i % 4) * 0.12
                }} />
            ))}
            <div style={{
                position: 'absolute', top: '30%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '700px', height: '700px',
                background: 'radial-gradient(circle, rgba(99,153,34,0.07) 0%, transparent 70%)',
                borderRadius: '50%'
            }} />
            <svg viewBox="0 0 1440 280" xmlns="http://www.w3.org/2000/svg"
                style={{ position: 'absolute', bottom: 0, width: '100%', height: '280px' }}
                preserveAspectRatio="none"
            >
                <rect x="0" y="180" width="60" height="100" fill="#0a1220" />
                <rect x="65" y="150" width="45" height="130" fill="#0d1628" />
                <rect x="115" y="165" width="70" height="115" fill="#0a1220" />
                <rect x="190" y="125" width="50" height="155" fill="#0d1628" />
                <rect x="245" y="155" width="40" height="125" fill="#0a1220" />
                <rect x="290" y="135" width="80" height="145" fill="#0d1628" />
                <rect x="375" y="115" width="55" height="165" fill="#0a1220" />
                <rect x="435" y="150" width="45" height="130" fill="#0d1628" />
                <rect x="485" y="130" width="65" height="150" fill="#0a1220" />
                <rect x="555" y="140" width="50" height="140" fill="#0d1628" />
                <rect x="610" y="105" width="90" height="175" fill="#0a1220" />
                <rect x="705" y="145" width="40" height="135" fill="#0d1628" />
                <rect x="750" y="125" width="70" height="155" fill="#0a1220" />
                <rect x="825" y="155" width="50" height="125" fill="#0d1628" />
                <rect x="880" y="115" width="80" height="165" fill="#0a1220" />
                <rect x="965" y="140" width="55" height="140" fill="#0d1628" />
                <rect x="1025" y="130" width="65" height="150" fill="#0a1220" />
                <rect x="1095" y="150" width="45" height="130" fill="#0d1628" />
                <rect x="1145" y="120" width="75" height="160" fill="#0a1220" />
                <rect x="1225" y="135" width="55" height="145" fill="#0d1628" />
                <rect x="1285" y="155" width="70" height="125" fill="#0a1220" />
                <rect x="1360" y="125" width="80" height="155" fill="#0d1628" />
                {[72, 80, 198, 206, 298, 308, 382, 390, 618, 628, 638, 758, 768, 888, 898, 908, 1032, 1042, 1152, 1162, 1172, 1232, 1242].map((x, i) => (
                    <rect key={i} x={x} y={130 + i % 4 * 18} width="4" height="4" fill="#fffaaa" opacity={0.3 + i % 3 * 0.2} />
                ))}
                <defs>
                    <linearGradient id="gnd" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#639922" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#0a0a09" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <rect x="0" y="240" width="1440" height="40" fill="url(#gnd)" />
            </svg>
        </div>
    )
}

export default function LandingPage() {
    const heroRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start']
    })
    const heroY = useTransform(heroScroll, [0, 1], ['0%', '35%'])
    const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0])
    const heroScale = useTransform(heroScroll, [0, 1], [1, 1.06])

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault()
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const PLANS = [
        { name: 'Free', price: '£0', period: 'forever', description: 'Try OpsHive with no commitment.', accent: 'rgba(255,255,255,0.4)', features: ['1 company', '3 agents', '5 crisis triggers per day', 'CEO war room brief', 'A2A message feed'], cta: 'Get started free', popular: false },
        { name: 'Founder', price: '£29', period: '/month', description: 'Everything a solo founder needs.', accent: '#639922', features: ['1 company', 'All 6 agents', 'Unlimited crisis triggers', 'CEO war room brief', 'Agent actions panel', 'CEO chat — ask anything', 'Custom company scenario'], cta: 'Launch OpsHive', popular: true },
        { name: 'Team', price: '£99', period: '/month', description: 'For small teams moving fast.', accent: '#378ADD', features: ['3 companies', 'All 6 agents per company', 'Unlimited triggers', 'Everything in Founder', 'Priority support', 'Team dashboard'], cta: 'Get started', popular: false },
        { name: 'Enterprise', price: 'POA', period: '', description: 'Custom agents for large teams.', accent: '#EF9F27', features: ['Unlimited companies', 'Custom agent builds', 'Private deployment', 'SLA guarantee', 'Dedicated support', 'API access'], cta: 'Contact us', popular: false }
    ]

    return (
        <main style={{ fontFamily: 'system-ui, sans-serif', background: '#050810', color: '#fff', overflowX: 'hidden' }}>
            <style>{`html { scroll-behavior: smooth; } * { box-sizing: border-box; }`}</style>

            {/* NAV */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 48px',
                    background: 'rgba(5,8,16,0.85)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[0, 1, 2].map(i => (
                            <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#639922', opacity: 1 - i * 0.25 }} />
                        ))}
                    </div>
                    <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                        Ops<span style={{ color: '#639922' }}>Hive</span>
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    {[['How it works', 'how-it-works'], ['Features', 'features'], ['Pricing', 'pricing']].map(([label, id]) => (
                        <a key={label} href={`#${id}`}
                            onClick={e => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, id)}
                            style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s', cursor: 'pointer' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                        >{label}</a>
                    ))}
                </div>
                <Link href="/login" style={{
                    background: '#639922', color: '#fff',
                    padding: '10px 22px', borderRadius: '8px',
                    fontSize: '13px', fontWeight: '600',
                    textDecoration: 'none', transition: 'background 0.2s, transform 0.2s'
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#7ab82a'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#639922'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                    Launch OpsHive
                </Link>
            </motion.nav>

            {/* HERO */}
            <section
                ref={heroRef}
                style={{
                    position: 'relative', minHeight: '100vh',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '120px 24px 200px', textAlign: 'center',
                    overflow: 'hidden'
                }}
            >
                <motion.div style={{ y: heroY, scale: heroScale, position: 'absolute', inset: 0 }}>
                    <CityBackground />
                </motion.div>

                <motion.div style={{ opacity: heroOpacity, position: 'relative', zIndex: 10, maxWidth: '820px' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(99,153,34,0.12)',
                            border: '1px solid rgba(99,153,34,0.35)',
                            borderRadius: '20px', padding: '6px 16px', marginBottom: '32px'
                        }}
                    >
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#639922' }} />
                        <span style={{ fontSize: '12px', color: '#a8d86e', fontWeight: '500', letterSpacing: '0.06em' }}>
                            BUILT AT GDG LONDON · AI DEVCAMP 2026
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <RotatingHeadline />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        style={{
                            fontSize: '18px', color: 'rgba(255,255,255,0.45)',
                            lineHeight: '1.7', margin: '0 auto 48px', maxWidth: '540px'
                        }}
                    >
                        Describe your company. Six AI agents wake up, monitor everything,
                        and act — so you can focus on what actually matters.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                        style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <Link href="/login" style={{
                            background: '#639922', color: '#fff',
                            padding: '15px 36px', borderRadius: '10px',
                            fontSize: '15px', fontWeight: '600',
                            textDecoration: 'none', transition: 'all 0.2s', letterSpacing: '-0.2px'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#7ab82a'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#639922'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                            Launch OpsHive →
                        </Link>
                        <a href="#how-it-works"
                            onClick={e => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, 'how-it-works')}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.75)',
                                padding: '15px 32px', borderRadius: '10px',
                                fontSize: '15px', fontWeight: '500',
                                textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            See how it works ↓
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.4 }}
                        style={{
                            marginTop: '64px',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '20px', flexWrap: 'wrap'
                        }}
                    >
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Powered by</span>
                        {['Google ADK', 'Gemini AI', 'Vertex AI', 'MCP + A2A'].map(tech => (
                            <span key={tech} style={{
                                fontSize: '12px', color: 'rgba(255,255,255,0.3)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                padding: '4px 14px', borderRadius: '20px', letterSpacing: '0.04em'
                            }}>{tech}</span>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" style={{ background: '#07090f', padding: '120px 24px', position: 'relative' }}>
                <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '500px', height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(99,153,34,0.5), transparent)'
                }} />
                <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{ textAlign: 'center', marginBottom: '72px' }}
                    >
                        <span style={{ fontSize: '11px', color: '#639922', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>
                            How it works
                        </span>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: '700', letterSpacing: '-1.5px', color: '#fff', margin: '12px 0 0', lineHeight: '1.1' }}>
                            From idea to running ops<br />
                            <span style={{ color: 'rgba(255,255,255,0.3)' }}>in under 60 seconds.</span>
                        </h2>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                        {[
                            { number: '01', accent: '#639922', title: 'You type. Agents listen.', stat: '< 60s', statLabel: 'to full setup', body: "Tell us your company name, industry and what you're building. No forms. No complexity. Just describe it like you would to a colleague." },
                            { number: '02', accent: '#378ADD', title: 'Six experts wake up.', stat: '6', statLabel: 'specialised agents', body: 'Sales, Finance, Marketing, Support, Ops and CEO agents each configure themselves specifically for your company. Powered by real Gemini AI reasoning.' },
                            { number: '03', accent: '#22C55E', title: 'They run. You build.', stat: '24/7', statLabel: 'always monitoring', body: 'Agents monitor your operations in real time, talk to each other via A2A protocol, and act autonomously. You make one decision. They handle everything else.' }
                        ].map((step, i) => (
                            <SpotlightCard key={i} delay={i * 0.15} accent={step.accent}>
                                <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', marginBottom: '28px' }}>{step.number}</div>
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ fontSize: '52px', fontWeight: '700', color: step.accent, letterSpacing: '-2px', lineHeight: '1', marginBottom: '4px' }}>{step.stat}</div>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>{step.statLabel}</div>
                                </div>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: '0 0 12px', letterSpacing: '-0.5px', lineHeight: '1.2' }}>{step.title}</h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.42)', lineHeight: '1.75', margin: 0 }}>{step.body}</p>
                                <div style={{
                                    position: 'absolute', bottom: '28px', right: '28px',
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    background: `${step.accent}18`, border: `1px solid ${step.accent}30`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '14px', color: step.accent
                                }}>→</div>
                            </SpotlightCard>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '48px', flexWrap: 'wrap' }}
                    >
                        {['Sales · Alex', 'Finance · Morgan', 'Marketing · Jamie', 'Support · Riley', 'Ops · Sam', 'CEO · Dana'].map((agent, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ background: 'rgba(99,153,34,0.1)', border: '1px solid rgba(99,153,34,0.25)', borderRadius: '20px', padding: '5px 14px', fontSize: '12px', color: '#a8d86e', fontWeight: '500' }}>{agent}</div>
                                {i < 5 && <div style={{ width: '12px', height: '1px', background: 'rgba(99,153,34,0.25)' }} />}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" style={{ background: '#050810', padding: '120px 24px', position: 'relative' }}>
                <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '500px', height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(55,138,221,0.5), transparent)'
                }} />
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{ textAlign: 'center', marginBottom: '72px' }}
                    >
                        <span style={{ fontSize: '11px', color: '#378ADD', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>Features</span>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: '700', letterSpacing: '-1.5px', color: '#fff', margin: '12px 0 0', lineHeight: '1.1' }}>
                            Built different.<br />
                            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Not just another chatbot.</span>
                        </h2>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        <SpotlightCard delay={0} accent="#639922" style={{ gridColumn: 'span 2' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <span style={{ fontSize: '10px', color: '#639922', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '600' }}>Agent Intelligence</span>
                                <div style={{ background: 'rgba(99,153,34,0.12)', border: '1px solid rgba(99,153,34,0.25)', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', color: '#a8d86e' }}>Live</div>
                            </div>
                            <div style={{ fontSize: '56px', fontWeight: '700', color: '#639922', letterSpacing: '-2px', lineHeight: '1', marginBottom: '8px' }}>6</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>specialised AI agents</div>
                            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', margin: '0 0 12px', letterSpacing: '-0.5px' }}>Not one AI trying to do everything.</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.75', margin: 0 }}>Six domain experts — each trained to reason about their specific area. Sales knows pipeline. Finance knows cash flow. Support knows tickets. They don't overlap. They collaborate.</p>
                        </SpotlightCard>

                        <SpotlightCard delay={0.1} accent="#378ADD">
                            <span style={{ fontSize: '10px', color: '#378ADD', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '600' }}>A2A Protocol</span>
                            <div style={{ fontSize: '48px', fontWeight: '700', color: '#378ADD', letterSpacing: '-2px', lineHeight: '1', margin: '16px 0 4px' }}>↗</div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: '0 0 10px', letterSpacing: '-0.4px' }}>Agents talk to each other.</h3>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7', margin: 0 }}>When Marketing spots a competitor price cut, it messages Sales directly. Real agent-to-agent communication. No human relay.</p>
                        </SpotlightCard>

                        <SpotlightCard delay={0.2} accent="#EF9F27">
                            <span style={{ fontSize: '10px', color: '#EF9F27', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '600' }}>CEO Agent</span>
                            <div style={{ fontSize: '48px', fontWeight: '700', color: '#EF9F27', letterSpacing: '-2px', lineHeight: '1', margin: '16px 0 4px' }}>◎</div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: '0 0 10px', letterSpacing: '-0.4px' }}>One brain synthesising everything.</h3>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7', margin: 0 }}>Dana Williams reads every signal from every agent and delivers a 60-second war room brief. Every. Single. Time.</p>
                        </SpotlightCard>

                        <SpotlightCard delay={0.3} accent="#E24B4A" style={{ gridColumn: 'span 2' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <span style={{ fontSize: '10px', color: '#E24B4A', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '600' }}>Autonomous Actions</span>
                            </div>
                            <div style={{ fontSize: '56px', fontWeight: '700', color: '#E24B4A', letterSpacing: '-2px', lineHeight: '1', marginBottom: '8px' }}>1</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>decision from you</div>
                            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 12px', letterSpacing: '-0.5px' }}>They act. You approve one thing.</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.75', margin: 0 }}>Agents don't just raise flags. They draft emails, escalate to engineering, update pipelines. When the CEO flags something suspicious — that's the one moment you step in.</p>
                        </SpotlightCard>

                        <SpotlightCard delay={0.4} accent="#22C55E">
                            <span style={{ fontSize: '10px', color: '#22C55E', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '600' }}>Personalised</span>
                            <div style={{ fontSize: '48px', fontWeight: '700', color: '#22C55E', letterSpacing: '-2px', lineHeight: '1', margin: '16px 0 4px' }}>◈</div>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: '0 0 10px', letterSpacing: '-0.4px' }}>Built for your company. Not every company.</h3>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7', margin: 0 }}>Describe what you're building. Agents configure around your industry, team size and goals.</p>
                        </SpotlightCard>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
                        {[
                            { n: '6', label: 'Specialised agents', color: '#639922' },
                            { n: '<60s', label: 'Setup time', color: '#378ADD' },
                            { n: '24/7', label: 'Always monitoring', color: '#EF9F27' },
                            { n: '1', label: 'Decision from you', color: '#E24B4A' },
                        ].map((s, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                                style={{ background: '#0a0d16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '24px', textAlign: 'center' }}
                            >
                                <div style={{ fontSize: '34px', fontWeight: '700', color: s.color, letterSpacing: '-1px', marginBottom: '6px' }}>{s.n}</div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section id="pricing" style={{ background: '#07090f', padding: '120px 24px', position: 'relative' }}>
                <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '500px', height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(99,153,34,0.5), transparent)'
                }} />
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{ textAlign: 'center', marginBottom: '72px' }}
                    >
                        <span style={{ fontSize: '11px', color: '#639922', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: '600' }}>Pricing</span>
                        <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: '700', letterSpacing: '-1.5px', color: '#fff', margin: '12px 0 0', lineHeight: '1.1' }}>
                            Start free.<br />
                            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Scale when you're ready.</span>
                        </h2>
                    </motion.div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                        {PLANS.map((plan, i) => <PricingCard key={i} plan={plan} delay={i * 0.1} />)}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section style={{ background: '#050810', padding: '140px 24px', position: 'relative', textAlign: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(99,153,34,0.06) 0%, transparent 70%)' }} />
                <div style={{ position: 'relative', zIndex: 10, maxWidth: '700px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        <h2 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: '700', letterSpacing: '-2px', color: '#fff', margin: '0 0 20px', lineHeight: '1.05' }}>
                            Your company deserves<br />
                            <span style={{ color: '#639922' }}>an AI ops team.</span>
                        </h2>
                        <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.7', margin: '0 auto 48px', maxWidth: '480px' }}>
                            Stop juggling everything alone. Launch OpsHive in 60 seconds and let six AI agents watch your back.
                        </p>
                        <Link href="/login" style={{
                            background: '#639922', color: '#fff',
                            padding: '16px 48px', borderRadius: '12px',
                            fontSize: '16px', fontWeight: '700',
                            textDecoration: 'none', display: 'inline-block',
                            transition: 'all 0.2s', letterSpacing: '-0.3px'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#7ab82a'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#639922'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                            Launch OpsHive — it's free →
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: '#07090f', padding: '80px 64px 48px', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)',
                    fontSize: 'clamp(100px, 20vw, 240px)', fontWeight: '800',
                    color: 'rgba(255,255,255,0.018)', whiteSpace: 'nowrap',
                    letterSpacing: '-6px', userSelect: 'none', pointerEvents: 'none', lineHeight: '1'
                }}>opshive</div>

                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', top: '40px', right: '120px', width: '300px', height: '300px', pointerEvents: 'none' }}
                >
                    <div style={{
                        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                        width: '80px', height: '80px',
                        background: 'radial-gradient(circle, rgba(99,153,34,0.25) 0%, transparent 70%)',
                        borderRadius: '50%', filter: 'blur(16px)'
                    }} />
                </motion.div>

                <div style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '80px', flexWrap: 'wrap', gap: '40px' }}>
                        <div style={{ maxWidth: '260px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[0, 1, 2].map(i => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#639922', opacity: 1 - i * 0.25 }} />)}
                                </div>
                                <span style={{ fontSize: '20px', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px' }}>
                                    Ops<span style={{ color: '#639922' }}>Hive</span>
                                </span>
                            </div>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.28)', margin: '0 0 24px', lineHeight: '1.7' }}>
                                The autonomous AI operations team for anyone building a company.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Built by</span>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <a href="https://meetbhorania.com" target="_blank" rel="noopener noreferrer"
                                        style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#639922'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                                    >Meet Bhorania ↗</a>
                                    <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                                    <a href="https://www.linkedin.com/in/manansuthar/" target="_blank" rel="noopener noreferrer"
                                        style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#639922'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                                    >Manan Suthar ↗</a>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
                            {[
                                { title: 'Product', links: [['How it works', '#how-it-works'], ['Features', '#features'], ['Pricing', '#pricing'], ['Launch OpsHive', '/login']] },
                                { title: 'Team', links: [['Meet Bhorania', 'https://meetbhorania.com'], ['LinkedIn — Meet', 'https://www.linkedin.com/in/meetbhorania'], ['Manan Suthar', 'https://www.linkedin.com/in/manansuthar/'], ['LinkedIn — Manan', 'https://www.linkedin.com/in/manansuthar/']] },
                                { title: 'Event', links: [['GDG London', '#'], ['AI DevCamp 2026', '#'], ['Google ADK', '#'], ['Gemini AI', '#']] }
                            ].map(col => (
                                <div key={col.title}>
                                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '600', margin: '0 0 20px' }}>{col.title}</p>
                                    {col.links.map(([label, href]) => (
                                        <a key={label} href={href}
                                            target={href.startsWith('http') ? '_blank' : undefined}
                                            rel="noopener noreferrer"
                                            onClick={href.startsWith('#') ? e => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, href.slice(1)) : undefined}
                                            style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '12px', transition: 'color 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                                        >{label}</a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.14)' }}>© 2026 OpsHive. Built with ♥ in London.</span>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.14)' }}>Powered by Google ADK · Gemini AI · Vertex AI</span>
                    </div>
                </div>
            </footer>
        </main>
    )
}