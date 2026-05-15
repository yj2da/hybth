'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  delay: number
  duration: number
  color: string
  size: number
  shape: 'square' | 'heart' | 'star'
}

const COLORS = ['#f0c060', '#e05050', '#60c060', '#6090e0', '#e060c0', '#c060e0', '#60e0e0']
const SHAPES: Particle['shape'][] = ['square', 'heart', 'star']

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

export default function PixelConfetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!active) return

    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: randomBetween(2, 98),
      delay: randomBetween(0, 2),
      duration: randomBetween(3, 6),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.floor(randomBetween(6, 16)),
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    }))
    setParticles(newParticles)

    const timer = setTimeout(() => setParticles([]), 7000)
    return () => clearTimeout(timer)
  }, [active])

  if (!active && particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            color: p.color,
            fontSize: p.size,
            imageRendering: 'pixelated',
            animation: `confetti-fall ${p.duration}s ${p.delay}s linear forwards`,
          }}
        >
          {p.shape === 'square' ? (
            <div style={{ width: p.size, height: p.size, background: p.color }} />
          ) : p.shape === 'heart' ? (
            <span style={{ color: p.color, fontSize: p.size, lineHeight: 1 }}>♥</span>
          ) : (
            <span style={{ color: p.color, fontSize: p.size, lineHeight: 1 }}>★</span>
          )}
        </div>
      ))}
    </div>
  )
}
