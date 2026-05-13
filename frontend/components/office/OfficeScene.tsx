'use client'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const STATUS_COLORS: Record<string, string> = {
  idle: '#639922',
  thinking: '#EF9F27',
  sending: '#378ADD',
  alert: '#E24B4A',
  completed: '#22C55E'
}

const DESK_POSITIONS: Record<string, [number, number, number]> = {
  sales: [-3.5, 0, 1],
  finance: [-1.2, 0, -1],
  marketing: [0.8, 0, 1],
  support: [3.0, 0, -1],
  ops: [0.8, 0, -2.5],
  ceo: [-1.2, 2.4, -4.2],
}

const LABELS: Record<string, string> = {
  sales: 'SALES', finance: 'FINANCE', marketing: 'MARKETING',
  support: 'SUPPORT', ops: 'OPS', ceo: 'CEO'
}

function Envelope({ start, end, onDone }: {
  start: [number, number, number]
  end: [number, number, number]
  onDone: () => void
}) {
  const ref = useRef<THREE.Mesh>(null)
  const t = useRef(0)
  const done = useRef(false)
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...start),
    new THREE.Vector3((start[0] + end[0]) / 2, Math.max(start[1], end[1]) + 4, (start[2] + end[2]) / 2),
    new THREE.Vector3(...end)
  ), [])

  useFrame((_, delta) => {
    if (!ref.current || done.current) return
    t.current = Math.min(t.current + delta * 0.5, 1)
    const pt = curve.getPoint(t.current)
    ref.current.position.copy(pt)
    ref.current.rotation.y += delta * 5
    const s = t.current > 0.85 ? Math.max(0, 1 - (t.current - 0.85) * 7) : 1
    ref.current.scale.setScalar(s)
    if (t.current >= 1) { done.current = true; onDone() }
  })

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.22, 0.15, 0.03]} />
      <meshStandardMaterial color="#ffffff" emissive="#378ADD" emissiveIntensity={3} />
    </mesh>
  )
}

function StaffMember({ position, shirtColor }: {
  position: [number, number, number]
  shirtColor: string
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.03
  })
  return (
    <group position={position}>
      {/* Desk */}
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.07, 0.62]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.16, 0.29]}>
        <boxGeometry args={[1.0, 0.3, 0.04]} />
        <meshStandardMaterial color="#d4c8b0" />
      </mesh>
      {[[-0.44, 0, -0.27], [0.44, 0, -0.27], [-0.44, 0, 0.27], [0.44, 0, 0.27]].map((p, i) => (
        <mesh key={i} position={p as any}>
          <boxGeometry args={[0.05, 0.32, 0.05]} />
          <meshStandardMaterial color="#c0b098" metalness={0.2} />
        </mesh>
      ))}
      {/* Monitor */}
      <mesh position={[0, 0.62, -0.22]}>
        <boxGeometry args={[0.48, 0.3, 0.04]} />
        <meshStandardMaterial color="#111110" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.62, -0.20]}>
        <boxGeometry args={[0.41, 0.23, 0.01]} />
        <meshStandardMaterial color="#1a3a5c" emissive="#1a3a5c" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.42, -0.18]}>
        <cylinderGeometry args={[0.02, 0.03, 0.12, 6]} />
        <meshStandardMaterial color="#333" metalness={0.6} />
      </mesh>
      {/* Keyboard */}
      <mesh position={[0, 0.36, 0.02]}>
        <boxGeometry args={[0.3, 0.02, 0.12]} />
        <meshStandardMaterial color="#1a1a18" roughness={0.9} />
      </mesh>
      {/* Mug */}
      <mesh position={[0.35, 0.39, -0.08]}>
        <cylinderGeometry args={[0.04, 0.035, 0.09, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Chair */}
      <mesh position={[0, 0.18, 0.34]} castShadow>
        <boxGeometry args={[0.52, 0.07, 0.50]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.42, 0.58]}>
        <boxGeometry args={[0.52, 0.42, 0.06]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Character */}
      <group ref={ref} position={[0, 0.6, 0.3]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.24, 0.30, 0.16]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        <mesh position={[0, 0.42, 0]} castShadow>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshStandardMaterial color="#f5deb3" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.52, -0.02]}>
          <sphereGeometry args={[0.09, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial color="#3d2b1f" />
        </mesh>
        <mesh position={[-0.17, 0.12, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.07, 0.22, 0.08]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
        <mesh position={[0.17, 0.12, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.07, 0.22, 0.08]} />
          <meshStandardMaterial color={shirtColor} />
        </mesh>
      </group>
    </group>
  )
}

function AgentDesk({ id, position, status, sendingTo }: {
  id: string
  position: [number, number, number]
  status: string
  sendingTo?: string
}) {
  const charRef = useRef<THREE.Group>(null)
  const lampRef = useRef<THREE.PointLight>(null)
  const [envs, setEnvs] = useState<number[]>([])
  const prevSend = useRef<string | undefined>(undefined)
  const isCeo = id === 'ceo'
  const color = STATUS_COLORS[status] || '#639922'

  useEffect(() => {
    if (sendingTo && sendingTo !== prevSend.current) {
      prevSend.current = sendingTo
      setEnvs(p => [...p, Date.now()])
    }
    if (!sendingTo) prevSend.current = undefined
  }, [sendingTo])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (charRef.current) {
      charRef.current.position.y =
        status === 'idle' ? Math.sin(t * 0.7 + position[0]) * 0.04
          : status === 'alert' ? 0.2 + Math.sin(t * 6) * 0.05
            : status === 'completed' ? Math.sin(t * 2) * 0.03 : 0
      charRef.current.rotation.x = status === 'thinking' ? -0.18 : 0
    }
    if (lampRef.current) {
      lampRef.current.color.set(color)
      lampRef.current.intensity = status === 'alert'
        ? 1.8 + Math.sin(t * 6) * 0.8
        : status === 'idle' ? 0.5 : 1.2
    }
  })

  const dW = isCeo ? 1.6 : 1.05
  const dD = isCeo ? 0.9 : 0.62

  return (
    <group position={position}>
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <boxGeometry args={[dW, 0.07, dD]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.16, dD / 2]}>
        <boxGeometry args={[dW, 0.3, 0.04]} />
        <meshStandardMaterial color="#d4c8b0" />
      </mesh>
      {[[-dW / 2 + 0.06, 0, -dD / 2 + 0.06], [dW / 2 - 0.06, 0, -dD / 2 + 0.06],
      [-dW / 2 + 0.06, 0, dD / 2 - 0.06], [dW / 2 - 0.06, 0, dD / 2 - 0.06]].map((p, i) => (
        <mesh key={i} position={p as any}>
          <boxGeometry args={[0.05, 0.32, 0.05]} />
          <meshStandardMaterial color="#c0b098" metalness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 0.62, -dD / 2 + 0.1]}>
        <boxGeometry args={[isCeo ? 0.62 : 0.5, isCeo ? 0.38 : 0.3, 0.04]} />
        <meshStandardMaterial color="#111110" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.62, -dD / 2 + 0.08]}>
        <boxGeometry args={[isCeo ? 0.54 : 0.43, isCeo ? 0.3 : 0.23, 0.01]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.42, -dD / 2 + 0.12]}>
        <cylinderGeometry args={[0.02, 0.03, 0.12, 6]} />
        <meshStandardMaterial color="#333" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.36, 0.02]}>
        <boxGeometry args={[0.32, 0.02, 0.13]} />
        <meshStandardMaterial color="#1a1a18" roughness={0.9} />
      </mesh>
      <mesh position={[dW / 2 - 0.18, 0.39, -0.08]}>
        <cylinderGeometry args={[0.04, 0.035, 0.09, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-dW / 2 + 0.2, 0.36, -0.06]}>
        <boxGeometry args={[0.18, 0.02, 0.14]} />
        <meshStandardMaterial color="#f8f6f0" />
      </mesh>
      <mesh position={[dW / 2 - 0.15, 0.37, 0.1]}>
        <cylinderGeometry args={[0.03, 0.05, 0.04, 8]} />
        <meshStandardMaterial color="#aaa" metalness={0.7} />
      </mesh>
      <mesh position={[dW / 2 - 0.15, 0.53, 0.1]}>
        <cylinderGeometry args={[0.015, 0.015, 0.26, 6]} />
        <meshStandardMaterial color="#aaa" metalness={0.7} />
      </mesh>
      <mesh position={[dW / 2 - 0.15, 0.68, 0.1]}>
        <sphereGeometry args={[0.065]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>
      <pointLight ref={lampRef} position={[dW / 2 - 0.15, 0.85, 0.1]} color={color} intensity={0.5} distance={2.5} />
      <mesh position={[0, 0.18, dD / 2 + 0.24]} castShadow>
        <boxGeometry args={[0.54, 0.07, 0.52]} />
        <meshStandardMaterial color={isCeo ? '#0f172a' : '#1e293b'} />
      </mesh>
      <mesh position={[0, 0.44, dD / 2 + 0.5]}>
        <boxGeometry args={[0.54, 0.44, 0.06]} />
        <meshStandardMaterial color={isCeo ? '#0f172a' : '#1e293b'} />
      </mesh>
      <group ref={charRef} position={[0, 0.6, dD / 2 + 0.22]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.26, 0.32, 0.18]} />
          <meshStandardMaterial color={isCeo ? '#0f172a' : '#334155'} />
        </mesh>
        <mesh position={[0, 0.28, 0.08]}>
          <boxGeometry args={[0.06, 0.1, 0.02]} />
          <meshStandardMaterial color={isCeo ? '#639922' : '#64748b'} />
        </mesh>
        <mesh position={[0, 0.47, 0]} castShadow>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#f5deb3" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.57, -0.02]}>
          <sphereGeometry args={[0.11, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial color={isCeo ? '#1a0a00' : '#3d2b1f'} />
        </mesh>
        <mesh position={[-0.2, 0.12, 0]} rotation={[0, 0, status === 'sending' ? -1.3 : 0.35]}>
          <boxGeometry args={[0.08, 0.26, 0.09]} />
          <meshStandardMaterial color={isCeo ? '#0f172a' : '#334155'} />
        </mesh>
        <mesh position={[0.2, 0.12, 0]} rotation={[0, 0, status === 'sending' ? 1.3 : -0.35]}>
          <boxGeometry args={[0.08, 0.26, 0.09]} />
          <meshStandardMaterial color={isCeo ? '#0f172a' : '#334155'} />
        </mesh>
        {status === 'thinking' && [-0.1, 0, 0.1].map((x, i) => (
          <mesh key={i} position={[x, 0.74, 0.1]}>
            <sphereGeometry args={[0.035]} />
            <meshStandardMaterial color="#EF9F27" emissive="#EF9F27" emissiveIntensity={3} />
          </mesh>
        ))}
        {status === 'alert' && (
          <mesh position={[0.18, 0.65, 0.1]}>
            <sphereGeometry args={[0.07]} />
            <meshStandardMaterial color="#E24B4A" emissive="#E24B4A" emissiveIntensity={4} />
          </mesh>
        )}
        {status === 'completed' && (
          <pointLight position={[0, 0.5, 0]} color="#22C55E" intensity={2} distance={2} />
        )}
      </group>
      {status !== 'idle' && (
        <mesh position={[0, 0.005, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.7, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} transparent opacity={0.6} />
        </mesh>
      )}
      <mesh position={[0, 0.06, dD / 2 + 0.06]}>
        <boxGeometry args={[0.68, 0.09, 0.02]} />
        <meshStandardMaterial color="#1a1a18" />
      </mesh>
      <Html position={[0, isCeo ? 1.9 : 1.5, 0]} center distanceFactor={7}>
        <div style={{
          background: 'rgba(8,8,7,0.92)', color: '#fff',
          padding: '4px 10px', borderRadius: '6px',
          fontSize: '10px', fontWeight: '700',
          whiteSpace: 'nowrap', border: `1.5px solid ${color}`,
          fontFamily: 'system-ui', letterSpacing: '0.07em',
          boxShadow: `0 0 10px ${color}55`, pointerEvents: 'none'
        }}>
          {LABELS[id]} <span style={{ color }}>● {status.toUpperCase()}</span>
        </div>
      </Html>
      {envs.map(eid => {
        const tp = sendingTo ? DESK_POSITIONS[sendingTo] : null
        if (!tp) return null
        return (
          <Envelope
            key={eid}
            start={[position[0], position[1] + 1.2, position[2]] as [number, number, number]}
            end={[tp[0], tp[1] + 1.2, tp[2]] as [number, number, number]}
            onDone={() => setEnvs(p => p.filter(e => e !== eid))}
          />
        )
      })}
    </group>
  )
}

function Office() {
  return (
    <group>
      {/* Wooden floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1.5]} receiveShadow>
        <planeGeometry args={[14, 11]} />
        <meshStandardMaterial color="#c8a878" roughness={0.85} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -6.5 + i * 1.1]}>
          <planeGeometry args={[14, 0.04]} />
          <meshStandardMaterial color="#a07848" />
        </mesh>
      ))}
      {/* Area rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0.002, -0.5]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color="#7a6548" roughness={1} />
      </mesh>

      {/* LEFT WALL — cream */}
      <mesh position={[-7, 2.2, -1.5]}>
        <boxGeometry args={[0.14, 4.4, 11]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.95} />
      </mesh>
      {/* RIGHT WALL — cream */}
      <mesh position={[7, 2.2, -1.5]}>
        <boxGeometry args={[0.14, 4.4, 11]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.95} />
      </mesh>
      {/* BACK WALL — cream */}
      <mesh position={[0, 2.2, -7]}>
        <boxGeometry args={[14.3, 4.4, 0.14]} />
        <meshStandardMaterial color="#f0ece4" roughness={0.95} />
      </mesh>
      {/* NO CEILING — open top */}
      {/* NO FRONT WALL — open front */}

      {/* Skirting boards */}
      <mesh position={[-7, 0.08, -1.5]}>
        <boxGeometry args={[0.18, 0.16, 11]} />
        <meshStandardMaterial color="#e0d8cc" />
      </mesh>
      <mesh position={[7, 0.08, -1.5]}>
        <boxGeometry args={[0.18, 0.16, 11]} />
        <meshStandardMaterial color="#e0d8cc" />
      </mesh>
      <mesh position={[0, 0.08, -7]}>
        <boxGeometry args={[14.3, 0.16, 0.18]} />
        <meshStandardMaterial color="#e0d8cc" />
      </mesh>

      {/* Ceiling light strips — even without ceiling */}
      {[[-3.5, 4.2, 0], [0, 4.2, 0], [3.5, 4.2, 0],
      [-3.5, 4.2, -3.5], [0, 4.2, -3.5], [3.5, 4.2, -3.5]].map((p, i) => (
        <group key={i}>
          <mesh position={p as any}>
            <cylinderGeometry args={[0.18, 0.18, 0.05, 16]} />
            <meshStandardMaterial color="#fff" emissive="#fffcf0" emissiveIntensity={2} />
          </mesh>
          <pointLight position={[p[0], p[1] - 0.3, p[2]]} color="#fffaee" intensity={1.1} distance={6} />
        </group>
      ))}

      {/* CEO platform */}
      <mesh position={[-1.2, 2.18, -4.8]} receiveShadow castShadow>
        <boxGeometry args={[5, 0.14, 4]} />
        <meshStandardMaterial color="#d4b896" roughness={0.7} />
      </mesh>
      {[0, 1].map(i => (
        <mesh key={i} position={[-1.2, 0.92 + i * 0.55, -2.5 - i * 0.45]}>
          <boxGeometry args={[3.8, 0.12, 0.52]} />
          <meshStandardMaterial color={i === 0 ? '#d0b898' : '#c8b090'} />
        </mesh>
      ))}
      {[-2.8, -1.8, -0.8, 0.2, 1.2, 2.2].map((x, i) => (
        <mesh key={i} position={[x, 2.58, -2.8]}>
          <cylinderGeometry args={[0.025, 0.025, 0.55, 6]} />
          <meshStandardMaterial color="#c0a880" metalness={0.4} />
        </mesh>
      ))}
      <mesh position={[-1.2, 2.82, -2.8]}>
        <boxGeometry args={[4.5, 0.04, 0.04]} />
        <meshStandardMaterial color="#c0a880" metalness={0.4} />
      </mesh>

      {/* Whiteboards */}
      {[[-5.8, 2.4, -6.92], [5.5, 2.4, -6.92]].map((p, i) => (
        <group key={i}>
          <mesh position={p as any}>
            <boxGeometry args={[2.4, 1.5, 0.06]} />
            <meshStandardMaterial color="#f8f8f5" roughness={0.3} />
          </mesh>
          <mesh position={[p[0], p[1], p[2] + 0.03]}>
            <boxGeometry args={[2.1, 1.25, 0.01]} />
            <meshStandardMaterial color="#fefefe" />
          </mesh>
          {[0, 1, 2].map(j => (
            <mesh key={j} position={[p[0] - 0.5 + j * 0.5, p[1] - 0.1 + j * 0.12, p[2] + 0.04]}>
              <boxGeometry args={[0.55, 0.018, 0.01]} />
              <meshStandardMaterial
                color={['#639922', '#378ADD', '#E24B4A'][j]}
                emissive={['#639922', '#378ADD', '#E24B4A'][j]}
                emissiveIntensity={1}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Bookshelf */}
      <mesh position={[-6.88, 1.5, -4]}>
        <boxGeometry args={[0.3, 3, 1.5]} />
        <meshStandardMaterial color="#c8a878" roughness={0.7} />
      </mesh>
      {[0, 1, 2, 3, 4].map(i => (
        <mesh key={i} position={[-6.73, 0.4 + i * 0.5, -4]}>
          <boxGeometry args={[0.12, 0.35, 1.2]} />
          <meshStandardMaterial color={['#639922', '#378ADD', '#E24B4A', '#EF9F27', '#8B4513'][i]} />
        </mesh>
      ))}

      {/* Water cooler */}
      <mesh position={[6.3, 0.6, -2]}>
        <cylinderGeometry args={[0.18, 0.16, 1.2, 12]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[6.3, 1.3, -2]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#a8d4f0" transparent opacity={0.7} />
      </mesh>

      {/* Sofa */}
      <mesh position={[5.5, 0.22, 2.8]}>
        <boxGeometry args={[1.8, 0.35, 0.82]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>
      <mesh position={[5.5, 0.54, 3.2]}>
        <boxGeometry args={[1.8, 0.62, 0.12]} />
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </mesh>
      <mesh position={[4.62, 0.4, 2.9]}>
        <boxGeometry args={[0.12, 0.35, 0.82]} />
        <meshStandardMaterial color="#3d4a5a" roughness={0.8} />
      </mesh>
      <mesh position={[6.38, 0.4, 2.9]}>
        <boxGeometry args={[0.12, 0.35, 0.82]} />
        <meshStandardMaterial color="#3d4a5a" roughness={0.8} />
      </mesh>
      <mesh position={[5.5, 0.22, 2.0]}>
        <boxGeometry args={[1.0, 0.06, 0.55]} />
        <meshStandardMaterial color="#c8a878" roughness={0.5} />
      </mesh>

      {/* Plants */}
      {[[-6.3, 0, 3.8], [6.3, 0, 3.8], [6.3, 0, -6.3], [-6.3, 0, -6.3], [-6.3, 0, 0], [6.3, 0, 0]].map((p, i) => (
        <group key={i} position={p as any}>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.19, 0.15, 0.42, 8]} />
            <meshStandardMaterial color="#7B4A2A" roughness={1} />
          </mesh>
          <mesh position={[0, 0.62, 0]}>
            <sphereGeometry args={[0.33, 10, 10]} />
            <meshStandardMaterial color="#2d6b1a" roughness={1} />
          </mesh>
          <mesh position={[0.16, 0.74, 0.1]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#3d7b22" roughness={1} />
          </mesh>
        </group>
      ))}

      {/* City skyline buildings in background */}
      {[
        [-12, 0, -15, 1.5, 8, 2], [-9, 0, -15, 2, 6, 2], [-6, 0, -16, 1, 10, 1.5],
        [-3, 0, -15, 1.8, 7, 2], [0, 0, -16, 1.2, 9, 1.5], [3, 0, -15, 2, 5, 2],
        [6, 0, -16, 1, 11, 1.5], [9, 0, -15, 1.8, 6, 2], [12, 0, -15, 1.5, 8, 2],
        [-11, 0, -18, 1, 5, 1], [11, 0, -18, 1, 5, 1], [-7, 0, -18, 1.2, 4, 1], [7, 0, -18, 1.2, 4, 1]
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={i} position={[x, h / 2, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#1a2a3a" roughness={0.9} />
        </mesh>
      ))}

      {/* Building windows */}
      {[
        [-12, 4, -14.9], [-9, 3, -14.9], [-6, 5, -15.9], [3, 2, -14.9],
        [6, 5, -15.9], [9, 3, -14.9], [12, 4, -14.9], [0, 4, -15.9]
      ].map((p, i) => (
        <mesh key={i} position={p as any}>
          <boxGeometry args={[0.3, 0.3, 0.01]} />
          <meshStandardMaterial color="#fffaaa" emissive="#fffaaa" emissiveIntensity={2} />
        </mesh>
      ))}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0d1117" />
      </mesh>
      <gridHelper args={[80, 80, '#1a2233', '#141a26']} position={[0, 0, 0]} />

      {/* Street lights outside */}
      {[[-10, 0, 5], [10, 0, 5], [-10, 0, -8], [10, 0, -8]].map((p, i) => (
        <group key={i} position={p as any}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 3, 8]} />
            <meshStandardMaterial color="#555" metalness={0.6} />
          </mesh>
          <mesh position={[0, 3.1, 0]}>
            <sphereGeometry args={[0.15]} />
            <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={2} />
          </mesh>
          <pointLight position={[0, 3, 0]} color="#ffffaa" intensity={0.6} distance={6} />
        </group>
      ))}

      {/* Warm interior fill lights */}
      <pointLight position={[0, 3, 0]} color="#fffaee" intensity={0.5} distance={12} />
      <pointLight position={[-5, 2, 0]} color="#fff8e8" intensity={0.4} distance={8} />
      <pointLight position={[5, 2, 0]} color="#fff8e8" intensity={0.4} distance={8} />
    </group>
  )
}

interface AgentState {
  id: string
  name: string
  status: string
  currentTask: string
  sendingTo?: string
}

export default function OfficeScene() {
  const [agents, setAgents] = useState<AgentState[]>([])
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('https://opshive-production.up.railway.app/agents/status')
        const data = await res.json()
        setAgents(data.agents || [])
      } catch { }
    }
    poll()
    const interval = setInterval(poll, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={canvasRef}
      style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(180deg, #0a0e1a 0%, #0d1628 25%, #0f2a4a 55%, #1a2a1a 100%)',
        cursor: 'grab'
      }}
      onMouseDown={() => { if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing' }}
      onMouseUp={() => { if (canvasRef.current) canvasRef.current.style.cursor = 'grab' }}
    >
      <Canvas
        camera={{ position: [10, 9, 10], fov: 40 }}
        shadows={{ type: THREE.PCFShadowMap }}
        style={{ width: '100%', height: '100%' }}
        gl={{ alpha: true }}
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.5} color="#fff8f0" />
        <directionalLight
          position={[8, 14, 8]} intensity={1.0} color="#fffdf8"
          castShadow shadow-mapSize={[2048, 2048]}
          shadow-camera-far={40} shadow-camera-left={-14}
          shadow-camera-right={14} shadow-camera-top={14}
          shadow-camera-bottom={-14}
        />
        <hemisphereLight args={['#ffffff', '#e8f0ff', 0.6]} />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={28}
          target={[0, 1, -1.5]}
        />

        <Office />

        <StaffMember position={[5.2, 0, 1.5]} shirtColor="#2d4a6b" />
        <StaffMember position={[-5.0, 0, 0.5]} shirtColor="#4a2d6b" />
        <StaffMember position={[4.5, 0, -2.5]} shirtColor="#2d6b4a" />
        <StaffMember position={[-4.5, 0, -3.0]} shirtColor="#6b4a2d" />

        {Object.entries(DESK_POSITIONS).map(([id, pos]) => {
          const agent = agents.find(a => a.id === id)
          return (
            <AgentDesk
              key={id}
              id={id}
              position={pos}
              status={agent?.status || 'idle'}
              sendingTo={agent?.sendingTo}
            />
          )
        })}

        <fog attach="fog" args={['#0f2a4a', 24, 55]} />
      </Canvas>
    </div>
  )
}